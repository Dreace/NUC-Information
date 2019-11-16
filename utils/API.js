const auth = require("authenticate.js")
const base64 = require("base64.js")
const md5 = require("md5.js")
const apiUrl = "https://api.dreace.top/"
const newAPIURL = "https://api-new.dreace.top/"
// const newAPIURL = "http://127.0.0.1:100/"
const dataUrl = "https://dreace.top/res/"
const cloudUrl = "https://fc.dreace.top/"
// const cloudUrl = "http://127.0.0.1:100/"
const svgUrl = dataUrl

var token = {
  token: "",
  exp: new Date(0)
}

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

function loadTokenFromStorage() {
  var token_t = wx.getStorageSync("token")
  if (checkToken(token_t)) {
    token = token_t
  } else {
    getToken()
  }
}

function getToken() {
  var key = ""
  var sign = ""
  wx.request({
    url: newAPIURL + "Token",
    data: {
      key: key,
      sign: sign
    },
    success: (res) => {
      token.token = res.data.data.token
      token.exp = Date.parse(new Date()) + 3600000
      wx.setStorageSync("token", token)
    }
  })
}

function checkToken(t) {
  if (t.token && t.exp && Date.parse(new Date()) < t.exp) {
    return true
  } else {
    return false
  }
}

function newAPI(e) {
  if (!checkToken(token)) {
    getToken()
    showMessage("鉴权过期请重试")
    return
  }
  e.data["token"] = token.token
  wx.showLoading({
    mask: true,
    title: "加载中"
  })
  wx.request({
    url: newAPIURL + e.url + (e.method == 'POST' ? '?token=' + token.token : ''),
    data: e.data,
    method: e.method || "GET",
    success: (res) => {
      let data = res.data
      if (data["code"] != 0) {
        showMessage(data["message"])
      } else {
        wx.hideLoading()
        if(data["data"].length < 1){
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

function cloudAPI(url, parameter, callBack) {
  parameter["version"] = auth.version
  parameter["uuid"] = auth.uuid
  wx.showLoading({
    mask: true,
    title: "加载中"
  })
  wx.request({
    url: cloudUrl + url,
    data: parameter,
    success: (res) => {
      let data = res.data
      if (data["code"] != 0) {
        showMessage(data["message"])
      } else {
        wx.hideLoading()
        callBack(data["data"])
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
  cloudAPI: cloudAPI,
  getToken: getToken,
  loadTokenFromStorage: loadTokenFromStorage,
  newAPI: newAPI
}