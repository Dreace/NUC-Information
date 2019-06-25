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
    wx.request({
      url: 'https://dreace.top/res/load.txt',
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