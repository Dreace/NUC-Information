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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.name === "" || app.globalData.passwd === "") {
      wx.showModal({
        title: '信息未设置',
        content: '你好像还没有设置教务账号\n请前往"我的"进行设置',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/Account/Account',
            })
          }
        }
      })
      return
    }
    let that = this
    API.cloudAPI("CardBalance", {
      name: app.globalData.name
    }, (data) => {
      that.setData({
        data: data
      })
    })
  },
})