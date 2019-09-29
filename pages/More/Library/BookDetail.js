// pages/More/Library/BookDetail.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookDetail: {},
    bookAvailableDetail: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var bookDetail = JSON.parse(options.detail)
    this.setData({
      bookDetail: bookDetail
    })
    if (bookDetail.id > 1) {
      var that = this
      app.API.cloudAPI(
        "GetBookAvailableDetail", {
          BookID: bookDetail.id,
        }, (data) => {
          that.setData({
            bookAvailableDetail: data
          })
        }
      )
    }
  }
})