// pages/More/PhyEws/PhyEws.js
const API = require("../../../utils/API.js")
const app = getApp()
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
    fitnessName: "",
    fitnesspwd: "",
    grades: undefined,
    datas: [],
    heads: ["序号", "实验", "成绩"],
    showTopTips: false,
    tips: "",
    PhyEwsRawData: undefined,
    buttons,
    p: 0,
    postion: ["bottomRight", "bottomLeft"],
  },
  goDetail(e) {
    let id = e.currentTarget.dataset.id
    if (id) {
      wx.navigateTo({
        url: 'detail?id=' + id + "&title=" + e.currentTarget.dataset.title,
      })
    }
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
        fitnessid: "",
        datas: [],
      })
      app.globalData.fitnessid = ""
      wx.setStorageSync("fitnessid", "")
      wx.navigateTo({
        url: 'login/login',
      })
    }
  },
  refresh: function() {
    this.getGrade()
  },
  preventTouchMove: function() {},
  handleData: function(e) {
    var data = e.data
    var that = this
    that.setData({
      datas: data
    })
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
    var that = this
    if (!app.globalData.fitnessid) {
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
    if (app.globalData.fitnessid) {
      API.newAPI({
        url: "PhysicalFitnessTestGetScoreList",
        data: {
          id: app.globalData.fitnessid
        },
        callBack: (data) => {
          that.handleData({
            data: data
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    app.globalData.fitnessid = wx.getStorageSync("fitnessid")
    this.getGrade()
    app.eventBus.on("clearFitnessScore", this, () => {
      that.setData({
        loading: false,
        fitnessid: "",
        datas: [],
      })
    })
    app.eventBus.on("updateFitnessScore", this, () => {
      that.getGrade()
    })
  },
  onUnload: function() {
    app.eventBus.off("clearFitnessScore")
    app.eventBus.off("updateFitnessScore")
  }
})