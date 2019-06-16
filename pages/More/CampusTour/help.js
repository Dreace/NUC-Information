// pages/More/CampusTour/help.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  copyMail:function(){
    wx.setClipboardData({
      data: 'Dreace@Foxmail.com',
    })
  }
})