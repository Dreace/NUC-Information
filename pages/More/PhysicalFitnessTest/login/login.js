// pages/More/PhyEws/login/login.js
// pages/Setting/Setting.js
const API = require("../../../../utils/API.js")
const app = getApp()
Page({
  data: {
    showToptips: false,
    message: "",
    fitnessName: "",
    fitnesspwd: "",
    remark: "",
    testpassed: false,
    testing: false,
    autoVcode: true,
    accountID: -1,
    showPassword: false,
  },
  inputname: function (e) {
    this.setData({
      testpassed: false,
      fitnessName: e.detail.value
    })
  },
  inputpasswd: function (e) {
    this.setData({
      testpassed: false,
      fitnesspwd: e.detail.value
    })
  },
  test: function (e) {
    var that = this
    var app = getApp()
    if (this.data.fitnessName == "" || this.data.fitnesspwd == "") {
      wx.showToast({
        title: '账号密码不能为空',
        icon: "none",
        duration: 2500
      })
      return;
    }
    API.newAPI({
      url: "PhysicalFitnessTestLogin",
      data: {
        name: this.data.fitnessName,
        passwd: this.data.fitnesspwd,
      },
      callBack: (data) => {
        wx.showToast({
          title: '登录成功',
          icon: 'succes',
          duration: 2500
        })
        app.globalData.fitnessid = data["id"]
        wx.setStorageSync("fitnessid", data["id"])
        app.eventBus.emit("updateFitnessScore")
        wx.navigateBack()
      }
    })
  },
})