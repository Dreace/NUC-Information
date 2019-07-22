// pages/More/News/Content/Content.js
const API = require("../../../../utils/API.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:undefined,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    var that = this
    API.getData("getnews",{
      op: "3",
      id: id,
      type: options.type
    },(data)=>{
      that.setData({
        content: data
      })
    })
  },
})