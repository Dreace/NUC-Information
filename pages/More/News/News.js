// pages/more/News/News.js
const API = require("../../../utils/api.js")
const typeName = {
  "1013": "中北新闻",
  "1014": "学校通知",
  "1354": "学术活动"
}
var page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages: 0,
    titles: [],
    title: undefined,
    topHeight: 0,
    type: undefined,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  goContent(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'Content/Content?id=' + id + "&type=" + this.data.type,
    })
  },
  onChange(e) {
    this.getNews(e.detail.current)
  },
  onReachBottom: function() {
    page = page + 1
    this.getNews(page)
  },
  getNews: function(e) {
    if (this.data.pages <= page) {
      wx.showToast({
        title: '没有更多数据',
        icon: 'none'
      })
      return
    }
    var that = this
    API.newAPI({
      url: "GetNews",
      data: {
        op: "2",
        page: e,
        type: that.data.type
      },
      callBack: (data) => {
        var titles = this.data.titles
        titles = titles.concat(data)
        that.setData({
          titles: titles
        })
      }
    })
    // API.getData("getnews", {
    //   op: "2",
    //   page: e,
    //   type: that.data.type
    // }, (data) => {
    //   var titles = this.data.titles
    //   titles = titles.concat(data)
    //   that.setData({
    //     titles: titles
    //   })
    // })
  },
  onShow: function() {
    page = 1
  },
  onLoad: function(options) {
    var that = this
    var type = options.type
    this.setData({
      title: typeName[type],
    })
    API.newAPI({
      url: "GetNews",
      data: {
        op: "1",
        type: type
      },
      callBack: (data) => {
        that.setData({
          pages: Math.ceil(data["count"] / 10),
          type: type
        })
        that.getNews(1)
      }
    })
    // API.getData("getnews", {
    //   op: "1",
    //   type: type
    // }, (data) => {
    //   that.setData({
    //     pages: Math.ceil(data["count"] / 10),
    //     type: type
    //   })
    //   that.getNews(1)
    // })
  },

})