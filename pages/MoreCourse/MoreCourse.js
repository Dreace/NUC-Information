// pages/MoreCourse/MoreCourse.js
var pinyinUtil = require("../../utils/pinyinUtil.js")
const API = require("../../utils/API.js")
const app = getApp()
var keyword = ""
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
    Week: ["一", "二", "三", "四", "五", "六", "日"],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    hidden: true,
    list: [],
    listCur: undefined
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
    app.globalData.additionalData.push(map)
    wx.setStorageSync("additionalData", app.globalData.additionalData)
    app.eventBus.emit("refreshCourseTable")
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
      showID: e.currentTarget.dataset.id - 1
    })
  },
  onClear: function() {
    this.setData({
      alphabet: [],
      visible: true
    })
  },
  serch(){
    var visible = true
    if(keyword.length < 1){
      return
    }
    var that = this
    var data = undefined
    API.newAPI({
      url: "GetCourse",
      data: {
        keywords: keyword
      },
      callBack: (data) => {
        wx.showLoading({
          mask: true,
          title: "处理中"
        })
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
          list: alphabet,
          listCur: alphabet[0] ? alphabet[0] : 0,
          visible: visible,
          data: data
        })
        setTimeout(wx.hideLoading, 1000)
      }
    })
  },
  onChange: function(e) {
    keyword = e.detail.value
    
  },
  //获取文字信息
  getCur(e) {
    this.setData({
      hidden: false,
      listCur: this.data.list[e.target.id],
    })
  },

  setCur(e) {
    this.setData({
      hidden: true,
      listCur: this.data.listCur
    })
  },
  //滑动选择Item
  tMove(e) {
    let y = e.touches[0].clientY,
      offsettop = this.data.boxTop,
      that = this;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      let num = parseInt((y - offsettop) / 20);
      this.setData({
        listCur: that.data.list[num]
      })
    };
  },

  //触发全部开始选择
  tStart() {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd() {
    this.setData({
      hidden: true,
      listCurID: this.data.listCur
    })
  },
  indexSelect(e) {
    let that = this;
    let barHeight = this.data.barHeight;
    let list = this.data.list;
    let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
    for (let i = 0; i < list.length; i++) {
      if (scrollY < i + 1) {
        that.setData({
          listCur: list[i],
          movableY: i * 20
        })
        return false
      }
    }
  }
})