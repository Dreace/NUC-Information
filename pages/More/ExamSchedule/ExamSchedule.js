Page({
  data: {
    exams: [],
    visible: true
  },
  onLoad() {
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
    var auth = require("../../../utils/authenticate.js")
    wx.request({
      url: 'https://cdn.dreace.top/exam?keywords=' + e.detail.value,
      data: {
        version: auth.version,
        uuid: auth.uuid
      },
      success: function (res) {
        var data = res.data[1]["data"]
        that.setData({
          exams: data,
          visible: false
        })
      }
    })
  },
})