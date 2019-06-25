// pages/More/Status/Status.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: undefined
  },

  checkServer:function(){
    var that = this
    wx.request({
      url: 'https://dreace.top/res/status.json',

      success: function (res) {
        console.log(res.data)
        that.setData({
          status: res.data
        })
      }
    })
  },
  onUnload:function(){
    clearInterval(this.data.interval)
  },
  onHide:function(){
    clearInterval(this.data.interval)
  },
  onShow: function () {
    var that = this
    that.checkServer()
    var interval = setInterval(that.checkServer, 1000)
    that.setData({
      interval: interval
    })
  },

})