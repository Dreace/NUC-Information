// pages/More/PhyEws/login/login.js
// pages/Setting/Setting.js
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
    if (this.data.testing) {
      return;
    }

    if (this.data.PhyEwsname == "" || this.data.PhyEwspasswd == "") {
      wx.showToast({
        title: '账号密码不能为空',
        icon: "none",
        duration: 2500
      })
      return;
    }
    this.setData({
      testing: true
    })
    var auth = require("../../../../utils/authenticate.js")
    wx.request({
      url: 'https://cdn.dreace.top/testPhyEws',
      data: {
        name: this.data.PhyEwsname,
        passwd: this.data.PhyEwspasswd,
        version: auth.version,
        uuid: auth.uuid
      },
      success: function (res) {
        if (res.data[0]["code"] === "100") {
          wx.showToast({
            title: res.data[1]["message"],
            mask: true,
            image: '/images/Error.png',
            duration: 1500
          })
          return
        }
        else if (res.data[0]["code"] == "200") {
          wx.showToast({
            title: '登录成功',
            icon: 'succes',
            duration: 2500
          })
          that.setData({
            testpassed: true
          })
          app.globalData.PhyEwsname = that.data.PhyEwsname
          app.globalData.PhyEwspasswd = that.data.PhyEwspasswd
          app.globalData.clearFlagPhyEwsGrade = true
          app.globalData.updatePhyEwsGrade = true
          wx.setStorageSync("PhyEwsname", that.data.PhyEwsname)
          wx.setStorageSync("PhyEwspasswd", that.data.PhyEwspasswd)
          wx.navigateBack()
        } else if (res.data[0]["code"] == "2") {
          that.setData({
            message: "账号或密码错误",
            showTopTips: true,
            showPassword: true,
          });

          setTimeout(function () {
            that.setData({
              showTopTips: false
            });
          }, 3000);
        } else {
          wx.showToast({
            title: '服务器异常',
            image: '/images/Error.png',
            duration: 3000
          })
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '未能完成请求',
          image: '/images/Error.png',
          duration: 3000
        })
        console.log(e)
      },
      complete: function () {
        that.setData({
          testing: false
        })
      }
    })
  },
  onLoad: function (options) {
    var app = getApp()
    this.setData({
      PhyEwsname: app.globalData.PhyEwsname,
      PhyEwspasswd: app.globalData.PhyEwspasswd,
    })
  },
})