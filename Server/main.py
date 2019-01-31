# coding=utf-8
import StringIO
import traceback
import base64
import sys
import collections
import requests
import bs4
import re
import time
import timeout_decorator
import json
import logging
import random
import string
import os
import subprocess
from PIL import Image

reload(sys)
sys.setdefaultencoding("utf-8")
headers = {
    'Host': 'ca.nuc.edu.cn',
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'Upgrade-Insecure-Requests': '1',
    'DNT': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Referer': 'https://ca.nuc.edu.cn/zfca/login',
    'Origin': 'https://ca.nuc.edu.cn',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9'
}
headers2 = {
    'origin': "https//ca.nuc.edu.cn",
    'x-devtools-emulate-network-conditions-client-id': "9497628b-38b3-47a8-b563-266e8ccd3a1d",
    'upgrade-insecure-requests': "1",
    'user-agent': "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
    'content-type': "application/x-www-form-urlencoded",
    'accept': "*/*",
    'referer': "",
    'accept-encoding': "gzip, deflate, br",
    'accept-language': "zh-CN,zh;q=0.8",
    'cache-control': "no-cache",
    'postman-token': "7eb9be3a-35b0-2ad5-37ba-564d9b95895a"
}
dwr_url = "http://i.nuc.edu.cn/dwr/call/plaincall/portalAjax.getAppList.dwr"
caurl = "https://ca.nuc.edu.cn/zfca/login"
mainurl = "http://i.nuc.edu.cn/portal.do"
vcodeurl = "https://ca.nuc.edu.cn/zfca/captcha.htm"
crediturl = "http://202.207.177.39:8088/gradeLnAllAction.do?oper=fainfo"
gradeurl = "http://202.207.177.39:8088/gradeLnAllAction.do?oper=lnFajhKcCjInfo"
coursetableurl = "http://202.207.177.39:8088/lnkbcxAction.do"
proxies = {"http": "http://1.2.3.4:888", "https": "http://1.2.3.4:888"}
ocrurl = "http://1.2.3.4/?base64pic="

def autoVcode(pic):
    base64_data = base64.b64encode(pic)
    r = requests.get(ocrurl+base64_data)
    vcode = r.content
    return vcode[0:4]

def get_term_code(session):
    html = session.post(coursetableurl, data={"zxjxjhh": "1234567"}, proxies=proxies).content.decode("gbk")
    soups = bs4.BeautifulSoup(html, "lxml")
    ops = soups.find_all("option")
    terms = []
    for op in ops:
        terms.append({"value": op.attrs["value"], "name": op.text})
    return terms

@timeout_decorator.timeout(55, use_signals=False)
def get_course_table(name, passwd):
    session = login(name, passwd)
    if session == 2:
        return [{"code": "2"}]
    elif session == 1:
        return [{"code": "1"}]
    # if session.redirect_cache:
    coursetable = []
    coursetable.append({"code": "0"})
    coursetable.append({"count": 0})
    i = 0
    for termcode in get_term_code(session):
        _html = session.post(coursetableurl, data={"zxjxjhh": termcode["value"]}, proxies=proxies).content.decode("gbk")
        t = handle_coursetable_html(_html)
        coursetable[0]["code"] = "200"
        coursetable.append([i + 1, termcode["name"], t])
        i += 1
    coursetable[1]["count"] = i
    return coursetable


def handle_coursetable_html(html):
    html = html.replace("\n", "").replace("\r", "").replace("\t", "")
    soups = bs4.BeautifulSoup(html, "lxml")
    tables = soups.select("table.titleTop2")
    # print(t)
    t = tables[1]
    terms = []
    cnt = -1
    for tr in t.select("table.displayTag > tbody > tr"):
        tds = tr.find_all("td")
        if len(tds[0].attrs) <= 0:
            table_ = terms[-1]
            table = collections.OrderedDict([(u"Course_Number", table_["Course_Number"]),
                                             (u"Course_Name", table_["Course_Name"]),
                                             (u"Course_Credit", table_["Course_Credit"]),
                                             (u"Course_Attribute", table_["Course_Attribute"]),
                                             (u"Course_Test_Type", table_["Course_Test_Type"]),
                                             (u"Course_Teacher", table_["Course_Teacher"]),
                                             (u"Course_Week", table_["Course_Week"]),
                                             (u"Course_Color", cnt),
                                             (u"Course_Time", handletostring(tds[1].contents)),
                                             (u"Course_Start", handletostring(tds[2].contents)),
                                             (u"Course_Length", handletostring(tds[3].contents)),
                                             (u"Course_Building", handletostring(tds[5].contents)),
                                             (u"Course_Classroom", handletostring(tds[6].contents))])
            terms.append(table)
        else:
            cnt+=1
            table = collections.OrderedDict([(u"Course_Number", handletostring(tds[1].contents)),
                                             (u"Course_Name", handletostring(tds[2].contents)),
                                             (u"Course_Credit", handletostring(tds[4].contents)),
                                             (u"Course_Attribute", handletostring(tds[5].contents)),
                                             (u"Course_Test_Type", handletostring(tds[6].contents)),
                                             (u"Course_Teacher", handletostring(tds[7].contents).replace("*", "")),
                                             (u"Course_Week", handletostring(tds[10].contents)),
                                             (u"Course_Color", cnt),
                                             (u"Course_Time", handletostring(tds[11].contents)),
                                             (u"Course_Start", handletostring(tds[12].contents)),
                                             (u"Course_Length", handletostring(tds[13].contents)),
                                             (u"Course_Building", handletostring(tds[15].contents)),
                                             (u"Course_Classroom", handletostring(tds[16].contents))])
            terms.append(table)
    return terms



def handletostring(data):
    if data == []:
        return ""
    else:
        return data[0].replace(" ", "")

@timeout_decorator.timeout(55, use_signals=False)
def get_grade(name, passwd):
    session = login(name, passwd)
    if session == 2:
        return [{"code": "2"}]
    elif session == 1:
        return [{"code": "1"}]
    credits = get_credits(session)
    grade_html = session.get(gradeurl, proxies=proxies).content.decode("gbk")
    term_code = get_term_code(session)
    grades = handle_grade_html(grade_html, credits, term_code)
    return grades


def get_credits(session):
    r = session.get(crediturl, proxies=proxies)
    html = r.content
    html = html.replace("\n", "").replace("\r", "").replace("\t", "")
    soups = bs4.BeautifulSoup(html, "html.parser")
    tables = soups.select("table.displayTag")
    t = tables[0]
    credits = {}
    for tr in t.select("tr"):
        tds = tr.find_all("td")
        if tds:
            credits[tds[0].contents[0].replace(" ", "")] = tds[4].contents[0].replace(" ", "")
    # print(credits)
    return credits


def to_string(t):
    string = ""
    for s in t.stripped_strings:
        string += s + " "
    return string


def handle_grade_html(html, credits, term_code):
    # html = html.replace("\n", "").replace("\r", "").replace("\t", "")
    soups = bs4.BeautifulSoup(html, "lxml")
    grades = []
    grades.append({"code": "0"})
    grades.append({"count": 0})
    i = 0
    for term in term_code:
        terms = []
        reu = re.findall(term["name"].replace("(", "\(").replace(")", "\)") + ur"计划.课程成绩(.*?)已修学分", to_string(soups))
        for a in reu:
            for m in re.findall(r"[A-Z0-9]{5,}.*?[0-9]{8}", a):
                replace_dict = {"Excel ": "Excel", " 实验": "实验", u" （": u"（",
                                "3ds Max": "3ds_Max", "MS office ": "MS_office"}
                for k in replace_dict:
                    m = m.replace(k, replace_dict[k])
                ms = m.split(" ")
                if ms[0] not in credits:
                    continue
                if len(ms) < 5:
                    ms[3] = ms[2]
                    ms[2] = 'N/A'
                grade = collections.OrderedDict([(u"Course_Number", ms[0]),
                                                 (u"Course_Name", ms[1]),
                                                 (u"Course_Credit", credits[ms[0]]),
                                                 (u"Course_Attribute", ms[2]),
                                                 (u"Course_Grade", ms[3])])

                terms.append(grade)
                grades[0]["code"] = "200"
        if terms != []:
            terms.append(calculate_GPAWithoutElectiveCourse(terms))
            terms.append(calculate_GPA(terms))
            if i+1==len(term_code):
                terms.append(fun1())
                terms.append(fun2())
            grades.append([i + 1, term["name"], terms])
        else:
            i -= 1
        i += 1
    grades[1]["count"] = i

    return grades


g1, w1 = 0, 0
g2, w2 = 0, 0

def fun1():
    GPA = 0
    try:
        GPA = round(g1 / w1, 2)
    except Exception, e:
        print(traceback.format_exc())
    if not GPA > 0:
        GPA = "N/A"
    gpa = collections.OrderedDict([(u"Course_Number", " "),
                                   (u"Course_Order", " "),
                                   (u"Course_Name", "全部学期平均绩点(必修)"),
                                   (u"Course_English_Name", "GPA"),
                                   (u"Course_Credit", " "),
                                   (u"Course_Attribute", "GPA"),
                                   (u"Course_Grade", str(GPA))])
    return gpa
def fun2():
    GPA = 0
    try:
        GPA = round(g2 / w2, 2)
    except Exception, e:
        print(traceback.format_exc())
    if not GPA > 0:
        GPA = "N/A"
    gpa = collections.OrderedDict([(u"Course_Number", " "),
                                   (u"Course_Order", " "),
                                   (u"Course_Name", "全部学期平均绩点(全部)"),
                                   (u"Course_English_Name", "GPA"),
                                   (u"Course_Credit", " "),
                                   (u"Course_Attribute", "GPA"),
                                   (u"Course_Grade", str(GPA))])
    return gpa
def calculate_GPAWithoutElectiveCourse(course):
    global g1,w1
    g, w = 0, 0
    GPA = 0
    try:
        for c in course:
            if c["Course_Attribute"] != "必修":
                continue
            if c["Course_Credit"] == "null":
                continue
            credit = float(c["Course_Credit"])
            if credit == 0:
                continue
            score = c["Course_Grade"].replace(" ", "")
            if score == "优秀":
                g += 4.5 * credit
            elif score == "良好":
                g += 3.5 * credit
            elif score == "中" or score == "中等":
                g += 2.5 * credit
            elif score == "及格":
                g += 1.5 * credit
            elif score == "不及格":
                pass
            else:
                g += (float(score) / 10 - 5) * credit
            w += credit
        GPA = round(g / w, 2)
        g1+=g
        w1+=w
    except Exception, e:
        print(traceback.format_exc())
    if not GPA > 0:
        GPA = "N/A"
    gpa = collections.OrderedDict([(u"Course_Number", " "),
                                   (u"Course_Order", " "),
                                   (u"Course_Name", "本学期平均绩点(必修)"),
                                   (u"Course_English_Name", "GPA"),
                                   (u"Course_Credit", " "),
                                   (u"Course_Attribute", "GPA"),
                                   (u"Course_Grade", str(GPA))])
    return gpa


def calculate_GPA(course):
    global g2,w2
    g, w = 0, 0
    GPA = 0
    try:
        for c in course:
            if c["Course_Attribute"] == "GPA":
                continue
            if c["Course_Credit"] == "null":
                continue
            credit = float(c["Course_Credit"])
            if credit == 0:
                continue
            score = c["Course_Grade"].replace(" ", "")
            if score == "优秀":
                g += 4.5 * credit
            elif score == "良好":
                g += 3.5 * credit
            elif score == "中" or score == "中等":
                g += 2.5 * credit
            elif score == "及格":
                g += 1.5 * credit
            elif score == "不及格":
                pass
            else:
                g += (float(score) / 10 - 5) * credit
            w += credit
        GPA = round(g / w, 2)
        g2+=g
        w2+=w
    except Exception, e:
        print(traceback.format_exc())
    if not GPA > 0:
        GPA = "N/A"
    gpa = collections.OrderedDict([(u"Course_Number", " "),
                                   (u"Course_Order", " "),
                                   (u"Course_Name", "本学期平均绩点(全部)"),
                                   (u"Course_English_Name", "GPA"),
                                   (u"Course_Credit", " "),
                                   (u"Course_Attribute", "GPA"),
                                   (u"Course_Grade", str(GPA))])
    return gpa


def login(name, passwd, vcode="", cookie=""):
    session = requests.session()
    session.headers = headers
    exitflag = 1
    i = 0
    while exitflag:
        r = session.get(caurl, proxies=proxies)
        reg = r'<input type="hidden" name="lt" value="(.*)" />'
        pattern = re.compile(reg)
        result = pattern.findall(r.content)
        token = result[0]
        if cookie == "":
            pic = session.get(vcodeurl, proxies=proxies).content
            vcode = autoVcode(pic)
            logging.info("vcode:"+vcode)
        else:
            cookies = requests.utils.cookiejar_from_dict({"JSESSIONID": cookie}, cookiejar=None, overwrite=True)
            session.cookies = cookies
        postdata = {"username": name,
                    "password": passwd,
                    "j_captcha_response": vcode,
                    "lt": token,
                    "useValidateCode": "1",
                    "isremenberme": "0",
                    "ip": "",
                    "losetime": "30",
                    "_eventId": "submit",
                    "submit1": ""}
        postdata2 = {
            'callCount': '1',
            'page': '0',
            'httpSessionId': '',
            'scriptSessionId': '',
            'c0-scriptName': 'portalAjax',
            'c0-methodName': 'getAppList',
            'c0-id': '0',
            'c0-param0': 'string:142104994847723324',
            'batchId': '1'
        }
        # print vcode
        # print len(vcode)
        r = session.post(caurl, data=postdata, proxies=proxies)
        if r.content.decode("gbk").find(u"用户名或密码错误") != -1:
            return 2
        # print  r.url, r.status_code
        if re.search(r'ticket', r.url):
            exitflag = 0
        if i >= 10:
            return 1
        i += 1
    headers2["referer"] = r.url
    r = session.post(dwr_url, headers=headers2, data=postdata2, proxies=proxies)
    reg = r'\?yhlx=student\&login=(\d+)\&url=zf_loginAction\.do'
    pattern = re.compile(reg)
    result = pattern.findall(r.content)
    urp_url = "https://ca.nuc.edu.cn/zfca?yhlx=student&login=" + result[0] + "&url=zf_loginAction.do"
    r = session.post(urp_url, headers=headers2, data=postdata2, proxies=proxies)
    r = session.get(coursetableurl, headers=headers2, proxies=proxies)
    # print(r.content)
    # write_to_html(r.content)
    return session
	
def login2(name, passwd, vcode="", cookie=""):
    headers4 = {
        "Host": "ca.nuc.edu.cn",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36",
        "DNT": "1",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Referer": "http://i.nuc.edu.cn/portal.do?caUserName=1707004548&ticket=ST-12446-0oYw5csczjlmEoS1XyTN-zfca",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9"
    }
    headers3 = {
        "Host": "i.nuc.edu.cn",
        "Connection": "keep-alive",
        "Origin": "http://i.nuc.edu.cn",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36",
        "DNT": "1",
        "Content-Type": "text/plain",
        "Accept": "*/*",
        "Referer": "http://i.nuc.edu.cn/portal.do?caUserName=1707004548&ticket=ST-12446-0oYw5csczjlmEoS1XyTN-zfca",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9"

    }
    session = requests.session()
    session.headers = headers
    exitflag = 1
    i = 0
    fuckUrl = None
    while exitflag:
        r = session.get(caurl, proxies=proxies)
        reg = r'<input type="hidden" name="lt" value="(.*)" />'
        pattern = re.compile(reg)
        result = pattern.findall(r.content)
        token = result[0]
        if cookie == "":
            pic = session.get(vcodeurl, proxies=proxies).content
            vcode = autoVcode(pic)
            logging.info("vcode:"+vcode)
            '''f=open(vcode+".jpg","wb")
            f.write(pic)
            f.close()'''
        else:
            cookies = requests.utils.cookiejar_from_dict({"JSESSIONID": cookie}, cookiejar=None, overwrite=True)
            session.cookies = cookies
        postdata = {"username": name,
                    "password": passwd,
                    "j_captcha_response": vcode,
                    "lt": token,
                    "useValidateCode": "1",
                    "isremenberme": "0",
                    "ip": "",
                    "losetime": "30",
                    "_eventId": "submit",
                    "submit1": ""}
        postdata2 = { 'callCount': '1',
                    'page': '0',
                    'httpSessionId': '',
                    'scriptSessionId': '',
                    'c0-scriptName': 'portalAjax',
                    'c0-methodName': 'getAppList',
                    'c0-id': '0',
                    'c0-param0': 'string:142104994847723324',
                    'batchId': '1'}
        # print vcode
        # print len(vcode)
        r = session.post(caurl, data=postdata, proxies=proxies)
        fuckUrl = r.url
        if r.content.decode("gbk").find(u"用户名或密码错误") != -1:
            return 2
        # print  r.url, r.status_code
        if re.search(r'ticket', r.url):
            exitflag = 0
        if i >= 10:
            return 1
        i += 1
    headers2["referer"] = r.url
    r = session.post(dwr_url, headers=headers2, data=postdata2, proxies=proxies)
    reg = r'\?yhlx=student\&login=(\d+)\&url=zf_loginAction\.do'
    pattern = re.compile(reg)
    result = pattern.findall(r.content)
    urp_url = "https://ca.nuc.edu.cn/zfca/?yhlx=student&login=" + result[0] + "&url=zf_loginAction.do"
    r = session.post("http://i.nuc.edu.cn/dwr/call/plaincall/portalAjax.insertYYDJJLB.dwr",headers=headers3,data=postdata2,proxies=proxies)
    headers4["Referer"] = fuckUrl
    r = session.get("https://ca.nuc.edu.cn/zfca/login?yhlx=student&login=" + result[0] + "&url=zf_loginAction.do",  headers=headers4,data=postdata2,proxies=proxies,allow_redirects=False)
    r = session.get(r.headers['Location'].replace("8088","8089"), headers=headers2, proxies=proxies)
    return session
@timeout_decorator.timeout(55, use_signals=False)
def testac(name, passwd):
    session = login(name, passwd)
    if session == 2:
        return [{"code": "2"}]
    elif session == 1:
        return [{"code": "1"}]
    else:
        return [{"code": "200"}]


if __name__ == '__main__':
	pass
