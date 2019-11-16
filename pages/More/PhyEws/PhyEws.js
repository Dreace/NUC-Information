// pages/More/PhyEws/PhyEws.js
const API = require("../../../utils/API.js")
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
    heads: ["序号", "实验", "成绩"],
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
  refresh: function () {
    this.getGrade()
  },
  preventTouchMove: function () { },
  showModel: function (e) {
    this.setData({
      isShowModel: true,
      ModelContent: e.ModelContent
    })
  },
  handleData: function (e) {
    var data = e.data
    var that = this
    that.setData({
      datas: data
    })
    wx.setStorageSync("PhyEwsRawData", data)
  },
  getGrade: function (e) {
    if (this.data.loading) {
      var that = this;
      this.setData({
        tips: "数据加载中，请勿操作",
        showTopTips: true
      });
      setTimeout(function () {
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
        success: function (res) {
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
  getGradeWithoutVcode: function () {
    var that = this
    if (!(this.data.PhyEwsname === "" || this.data.PhyEwspasswd === "")) {
      API.newAPI({
        url: "GetPhyEwsGrade",
        data: {
          name: this.data.PhyEwsname,
          passwd: this.data.PhyEwspasswd,
        },
        callBack: (data) => {
          that.handleData({
            data: data
          })
        }
      })
      // API.getData("PhyEws",{
      //   name: this.data.PhyEwsname,
      //   passwd: this.data.PhyEwspasswd,
      // },(data)=>{
      //   that.handleData({
      //     data: data
      //   })
      // })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  onShow: function () {
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