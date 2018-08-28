// pages/Setting/Setting.js
Page({
  data: {
    showToptips: false,
    message: "",
    name: "",
    passwd: "",
    autoVcode: true
  },
  inputname: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  inputpasswd: function (e) {
    this.setData({
      passwd: e.detail.value
    })
  },
  swtichChnage: function (e) {
    this.setData({
      autoVcode: e.detail.value
    })
  },
  confirm: function (e) {
    if (this.data.name === "" || this.data.passwd === "") {
      var that = this;
      this.setData({
        message: "账号或密码不能为空",
        showTopTips: true
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
    } else {
      try {
        var app = getApp()
        app.globalData.name = this.data.name
        app.globalData.passwd = this.data.passwd
        app.globalData.autoVcode = this.data.autoVcode
        wx.setStorageSync("name", this.data.name)
        wx.setStorageSync("passwd", this.data.passwd)
        wx.setStorageSync("autoVcode", this.data.autoVcode)
        wx.showToast({
          title: '保存成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      } catch (e) {
        console.log(e)
      }
    }
  },
  onLoad: function (options) {
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onShow: function (options) {
    try {
      var app = getApp()
      this.setData({
        name: app.globalData.name,
        passwd: app.globalData.passwd,
        autoVcode: app.globalData.autoVcode === "" ? true : app.globalData.autoVcode
      })
    } catch (e) {
      console.log(e)
    }
  }
})