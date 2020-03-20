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
    captchaInfo: {},
    captcha: ""
  },
  getCaptcha: function () {
    let that = this
    API.newAPI({
      url: "v2/fitness/captcha",
      data: {},
      callBack: (data) => {
        that.setData({
          captchaInfo: data,
          captcha: ""
        })
      }
    })
  },
  inputname: function (e) {
    this.setData({
      testpassed: false,
      fitnessName: e.detail.value
    })
  },
  inputcaptcha: function (e) {
    this.setData({
      captcha: e.detail.value
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
    } else {
      if (this.data.captcha.length < 1) {
        wx.showToast({
          title: '验证码不能为空',
          icon: "none",
          duration: 2500
        })
        return;
      }
    }
    API.newAPI({
      rawData: true,
      url: "v2/fitness/login",
      data: {
        name: this.data.fitnessName,
        passwd: this.data.fitnesspwd,
        JSESSIONID: this.data.captchaInfo.JSESSIONID,
        captcha: this.data.captcha
      },
      callBack: (data) => {
        if (data.code == 0) {
          wx.showToast({
            title: '登录成功',
            icon: 'succes',
            duration: 2500
          })
          app.globalData.fitnessid = data.data["id"]
          wx.setStorageSync("fitnessid", data.data["id"])
          app.eventBus.emit("updateFitnessScore")
          wx.navigateBack()
        } else {
          setTimeout(this.getCaptcha, 2000)
        }
      }
    })
  },
  onLoad: function () {
    this.getCaptcha()
  }
})