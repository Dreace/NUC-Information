import tornado.ioloop
import tornado.web
import tornado.httpserver
import tornado.concurrent
import tornado.gen
import tornado.log
import tornado.options
import logging
import importlib
from concurrent.futures import ThreadPoolExecutor,wait
import traceback
import json
import os
import main
from iCal import toiCal
from Checker import StartCheck
MainEditTime = 0
def CheckMain():
    global MainEditTime
    EditTime = os.stat("main.py").st_ctime 
    if EditTime > MainEditTime:
        reload(main)
        MainEditTime = EditTime
class grade(tornado.web.RequestHandler):
    @property
    def executor(self):
        return self.application.executor

    @tornado.gen.coroutine
    def get(self):
        CheckMain()
        name=self.get_argument("name","")
        passwd=self.get_argument("passwd","")
        try:
            main =  importlib.import_module('main')
            self.set_header('Content-Type', 'application/json; charset=UTF-8')
            text = yield self.executor.submit(main.get_grade,name,passwd)
            data= json.dumps(text).replace('u\'', '\'').decode("unicode-escape")
            self.write(data)
            self.finish()
        except:
            print(traceback.format_exc())
            self.set_header('Content-Type', 'application/json; charset=UTF-8')
            data=json.dumps([{"code": "-1"}, {"count": 0}]).replace('u\'', '\'').decode("unicode-escape")
            self.write(data)
            self.finish()
class getdate(tornado.web.RequestHandler):
    def get(self):
        f = open('date.txt', 'r')
        self.write(f.read())
        f.close()
        self.finish()
class getproxystate(tornado.web.RequestHandler):
    def get(self):
        f = open('proxystate.txt', 'r')
        self.write(f.read())
        f.close()
        self.finish()

class load(tornado.web.RequestHandler):
    def get(self):
        f = open('load.txt', 'r')
        self.write(f.read())
        f.close()
        self.finish()
class coursetable(tornado.web.RequestHandler):
    @property
    def executor(self):
        return self.application.executor

    @tornado.gen.coroutine
    def get(self):
        name=self.get_argument("name","")
        passwd=self.get_argument("passwd","")
        try:
            self.set_header('Content-Type', 'application/json; charset=UTF-8')
            text = yield self.executor.submit(main.get_course_table,name,passwd)
            data=json.dumps(text).replace('u\'', '\'').decode("unicode-escape")
            self.write(data)
            self.finish()
        except:
            print(traceback.format_exc())
            self.set_header('Content-Type', 'application/json; charset=UTF-8')
            data=json.dumps([{"code": "-1"}, {"count": 0}]).replace('u\'', '\'').decode("unicode-escape")
            self.write(data)
            self.finish()
class test(tornado.web.RequestHandler):
    @property
    def executor(self):
        return self.application.executor

    @tornado.gen.coroutine
    def get(self):
        name=self.get_argument("name","")
        passwd=self.get_argument("passwd","")
        try:
            self.set_header('Content-Type', 'application/json; charset=UTF-8')
            text = yield self.executor.submit(main.testac,name,passwd)
            data=json.dumps(text).replace('u\'', '\'').decode("unicode-escape")
            self.write(data)
            self.finish()
        except:
            print(traceback.format_exc())
            self.set_header('Content-Type', 'application/json; charset=UTF-8')
            data=json.dumps([{"code": "-1"}, {"count": 0}]).replace('u\'', '\'').decode("unicode-escape")
            self.write(data)
            self.finish()
class ical(tornado.web.RequestHandler):
    @property
    def executor(self):
        return self.application.executor

    @tornado.gen.coroutine
    def post(self):
        arguments = json.loads(self.request.body.decode('utf-8'))
        data=arguments["data"]
        firtMonday=arguments["firtMonday"]
        #print(data,firtMonday)
        try:
            text = yield self.executor.submit(toiCal,data,firtMonday)
            logging.info(" url:"+text)
            self.write(text)
            self.finish()
        except:
            print(traceback.format_exc())
            logging.error("iCal Error")
            self.write("iCal Generate Errors")
            self.finish()
 
class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", grade),
            (r"/coursetable",coursetable),
            (r"/getdate",getdate),
            (r"/test",test),
            (r"/getproxystate",getproxystate),
            (r"/load",load),
            (r"/ical",ical)
        ]
        settings = dict(
            compress_response=True
        )
        super(Application, self).__init__(handlers,**settings)

        self.executor = tornado.concurrent.futures.ThreadPoolExecutor(256)
if __name__ == "__main__":
    MainEditTime = os.stat("main.py").st_ctime
    StartCheck()
    tornado.options.define("port", default=83, help="run on the given port", type=int)
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application(),xheaders=True,decompress_request=True)
    http_server.listen(tornado.options.options.port)
    tornado.ioloop.IOLoop.current().start()

