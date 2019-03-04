// pages/Grade/Grade.js
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onHide: function() {
    var that = this
    var interval = that.data.interval;
    clearInterval(interval)
  },
  checkServer: function() {
    var that = this
    var auth = require("../../utils/authenticate.js")
    wx.request({
      url: 'https://cdn.dreace.top/getproxystate',
      data:{
        version: auth.version,
        uuid: auth.uuid
      },
      fail: function() {
        that.setData({
          mainServer: "待检测",
          mainServerColor: "#6b6d75",
          proxyServer: "待检测",
          proxyServerColor: "#6b6d75"
        })
      },
      success: function(res) {
        if (res.statusCode != 200) {
          that.setData({
            mainServer: "离线",
            mainServerColor: "#ad2e2e",
            proxyServer: "离线",
            proxyServerColor: "#ad2e2e",
          })
          return;
        }

        that.setData({
          mainServer: "正常",
          mainServerColor: "#60ad2d",
        })
        if (res.data == "1") {
          that.setData({
            proxyServer: "正常",
            proxyServerColor: "#60ad2d",
          })
        } else {
          that.setData({
            proxyServer: "离线",
            proxyServerColor: "#ad2e2e",
          })
        }
      }
    })
    var auth = require("../../utils/authenticate.js")
    wx.request({
      url: 'https://cdn.dreace.top/load',
      data: {
        version: auth.version,
        uuid: auth.uuid
      },
      fail: function() {
        that.setData({
          load: 0,
          loadColor: "#FFFFFF"
        })
      },
      success: function(res) {
        if (res.statusCode != 200) {
          that.setData({
            load: 0,
            loadColor: "#FFFFFF"
          })
          return;
        }
        var load = parseInt(res.data)
        var loadColor = ""
        if (load <= 70) {
          loadColor = "#2A6EFC"
        } else if (load <= 85) {
          loadColor = "#FFCC00"
        } else {
          loadColor = "#ED4C3E"
        }
        that.setData({
          load: load,
          loadColor: loadColor
        })
      }
    })
  },
  onShow: function() {
    var that = this
    that.checkServer()
    var interval = setInterval(that.checkServer, 3000)
    that.setData({
      interval: interval
    })
  },
  getInfo: function() {
    wx.getUserInfo({})
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  }
})