import tornado.ioloop
import tornado.web
import tornado.httpserver
import tornado.concurrent
import tornado.gen
import tornado.log
import tornado.options
import logging
from concurrent.futures import ThreadPoolExecutor
import traceback
from Vcode import Base64ImageToVcode
class code(tornado.web.RequestHandler):
    @property
    def executor(self):
        return self.application.executor

    @tornado.gen.coroutine
    def get(self):
		base64pic=self.get_argument("base64pic","")
		try:
			self.set_header('Content-Type', 'application/json; charset=UTF-8')
			vcode=yield self.executor.submit(Base64ImageToVcode,base64pic)
			self.write(vcode)
			self.finish()
		except:
			print(traceback.format_exc())
			self.write("0")
			self.finish()
 
class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
			(r"/", code)
        ]
        super(Application, self).__init__(handlers)

        self.executor = tornado.concurrent.futures.ThreadPoolExecutor(64)
if __name__ == "__main__":
    tornado.options.define("port", default=85, help="run on the given port", type=int)
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application(),xheaders=True)
    http_server.listen(tornado.options.options.port)
    tornado.ioloop.IOLoop.current().start()

