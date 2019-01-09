// pages/Setting/Setting.js
Page({
  data: {
    showToptips: false,
    message: "",
    name: "",
    passwd: "",
    testpassed: false,
    testing: false,
    autoVcode: true
  },
  inputname: function (e) {
    this.setData({
      testpassed: false,
      name: e.detail.value
    })
  },
  inputpasswd: function (e) {
    this.setData({
      testpassed: false,
      passwd: e.detail.value
    })
  },
  swtichChnage: function (e) {
    this.setData({
      autoVcode: e.detail.value
    })
  },
  test: function (e) {
    if(this.data.testing){
      return;
    }
    var that = this
    if(this.data.name==""||this.data.passwd==""){
      that.setData({
        message: "账号密码不能为空",
        showTopTips: true
      });
      return;
    }
    this.setData({
      testing: true
    })
    wx.request({
      url: 'https://cdn.dreace.top/test',
      data: {
        name: this.data.name,
        passwd: this.data.passwd,
      },
      success: function (res) {
        if (res.data[0]["code"] == "200") {
          wx.showToast({
            title: '登录测试成功',
            icon: 'succes',
            duration: 2500
          })
          that.setData({
            testpassed:true
          })
        } else if (res.data[0]["code"] == "2") {
          that.setData({
            message: "账号或密码错误",
            showTopTips: true
          });
          setTimeout(function () {
            that.setData({
              showTopTips: false
            });
          }, 3000);
        }else{
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
        if (!this.data.testpassed) {
          wx.showToast({
            title: '登陆测试未通过',
            image: '/images/Error.png',
            duration: 1000,
            mask: true
          })
          return
        }
        var app = getApp()
        app.globalData.name = this.data.name
        app.globalData.passwd = this.data.passwd
        app.globalData.autoVcode = this.data.autoVcode
        wx.setStorageSync("newed", "ok")
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
  onLoad: function (options) { },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onShow: function (options) {
    try {
      var app = getApp()
      this.setData({
        name: app.globalData.name,
        passwd: app.globalData.passwd,
        testpassed:false,
        autoVcode: app.globalData.autoVcode === "" ? true : app.globalData.autoVcode
      })
    } catch (e) {
      console.log(e)
    }
  }
})