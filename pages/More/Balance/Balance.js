// pages/More/Balance/Balance.js
const app = getApp()
const API = require("../../../utils/API.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: undefined
  },

getData:function(){
  let that = this
  API.newAPI({
    url: "CardBalance",
    data: {
      name: app.globalData.name
    },
    callBack: (data) => {
      that.setData({
        data: data
      })
    }
  })
},
  onLoad: function(options) {
    let that = this
    if (app.globalData.name === "" || app.globalData.passwd === "") {
      wx.showModal({
        title: '未登录',
        content: '跳转到登录页面，或者以游客身份浏览',
        cancelText: "游客",
        cancelColor: "#03a6ff",
        confirmText: "去登陆",
        confirmColor: "#79bd9a",
        success: function (res) {
          that.setData({
            showed: false
          })
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/Account/Account',
            })
          } else {
            app.globalData.name = "guest"
            app.globalData.passwd = "guest"
            that.getData()
          }
        }
      })
      return
    }
    this.getData()
  },
})