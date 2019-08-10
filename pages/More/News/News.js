// pages/More/News/News.js
const API = require("../../../utils/API.js")
const typeName = { "1013": "中北新闻", "1014": "学校通知", "1354":"学术活动"}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages: 0,
    titles:[],
    title:undefined,
    topHeight:0,
    type:undefined,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  goContent(e){
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: 'Content/Content?id='+id+"&type="+this.data.type,
    })
  },
  onChange(e) {
      this.getNews(e.detail.current)
  },
  getNews:function(e){
    var that = this
    API.getData("getnews",{
      op: "2",
      page: e,
      type: that.data.type
    },(data)=>{
      that.setData({
        titles: data
      })
    })
  },
  onLoad: function (options) {
    var that = this
    var type = options.type
    this.setData({
      title: typeName[type],
    })
    API.getData("getnews",{
      op: "1",
      type: type
    },(data)=>{
      that.setData({
        pages: Math.ceil(data["count"] / 6),
        type: type
      })
      that.getNews(1)
    })
  },

})