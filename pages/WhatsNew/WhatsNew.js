// pages/WhatsNew/WhatsNew.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
new150:["增加课程表查询","成绩查询增加 GPA (平均绩点查询)","在 GitHub 上开放源代码 (仅小程序，服务器源码将在未来开放)","优化冷启动数据加载逻辑","提高验证码识别准确率","课程表提供手动刷新操作","修复一些不可感知 bug"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})