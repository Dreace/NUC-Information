// pages/More/PhyEws/PhyEws.js
const buttons = [{
    label: '刷新',
    icon: "/images/Refresh.png",
  },
  {
    label: '登出',
    icon: "/images/Logout.png",

  },
  {
    label: '切换按钮位置',
    icon: "/images/Switch.png",
  }
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    PhyEwsname: "",
    PhyEwspasswd: "",
    grades: undefined,
    datas: [],
    heads: ["实验", "属性", "学分", "成绩"],
    showTopTips: false,
    tips: "",
    PhyEwsRawData: undefined,
    buttons,
    p: 0,
    postion: ["bottomRight", "bottomLeft"],
  },
  onClick(e) {
    if (e.detail.index === 0) {
      this.refresh()
    } else if (e.detail.index === 2) {
      this.setData({
        p: this.data.p + 1
      })
    } else if (e.detail.index === 1) {
      var app = getApp()
      this.setData({
        loading: false,
        PhyEwsname: "",
        PhyEwspasswd: "",
        datas: [],
        PhyEwsRawData: [],
      })
      app.globalData.PhyEwsname = ""
      app.globalData.PhyEwspasswd = ""
      wx.setStorageSync("PhyEwsname", "")
      wx.setStorageSync("PhyEwspasswd", "")
      wx.setStorageSync("PhyEwsRawData", "")
      wx.navigateTo({
        url: 'login/login',
      })
    }
  },
  refresh: function() {
    this.getGrade()
  },
  preventTouchMove: function() {},
  showModel: function(e) {
    this.setData({
      isShowModel: true,
      ModelContent: e.ModelContent
    })
  },
  handleData: function(e) {
    var data = e.data
    var that = this
    if (data[0]["code"] === "-1") {
      wx.showToast({
        title: '服务器异常',
        mask: true,
        image: '/images/Error.png',
        duration: 1500
      })
      return
    }
    if (data[0]["code"] === "1") {
      wx.showToast({
        title: '系统错误',
        image: '/images/Error.png',
        duration: 3000
      })
      return
    }
    if (data[0]["code"] === "0") {
      wx.showToast({
        title: '暂时没有成绩',
        image: '/images/Sad.png',
        duration: 3000
      })
      return
    }
    if (data[0]["code"] === "2") {
      var that = this;
      this.setData({
        tips: "账号或密码错误",
        showTopTips: true
      });
      setTimeout(function() {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      return
    }
    that.setData({
      datas: data[1]["data"]
    })
    wx.setStorageSync("PhyEwsRawData", data)
  },
  getGrade: function(e) {
    if (this.data.loading) {
      var that = this;
      this.setData({
        tips: "数据加载中，请勿操作",
        showTopTips: true
      });
      setTimeout(function() {
        that.setData({
          showTopTips: false
        });
      }, 1500);
      return
    }
    var app = getApp()
    this.setData({
      PhyEwsname: app.globalData.PhyEwsname,
      PhyEwspasswd: app.globalData.PhyEwspasswd,
      isShowModel: false,
      vcode: ""
    })
    var that = this
    if (app.globalData.PhyEwsname === "" || app.globalData.PhyEwspasswd === "") {
      if (this.data.showed) {
        return
      }
      this.setData({
        showed: true
      })
      wx.showModal({
        title: '未登录',
        content: '登陆后才能查看成绩，现在登录？',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: 'login/login',
            })
          }
        }
      })
      return
    }
    this.getGradeWithoutVcode()
  },
  getGradeWithoutVcode: function() {
    var that = this
    if (!(this.data.PhyEwsname === "" || this.data.PhyEwspasswd === "")) {
      wx.showToast({
        title: '加载中',
        mask: true,
        icon: 'loading',
        duration: 60000
      })
      that.setData({
        loading: true
      })
      var auth = require("../../../utils/authenticate.js")
      wx.request({
        url: 'https://cdn.dreace.top/PhyEws',
        data: {
          name: this.data.PhyEwsname,
          passwd: this.data.PhyEwspasswd,
          version: auth.version,
          uuid: auth.uuid
        },
        success: function(res) {
          wx.hideToast()
          that.handleData({
            data: res.data
          })
        },
        fail: function() {
          wx.showToast({
            title: '未能完成请求',
            mask: true,
            image: '/images/Error.png',
            duration: 3000
          })
        },
        complete: function() {
          that.setData({
            loading: false
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var app = getApp()
    app.globalData.PhyEwsname = wx.getStorageSync("PhyEwsname")
    app.globalData.PhyEwspasswd = wx.getStorageSync("PhyEwspasswd")
    app.globalData.PhyEwsRawData = wx.getStorageSync("PhyEwsRawData")
    console.log(app.globalData.clearFlagPhyEwsGrade)
    if (app.globalData.PhyEwsRawData != "") {
      this.handleData({
        data: app.globalData.PhyEwsRawData
      })
    } else {
      this.getGrade()
    }
  },
  onShow: function() {
    var app = getApp()
    if (app.globalData.clearFlagPhyEwsGrade) {
      this.setData({
        loading: false,
        PhyEwsname: "",
        PhyEwspasswd: "",
        datas: [],
        PhyEwsRawData: [],
      })
      app.globalData.clearFlagPhyEwsGrade = false
    }
    if (app.globalData.updatePhyEwsGrade) {
      this.getGrade()
      app.globalData.updatePhyEwsGrade = false
      return
    }
  }
})