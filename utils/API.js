const auth = require("authenticate.js")
const apiUrl = "https://api.dreace.top/"
const dataUrl = "https://dreace.top/res/"
const cloudUrl = "https://fc.dreace.top/"
// const cloudUrl = "http://127.0.0.1:5000/"
const svgUrl = dataUrl

function showMessage(msg) {
  wx.showToast({
    title: msg || "未知错误",
    image: "/images/Sad.png",
    mask: true,
  })
}

function cloudAPI(url, parameter, callBack){
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

function getData(url, parameter, callBack, method) {
  parameter["version"] = auth.version
  parameter["uuid"] = auth.uuid
  wx.showLoading({
    mask: true,
    title: "加载中"
  })
  wx.request({
    url: apiUrl + url,
    data: parameter,
    method: method || "GET",
    success: (res) => {
      let data = res.data
      if (data["code"] != 200) {
        if (data["code"] == 22) {
          wx.showModal({
            title: '登录失效',
            content: '需重新登录,即将跳转到登录页面',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                var app = getApp()
                let id = 0
                for (let i = 0; i < app.globalData.accountList.length; i++) {
                  if (parameter["name"] == app.globalData.accountList[i]["name"]) {
                    id = i
                  }
                  console.log(id)
                }
                wx.navigateTo({
                  url: '/pages/Setting/Setting?id=' + id,
                })
              }
            }
          })
        }
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
module.exports = {
  getData: getData,
  getData2: getData2,
  cloudAPI: cloudAPI,
}