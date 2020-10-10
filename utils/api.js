const base64 = require('base64.js');
const md5 = require('md5.js');
const eventBus = require('eventBus.js');
const storage = require('storage.js');
const aprUrl = 'https://nuc-info-api.dreace.top/';
// const aprUrl = "http://127.0.0.1:10001/"
const staticUrl = 'https://cdn.jsdelivr.net/gh/dreace/NUC-Info-Static@master/';

function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
let k = storage.getKey('openId') || storage.getKey('key');

if (!k) {
  let str = randomString(
    16,
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  );
  k = md5.hexMD5(base64.base64Encode(str));
  storage.setKey('key', k);
}
let key = k;

eventBus.on('updateKey', this, () => {
  key = storage.getKey('openId');
});

function showMessage(msg) {
  wx.showToast({
    title: msg || '未知错误',
    image: '/images/Sad.png',
    mask: true,
  });
}

function sign_data(url, params, key) {
  params.ts = Date.now();
  params.key = key;
  const list = [];
  for (let i in params) {
    list.push(i + '=' + encodeURIComponent(params[i]));
  }
  list.sort();
  params.sign = md5.hexMD5('/' + encodeURI(url) + list.join('&') + appSecret);
  return params;
}

function request(option) {
  const data = sign_data(
    option.url,
    option.method == 'POST' ? {} : option.data,
    key
  );
  if (!option.dontShowLoading) {
    wx.showLoading({
      mask: true,
      title: '加载中',
    });
  }
  wx.request({
    url:
      aprUrl +
      option.url +
      (option.method == 'POST'
        ? '?key=' + data.key + '&ts=' + data.ts + '&sign=' + data.sign
        : ''),
    data: option.method == 'POST' ? option.data : data,
    method: option.method || 'GET',
    success: res => {
      const data = res.data;
      if (option.url.startsWith('static')) {
        option.callBack(data);
        return;
      }
      if (data['code'] !== 0) {
        if (!option.rawData) {
          showMessage(data['message']);
        }
      }
      if (data['code'] < 0) {
        if (data['code'] == -3) {
          eventBus.emit('showPassword');
        }
      } else {
        if (!option.dontShowLoading) {
          wx.hideLoading();
        }
        // if (!data["data"] || data["data"].length < 1) {
        //   showMessage("无数据")
        //   return
        // }
        if (option.rawData) {
          option.callBack(data);
        } else {
          option.callBack(data['data']);
        }
      }
    },
    fail: res => {
      showMessage(res.errMsg);
    },
  });
}

function staticData(url, callBack) {
  wx.request({
    url: staticUrl + url,
    success: res => {
      callBack(res.data);
    },
  });
}
module.exports = {
  staticData: staticData,
  request: request,
};
