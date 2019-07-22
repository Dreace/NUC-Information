const auth = require("authenticate.js")
const apiUrl = "https://api.dreace.top/"
const dataUrl = "https://dreace.top/res/"
const svgUrl = dataUrl
function showMessage(msg) {
  wx.showToast({
    title: msg || "未知错误",
    image: "/images/Error.png",
    mask: true,
  })
}
function getData2(url, callBack) {
  wx.request({
    url: dataUrl + url,
    success: (res) => {res.data
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
  svgUrl: svgUrl
}