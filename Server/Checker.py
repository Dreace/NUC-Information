import socket 
import threading
import time
import os
ip="127.0.0.1"
port=888
mumberOfCpu = 1
def testsocket(ip,port):
	sk = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	sk.settimeout(1)
	try:
		sk.connect((ip,port))
		return True
	except Exception:
		return False
global timer
def checkproxy():
	info=testsocket(ip,port)
	state="1"
	if info:
		state= "1"
	else:
		state= "0"
	f = open('proxystate.txt', 'w')
	f.write(state)
	f.close()
	timer = threading.Timer(1,checkproxy)
	timer.start()
def aver_load():
	f = os.popen("uptime")
	load = f.read().strip().split(' ')[-3].replace(",","")
	text = str(float(load)*100/mumberOfCpu)
	f = open('load.txt', 'w')
	f.write(text)
	f.close()
	timer = threading.Timer(1,aver_load)
	timer.start()
	
def StartCheck():
	timer = threading.Timer(0.5, checkproxy)
	timer.start()
	timer = threading.Timer(0.5, aver_load)
	timer.start()
