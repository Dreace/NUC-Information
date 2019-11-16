const API = require("../../../utils/API.js")
const app = getApp()
var keyword = ""
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    exams: [],
    visible: true
  },
  onLoad() {
  },
  onCancel:function(){
    wx.navigateBack({
      
    })
  },
  search(){
    if(keyword.length < 1){
      return
    }
    var that = this
    var data = undefined
    var visible = true
    API.newAPI({
      url: "GetExam",
      data: {
        keywords: keyword
      },
      callBack: (data) => {
        that.setData({
          exams: data,
          visible: false
        })
      }
    })
    // API.getData("exam", {
    //   keywords: keyword
    // }, (data) => {
    //   that.setData({
    //     exams: data,
    //     visible: false
    //   })
    // })
  },
  onChange: function (e) {
    keyword = e.detail.value

  },
})