# coding:utf-8
import sys
import json
import re
import time
import random
import timeout_decorator
from icalendar import Calendar
from icalendar import Event
from datetime import date
from uuid import uuid1
from datetime import datetime
from dateutil.relativedelta import relativedelta

reload(sys)
sys.setdefaultencoding("utf-8")


def display(cal):
    return cal.to_ical().decode('utf-8').replace('\r\n', '\n').strip()


def write_ics_file(name, icsText):
    file = open("/var/www/html/dl/"+name, "w")
    file.write(display(icsText))
    file.close()
def generate_random_str(randomlength=16):
    random_str = ''
    base_str = 'ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz0123456789'
    length = len(base_str) - 1
    for i in range(randomlength):
        random_str += base_str[random.randint(0, length)]
    return random_str

@timeout_decorator.timeout(55, use_signals=False)
def toiCal(data, firtMonday):
    table = json.loads(data)
    rule = re.compile(ur"[^a-zA-Z0-9\-,]")
    cal = Calendar()
    cal['version'] = '2.0'
    cal['prodid'] = '-//NUC//Syllabus//CN'  # *mandatory elements* where the prodid can be changed, see RFC 5445
    mondaySplit = firtMonday[0].split('-')
    start_monday = date(int(mondaySplit[0]), int(mondaySplit[1]), int(mondaySplit[2]))  # 开学第一周星期一的时间
    dict_day = {1: relativedelta(hours=8, minutes=0), 3: relativedelta(hours=10, minutes=10),
                5: relativedelta(hours=14, minutes=30), 7: relativedelta(hours=16, minutes=40),
                9: relativedelta(hours=19, minutes=30)}
    dict_day2 = {1: relativedelta(hours=8, minutes=0), 3: relativedelta(hours=10, minutes=10),
                 5: relativedelta(hours=14, minutes=0), 7: relativedelta(hours=16, minutes=10),
                 9: relativedelta(hours=19, minutes=0)}
    #print data
    for i in table:
        #print i
        for j in rule.sub('', i["Course_Week"]).split(','):

            if j.find('-') != -1:
                d = j.split('-')
                for dday in range(int(d[0]), int(d[1]) + 1):
                    event = Event()
                    dtstart_date = start_monday + relativedelta(
                        weeks=(dday - 1)) + relativedelta(days=int(int(i["Course_Time"])) - 1)
                    dtstart_datetime = datetime.combine(dtstart_date, datetime.min.time())
                    if dtstart_date.month >= 5 and dtstart_date.month < 10:
                        dtstart = dtstart_datetime + dict_day[int(i["Course_Start"])]
                    else:
                        dtstart = dtstart_datetime + dict_day2[int(i["Course_Start"])]
                    dtend = dtstart + relativedelta(hours=1, minutes=40)
                    event.add('uid', str(uuid1()) + '@Dreace')
                    event.add('summary', i["Course_Name"])
                    event.add('dtstamp', datetime.now())
                    event.add('dtstart', dtstart)
                    event.add('dtend', dtend)
                    event.add('rrule',
                              {'freq': 'weekly', 'interval': 1,
                               'count': 1})
                    event.add('location', i["Course_Building"] + i["Course_Classroom"])
                    cal.add_component(event)
            else:
                if j == '':
                    continue
                event = Event()
                dtstart_date = start_monday + relativedelta(
                    weeks=(int(j) - 1)) + relativedelta(days=int(int(i["Course_Time"])) - 1)
                dtstart_datetime = datetime.combine(dtstart_date, datetime.min.time())
                if dtstart_date.month >= 5 and dtstart_date.month < 10:
                    dtstart = dtstart_datetime + dict_day[int(i["Course_Start"])]
                else:
                    dtstart = dtstart_datetime + dict_day2[int(i["Course_Start"])]
                dtend = dtstart + relativedelta(hours=1, minutes=40)
                event.add('uid', str(uuid1()) + '@Dreace')
                event.add('summary', i["Course_Name"])
                event.add('dtstamp', datetime.now())
                event.add('dtstart', dtstart)
                event.add('dtend', dtend)
                event.add('rrule',
                          {'freq': 'weekly', 'interval': 1,
                           'count': 1})
                event.add('location', i["Course_Building"] + i["Course_Classroom"])
                cal.add_component(event)
    # print display(cal)
    filename=generate_random_str(20)+".ics"
    write_ics_file(filename, cal)
    return "https://1.2.3.4/dl/"+filename


if __name__ == "__main__":
    pass
