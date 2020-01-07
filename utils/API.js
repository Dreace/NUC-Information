const base64 = require("base64.js")
const md5 = require("md5.js")
const apiUrl = "https://api.dreace.top/"
const newAPIURL = "https://api-new.dreace.top/"
// const newAPIURL = "http://127.0.0.1:100/"
const dataUrl = "https://dreace.top/res/"
const cloudUrl = "https://fc.dreace.top/"
// const cloudUrl = "http://127.0.0.1:100/"
const svgUrl = dataUrl

let key = ""
const appSecret = ''

function showMessage(msg) {
  wx.showToast({
    title: msg || "未知错误",
    image: "/images/Sad.png",
    mask: true,
  })
}

function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
wx.getStorageInfoSync()

function loadKeyFromStorage() {
  var k = wx.getStorageSync("key")
  if (!k) {
    let str = randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    k = md5.hexMD5(base64.base64Encode(str))
    wx.setStorageSync("key", k)
  }
  key = k
}

function sign_data(params, key) {
  params.ts = Date.now()
  params.key = key
  let list = []
  for (let i in params) {
    list.push(i + "=" + encodeURIComponent(params[i]))
  }
  list.sort()
  let q = list.join("&")
  params.sign = md5.hexMD5(q + appSecret)
  return params
}

function newAPI(e) {
  let data = sign_data(e.data, key)
  wx.showLoading({
    mask: true,
    title: "加载中"
  })
  wx.request({
    url: newAPIURL + e.url + (e.method == 'POST' ? '?key=' + data.key + "&ts=" + data.ts + "&sign=" + data.sign : ''),
    data: data,
    method: e.method || "GET",
    success: (res) => {
      let data = res.data
      if (data["code"] != 0) {
        showMessage(data["message"])
      } else {
        wx.hideLoading()
        if (data["data"].length < 1) {
          showMessage("无数据")
          return
        }
        e.callBack(data["data"])
      }
    },
    fail: () => {
      showMessage()
    },
  })
}

function getData2(url, callBack) {
  wx.request({
    url: dataUrl + url,
    success: (res) => {
      callBack(res.data)
    },
  })
}
module.exports = {
  getData2: getData2,
  loadKeyFromStorage: loadKeyFromStorage,
  newAPI: newAPI
}