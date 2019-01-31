# coding=utf-8
import StringIO
import random
import string
import os
import io
import subprocess
import base64
from PIL import Image
def Base64ImageToVcode(base64pic):
    base64pic = base64pic.replace(' ','+')
    missing_padding = 4 - len(base64pic) % 4
    if missing_padding:
        base64pic += b'='* missing_padding
    pic = base64.b64decode(base64pic)
    salt = ''.join(random.sample(string.ascii_letters + string.digits, 12))
    with open(salt+".jpg", 'wb') as file:
        file.write(pic)
    vcode=image_to_string(salt+".jpg")
    vcode = vcode.replace(" ", "").replace("\n", "").replace("\r", "").replace("\t", "")
    os.remove(salt+".jpg")
    return vcode

def image_to_string(img, cleanup=True, plus=''):
    subprocess.check_output('tesseract ' + img + ' ' +
                            img + ' ' + plus, shell=True)
    text = ''
    with open(img + '.txt', 'r') as f:
        text = f.read().strip()
    if cleanup:
        os.remove(img + '.txt')
    return text
def T():
	pass


if __name__ == '__main__':
    T()
