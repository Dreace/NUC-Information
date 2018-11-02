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
    proxyServerColor: "#6b6d75"
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
  checkServer: function () {
    var that=this
    wx.request({
      url: 'https://cdn.dreace.top/getproxystate',
      fail: function () {
        that.setData({
          mainServer: "待检测",
          mainServerColor: "#6b6d75",
          proxyServer: "待检测",
          proxyServerColor: "#6b6d75"
        })
      },
      success: function (res) {
        if(res.statusCode!=200){
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