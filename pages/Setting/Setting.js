// pages/Setting/Setting.js
Page({
  data: {
    showToptips: false,
    message: "",
    name: "",
    passwd: "",
    remark: "",
    testpassed: false,
    testing: false,
    autoVcode: true,
    accountID: -1,
  },
  inputname: function(e) {
    this.setData({
      testpassed: false,
      name: e.detail.value
    })
  },
  inputremark: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  inputpasswd: function(e) {
    this.setData({
      testpassed: false,
      passwd: e.detail.value
    })
  },
  swtichChnage: function(e) {
    this.setData({
      autoVcode: e.detail.value
    })
  },
  test: function(e) {
    var that = this
    var app = getApp()
    if (this.data.testing) {
      return;
    }
    if (this.data.accountID == -1) {
      for (var x of app.globalData.accountList) {
        if (x["name"] == this.data.name) {
          wx.showToast({
            title: '该账号已存在',
            icon: "none",
            duration: 2500
          })
          return
        }
      }
    }

    if (this.data.name == "" || this.data.passwd == "") {
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
    var auth = require("../../utils/authenticate.js")
    wx.request({
      url: 'https://cdn.dreace.top/test',
      data: {
        name: this.data.name,
        passwd: this.data.passwd,
        version: auth.version,
        uuid: auth.uuid
      },
      success: function(res) {
        if (res.data[0]["code"] == "200") {
          wx.showToast({
            title: '登录成功',
            icon: 'succes',
            duration: 2500
          })
          that.setData({
            testpassed: true
          })
          if (that.data.accountID == -1) {
            if (that.data.remark == "") {
              that.setData({
                remark: "不愿透露姓名"
              })
            }
            app.globalData.accountList.push({
              remark: that.data.remark,
              name: that.data.name,
              passwd: that.data.passwd
            })
          } else {
            app.globalData.accountList[that.data.accountID]["name"] = that.data.name
            app.globalData.accountList[that.data.accountID]["passwd"] = that.data.passwd
            app.globalData.accountList[that.data.accountID]["remark"] = that.data.remark
          }
          wx.navigateBack()
        } else if (res.data[0]["code"] == "2") {
          that.setData({
            message: "账号或密码错误",
            showTopTips: true
          });

          setTimeout(function() {
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
        wx.reportAnalytics('login_api', {
          name_login: that.data.name,
          code_login: res.data[0]["code"],
        });
      },
      fail: function(e) {
        wx.showToast({
          title: '未能完成请求',
          image: '/images/Error.png',
          duration: 3000
        })
        console.log(e)
      },
      complete: function() {
        that.setData({
          testing: false
        })
      }
    })
  },
  onLoad: function(options) {
    var app = getApp()
    var id = options.id
    console.log(id)
    if (id != -1) {
      this.setData({
        accountID: id,
        name: app.globalData.accountList[id]["name"],
        passwd: app.globalData.accountList[id]["passwd"],
        remark: app.globalData.accountList[id]["remark"]
      })
    }
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  onShow: function(options) {
    try {
      var app = getApp()
      this.setData({
        testpassed: false,
      })
    } catch (e) {
      console.log(e)
    }
  }
})