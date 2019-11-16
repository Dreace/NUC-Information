// pages/More/PhyEws/login/login.js
// pages/Setting/Setting.js
const API = require("../../../../utils/API.js")
Page({
  data: {
    showToptips: false,
    message: "",
    PhyEwsname: "",
    PhyEwspasswd: "",
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
      PhyEwsname: e.detail.value
    })
  },
  inputpasswd: function (e) {
    this.setData({
      testpassed: false,
      PhyEwspasswd: e.detail.value
    })
  },
  test: function (e) {
    var that = this
    var app = getApp()
    if (this.data.PhyEwsname == "" || this.data.PhyEwspasswd == "") {
      wx.showToast({
        title: '账号密码不能为空',
        icon: "none",
        duration: 2500
      })
      return;
    }
    API.newAPI({
      url: "LoginPhyEws",
      data: {
        name: this.data.PhyEwsname,
        passwd: this.data.PhyEwspasswd,
      },
      callBack: (data) => {
        wx.showToast({
          title: '登录成功',
          icon: 'succes',
          duration: 2500
        })
        app.globalData.PhyEwsname = that.data.PhyEwsname
        app.globalData.PhyEwspasswd = that.data.PhyEwspasswd
        app.globalData.clearFlagPhyEwsGrade = true
        app.globalData.updatePhyEwsGrade = true
        wx.setStorageSync("PhyEwsname", that.data.PhyEwsname)
        wx.setStorageSync("PhyEwspasswd", that.data.PhyEwspasswd)
        wx.navigateBack()
      }
    })
    // API.getData("testPhyEws",{
    //   name: this.data.PhyEwsname,
    //   passwd: this.data.PhyEwspasswd,
    // },(data)=>{
    //   wx.showToast({
    //     title: '登录成功',
    //     icon: 'succes',
    //     duration: 2500
    //   })
    //   app.globalData.PhyEwsname = that.data.PhyEwsname
    //   app.globalData.PhyEwspasswd = that.data.PhyEwspasswd
    //   app.globalData.clearFlagPhyEwsGrade = true
    //   app.globalData.updatePhyEwsGrade = true
    //   wx.setStorageSync("PhyEwsname", that.data.PhyEwsname)
    //   wx.setStorageSync("PhyEwspasswd", that.data.PhyEwspasswd)
    //   wx.navigateBack()
    // })
  },
  onLoad: function (options) {
    var app = getApp()
    this.setData({
      PhyEwsname: app.globalData.PhyEwsname,
      PhyEwspasswd: app.globalData.PhyEwspasswd,
    })
  },
})