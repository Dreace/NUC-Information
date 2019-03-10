// pages/MoreCourse/MoreCourse.js
var pinyinUtil = require("../../utils/pinyinUtil.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: "",
    alphabet: [],
    toView: undefined,
    visible: true,
    showMoreInformation: false,
    data: [],
    showID: 0,
    Week: ["一", "二", "三", "四", "五", "六", "日"]
  },
  add: function() {
    var that = this
    wx.showModal({
      title: '添加',
      content: '此课程将添加到最新学期课程表，确认添加？',
      success: function(res) {
        if (res.confirm) {
          that.add_()
          that.closethis()
        } else {

        }
      }
    })
  },
  add_: function() {
    var t = this.data.data[this.data.showID]["Class_time"].split("~")
    var map = {
      "Course_Number": this.data.data[this.data.showID]["Course_number"],
      "Course_Name": this.data.data[this.data.showID]["Course_name"],
      "Course_Credit": "",
      "Course_Attribute": "",
      "Course_Teacher": this.data.data[this.data.showID]["Teacher"],
      "Course_Week": this.data.data[this.data.showID]["Time"],
      "Course_Color": Math.floor(Math.random() * 21),
      "Course_Time": this.data.data[this.data.showID]["Week"],
      "Course_Start": t[0],
      "Course_Length": t[1] - t[0] + 1,
      "Course_Building": this.data.data[this.data.showID]["Teaching_building"],
      "Course_Classroom": this.data.data[this.data.showID]["Classroom"],
      "Additional": true
    }
    var app = getApp()
    if (app.globalData.additionalData[app.globalData.term] == undefined) {
      app.globalData.additionalData[app.globalData.term] = []
    }
    app.globalData.additionalData[app.globalData.term].push(map)
    wx.setStorageSync("additionalData", app.globalData.additionalData)
    wx.showToast({
      title: '添加成功',
    })
  },
  onCancel: function() {
    wx.navigateBack({

    })
  },
  closethis: function() {
    this.setData({
      showMoreInformation: false,
    })
  },
  show: function(e) {
    this.setData({
      showMoreInformation: true,
      showID: e.target.dataset.id - 1
    })
  },
  onClear: function() {
    this.setData({
      alphabet: [],
      visible: true
    })
  },
  onChange: function(e) {
    if (e.detail.value.length < 1) {
      this.setData({
        alphabet: [],
        visible: true
      })
      return
    }
    var that = this
    var data = undefined
    var visible = true
    var auth = require("../../utils/authenticate.js")
    wx.request({
      url: 'https://cdn.dreace.top/getcourse?keywords=' + e.detail.value,
      data: {
        version: auth.version,
        uuid: auth.uuid
      },
      success: function(res) {
        if (res.data[0]["code"] == 200) {
          var data = res.data[1]["data"]
          const alphabet = []
          'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((initial) => {
            const cells = data.filter((course) => pinyinUtil.pinyinUtil.getFirstLetter(course["Course_name"]).charAt(0) == initial)
            if (cells.length > 0) {
              visible = false
              alphabet.push({
                initial,
                cells
              })
            }
          })

          that.setData({
            alphabet,
            visible: visible,
            data: res.data[1]["data"]
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '未能完成请求',
          mask: true,
          image: '/images/Error.png',
          duration: 3000
        })
      }
    })
  },
  onLoad: function(options) {

  },

})