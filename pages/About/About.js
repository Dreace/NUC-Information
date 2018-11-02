// pages/About/About.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  copy: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.url,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '已复制到剪贴板',
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})