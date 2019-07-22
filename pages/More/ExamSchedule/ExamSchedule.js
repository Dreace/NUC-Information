const API = require("../../../utils/API.js")
Page({
  data: {
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