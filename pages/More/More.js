// pages/More/More.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  nav: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },


})