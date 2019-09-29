// pages/Grade/Grade.js
const API = require("../../utils/API.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interval: undefined,
    mainServer: "待检测",
    mainServerColor: "#6b6d75",
    proxyServer: "待检测",
    proxyServerColor: "#6b6d75",
    load: 0,
    loadColor: "#5099B9",
  },
  toFeedback: function() {
    wx.navigateToMiniProgram({
      appId: 'wx8abaf00ee8c3202e',
      extraData: {
        id: "66656",
      },
    })
  },
  getInfo: function() {
    wx.getUserInfo({})
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  }
})