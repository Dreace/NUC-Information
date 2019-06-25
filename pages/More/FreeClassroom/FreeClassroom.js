import {
  $wuxSelect
} from '../../../dist/index'

Page({
  data: {
    bulidingList: "",
    weekNameList: ["一", "二", "三", "四", "五", "六", "日"],
    weekIndex: 1,
    classList: [],
    weekList: [],
    freeClassroomList: [],
    buliding: "",
    week: undefined,
    class_: undefined,
    weekName: undefined
  },
  getFreeClassroomList: function() {
    var that = this
    var building = that.data.buliding
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var auth = require("../../../utils/authenticate.js")
    wx.request({
      url: 'https://cdn.dreace.top/getfreeclassroom',
      data: {
        op: 2,
        building: building,
        class_with_week: this.data.class_ + "-" + this.data.weekIndex,
        week: "w" + this.data.week,
        version: auth.version,
        uuid: auth.uuid
      },
      success: function(res) {
        if (res.data[0]["code"] === "100") {
          wx.showToast({
            title: res.data[1]["message"],
            mask: true,
            image: '/images/Error.png',
            duration: 1500
          })
          return
        }
        if (res.data[0]["code"] == "200") {
          that.setData({
            freeClassroomList: res.data[1]["data"]
          })
        }
      },
      complete: function() {
        wx.hideLoading()
      }
    })
  },
  next: function() {
    var day = (new Date()).getDay()
    if (day == 0) {
      day = 6
    } else {
      day -= 1
    }
    var weekNow = Math.floor(((new Date()).getTime() - (new Date(getApp().globalData.firstWeek)).getTime()) / (24 * 3600 * 1000 * 7)) + 1
    this.setData({
      week: weekNow,
      weekIndex: day + 1,
      weekName: this.data.weekNameList[day]
    })
    setTimeout(this.getFreeClassroomList, 200)
    //this.getFreeClassroomList()
  },
  onLoad: function() {
    var classList = Array(11)
    var weekList = Array(20)
    var bulidingList = undefined
    for (let i = 0; i < 11; i++) {
      classList[i] = i + 1
    }
    for (let i = 0; i < 20; i++) {
      weekList[i] = i + 1
    }
    var auth = require("../../../utils/authenticate.js")
    var that = this
    wx.request({
      url: 'https://cdn.dreace.top/getfreeclassroom',
      data: {
        op: 1,
        version: auth.version,
        uuid: auth.uuid
      },
      success: function(res) {
        if (res.data[0]["code"] == "200") {
          bulidingList = res.data[1]["data"]
          that.setData({
            bulidingList: bulidingList,
            buliding: bulidingList[0]
          })
        }
      },
      complete: function() {
        that.setData({
          weekList: weekList,
          classList: classList,
          week: weekList[0],
          class_: classList[0],
          weekName: that.data.weekNameList[0]
        })
        setTimeout(that.next, 500)
      }
    })
  },

  onClick1() {
    $wuxSelect('#wux-select').open({
      value: this.data.buliding,
      options: this.data.bulidingList,
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            buliding: value,
          })
          this.getFreeClassroomList()
        }
      },
    })
  },
  onClick2() {
    var options = this.data.weekList.map(
      function(item, index) {
        return "第" + item + "周"
      })
    $wuxSelect('#wux-select').open({
      value: "第" + this.data.week + "周",
      options: options,
      onConfirm: (value, index, options) => {
        console.log(value.length == 4 ? value[1] + value[2] : value[1])
        if (index !== -1) {
          this.setData({
            week: value.length == 4 ? value[1] + value[2] : value[1],
          })
          setTimeout(this.getFreeClassroomList, 200)
        }
      },
    })
  },
  onClick3() {
    var options = this.data.weekNameList.map(
      function(item, index) {
        return "周" + item
      })
    $wuxSelect('#wux-select').open({
      value: "周" + this.data.weekName,
      options: options,
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            weekName: value[1],
            weekIndex: index + 1
          })
          setTimeout(this.getFreeClassroomList, 200)
        }
      },
    })
  },
  onClick4() {
    var options = this.data.classList.map(
      function(item, index) {
        return "第" + item + "小节"
      })
    $wuxSelect('#wux-select').open({
      value: "第" + this.data.class_ + "小节",
      options: options,
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            class_: value.length == 5 ? value[1] + value[2] : value[1],
          })
          setTimeout(this.getFreeClassroomList, 200)
        }
      },
    })

  },
})