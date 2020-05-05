// pages/Announcement/Announcement.js
const API = require("../../utils/API.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    md: "",
    title: "加载中",
    time: "", 
    top:[],
    normal:[]

  },
  goContent(e){
    console.log(e)
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: 'Content/Content?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    // this.getAnnouncement()
    API.newAPI({
      url: "v2/notice/GetNoticeList",
      data: {
      },
      callBack: (data) => {
        if (data) {
          this.setData({
            top:data.top,
            normal:data.normal
          })
          console.log(data)
        }else{
          console.log("失败")
        }
        console.log(data)
      }
    })
  },
})