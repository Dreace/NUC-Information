// pages/More/News/Content/Content.js
const API = require("../../../../utils/API.js")
const typeName = {
  "1013": "中北新闻",
  "1014": "学校通知",
  "1354": "学术活动"
}
var id = ""
var type = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: undefined,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    id = options.id
    type = options.type
    var that = this
    API.newAPI({
      url: "GetNews",
      data: {
        op: "3",
        id: id,
        type: type
      },
      callBack: (data) => {
        that.setData({
          content: data
        })
      }
    })
    // API.getData("getnews", {
    //   op: "3",
    //   id: id,
    //   type: type
    // }, (data) => {
    //   that.setData({
    //     content: data
    //   })
    // })
  },
  onShareAppMessage() {
    return {
      title: typeName[type] + '-' + this.data.content["title"],
      path: 'pages/More/News/Content/Content?id=' + id + "&type=" + type
    }
  }
})