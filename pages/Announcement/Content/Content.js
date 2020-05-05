// pages/Announcement/Content/Content.js
const API = require("../../../utils/API.js")
var id = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options.id
    API.newAPI({
      url: "v2/notice/GetOneNoticeContent",
      data: {
        id:id
      },
      callBack: (data) => {
        if (data) {
          this.setData({
            notice:data
          })
          // console.log(data)
        } else {
          console.log("失败")
        }
      }
    })
  }
})