// pages/OpenSource/OpenSource.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
copy:function(e){

  wx.setClipboardData({
    data: 'https://github.com/Dreace/Academic-Information-Inquiry-for-NUC',
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})