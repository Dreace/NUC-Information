const API = require("../../../utils/API.js")
const app = getApp()
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
  onChange: function (e) {
    if (e.detail.value.length < 1) {
      this.setData({
        visible: true
      })
      return
    }
    var that = this
    var data = undefined
    var visible = true
    API.getData("exam",{
      keywords: e.detail.value
    },(data)=>{
      that.setData({
        exams: data,
        visible: false
      })
    })
  },
})