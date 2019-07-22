// pages/Announcement/Announcement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    md: "",
    title: "加载中",
    time: "",
  },
  getAnnouncement: function() {
    var that = this
    var app = getApp()
    wx.request({
      url: 'https://dreace.top/dl/Announcement/0.json',
      success: function(res) {
        that.setData({
          title: res.data["title"],
          time: res.data["time"]
        })
      },
      fail: function() {
        that.setData({
          title: "加载失败"
        })
      }
    })
    wx.request({
      url: 'https://dreace.top/dl/Announcement/0.md',
      success: function(res) {
        that.setData({
          md: res.data
        })
      },
      fail: function() {
        that.setData({
          title: "加载失败"
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    this.getAnnouncement()
  },
})