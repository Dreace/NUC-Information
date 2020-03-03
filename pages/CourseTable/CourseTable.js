// pages/ClassTable/ClassTable.js
const API = require("../../utils/API.js")
import {
  $wuxSelect
} from '../../dist/index'

const app = getApp()

const buttons = [{
    label: '刷新',
    icon: "/images/Refresh.png",
  },
  {
    label: '添加',
    icon: "/images/Add.png",
  },
  {
    openType: 'share',
    label: '分享',
    icon: "/images/Share.png",

  },
  {
    label: '切换按钮位置',
    icon: "/images/Switch.png",
  },
  {
    label: '导出课程表',
    icon: "/images/Export.png",
  }
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorArrays: ["#99CCFF", "#FFCC99", "#FFCCCC", "#CC6699", "#99CCCC", "#FF6666", "#CCCC66", "#66CC99", "#FF9966", "#66CCCC", "#6699CC", "#99CC99", "#669966", "#99CC99", "#99CCCC", "#66CCFF", "#CCCCFF", "#99CC66", "#CCCC99", "#FF9999"],
    loading: false,
    name: "",
    passwd: "",
    autoVcode: false,
    vcode: "",
    count: 0,
    table: undefined,
    tables: [],
    vcodeImage: "",
    cookie: "",
    courseIndex: 0,
    isShowModel: false, //控制弹窗是否显示，默认不显示
    isShowConfirm: true, //是否只显示确定按钮，默认不是
    showMoreInformation: false,
    showTopTips: false,
    tips: "",
    enableRefresh: true,
    courseTableRawData: undefined,
    hasData: undefined,
    isOverlapping: undefined,
    showCardsList: undefined,
    cardToIndex: undefined,
    indexToCard: undefined,
    firstWeek: undefined,
    enableNow: undefined,
    weekNow: 0,
    weekNowAgain: 0,
    buttons,
    day: undefined,
    p: 0,
    postion: ["bottomRight", "bottomLeft"],
    current: 0,
    showed: false,
    showAddView: false,
    title: "▼",
    courseTime: [],
    monthNow: [],
    dateList: [],
  },
  nav: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },

  onClick(e) {
    if (e.detail.index === 0) {
      this.refresh()
    } else if (e.detail.index === 4) {
      if (this.data.courseTableRawData !== undefined) {
        wx.navigateTo({
          url: '/pages/Export/Export?table=' + JSON.stringify(this.data.courseTableRawData),
        })
      } else {
        wx.showToast({
          title: '没有可导出的课程表',
        })
      }
    } else if (e.detail.index === 3) {
      this.setData({
        p: this.data.p + 1
      })
    } else if (e.detail.index === 1) {
      wx.navigateTo({
        url: '/pages/Add/Add'
      })
    }
  },
  preventTouchMove: function () {},
  closethis: function () {
    this.setData({
      showMoreInformation: false,
      showCardsList: []
    })
  },
  closeAddCiew: function () {
    this.setData({
      showAddView: false
    })
  },
  showInformation: function (e) {
    this.setData({
      showMoreInformation: true
    })
  },
  showInformationConfirm: function () {
    this.setData({
      showMoreInformation: false
    })
  },
  showModel: function (e) {
    this.setData({
      isShowModel: true,
      ModelContent: e.ModelContent
    })
  },
  delete_: function (e) {
    var that = this
    wx.showModal({
      title: '删除',
      content: '确认删除这个课程，删除后不可恢复',
      success: function (res) {
        if (res.confirm) {
          var table = that.data.courseTableRawData
          app.globalData.additionalData.splice(that.data.showCardsList[e.currentTarget.dataset["index"]] - table.length, 1)
          that.setData({
            showMoreInformation: false,
            showCardsList: []
          })
          var adata = app.globalData.additionalData
          if (adata != undefined && adata.length > 0) {
            that.setData({
              table: table.concat(adata)
            })
          } else {
            that.setData({
              table: table
            })
          }
          wx.setStorageSync("additionalData", app.globalData.additionalData)
          wx.showToast({
            title: '删除成功',
          })
          that.handleData({
            data: app.globalData.courseTableRawData
          })
        }
      }
    })
  },
  edit: function (e) {
    let that = this
    var table = that.data.courseTableRawData
    wx.navigateTo({
      url: '/pages/Add/Add?id=' + (that.data.showCardsList[e.currentTarget.dataset["index"]] - table.length),
    })
  },
  handleData: function (e) {
    var day = new Date().getDay()
    if (day == 0) {
      day = 7
    }
    this.setData({
      day: day
    })
    var data = e.data
    if (data === undefined) {
      return;
    }
    var that = this
    that.setData({
      table: data[0]["name"] ? data[data.length - 1]["table"] : data.concat(app.globalData.additionalData),
      courseTableRawData: data
    })
    that.handleMoreData()
    if (app.globalData.name != "guest") {
      wx.setStorageSync("courseTableRawData", data)
    }
  },
  changeWeek: function () {
    var that = this
    var weekList = Array(35)
    for (var i = 0; i < 35; i++) {
      weekList[i] = "第" + (i + 1) + "周"
    }
    weekList[this.data.weekNowAgain - 1] += "（本周）"
    that.setData({
      title: "第" + this.data.weekNow + "周▲",
    })
    $wuxSelect('#wux-select').open({
      //index: this.data.weekNow - 1,
      value: weekList[this.data.weekNow - 1],
      options: weekList,
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          that.setData({
            weekNow: index + 1
          })
          that.handleMoreData({
            week: true
          })
        }
      },
      onCancel: () => {
        that.setData({
          title: "第" + this.data.weekNow + "周▼",
        })
      }
    })
  },
  handleMoreData: function (e) {
    if (!this.data.table) {
      return
    }
    var hasData = new Array()
    var isOverlapping = new Array()
    var that = this
    for (var i = 0; i < 8; i++) {
      hasData[i] = new Array()
      for (var j = 0; j < 12; j++) {
        hasData[i][j] = 0
      }
    }
    for (var i = 0; i < this.data.table.length; i++) {
      isOverlapping[i] = false
      if (this.data.table[i]["Course_Start"] === '') {
        continue
      }
      // for (var j = Number(this.data.table[i]["Course_Start"]); j < Number(this.data.table[i]["Course_Length"]) + Number(this.data.table[i]["Course_Start"]); j++) {
      //   if (hasData[Number(this.data.table[i]["Course_Time"])][j]) {
      //     isOverlapping[i] = true
      //     isOverlapping[j] = true
      //   }
      // }
      for (var j = Number(this.data.table[i]["Course_Start"]); j < Number(this.data.table[i]["Course_Length"]) + Number(this.data.table[i]["Course_Start"]); j++) {
        hasData[Number(this.data.table[i]["Course_Time"])][j] += 1
      }
    }
    var cardToIndex = []
    var indexToCard = []
    for (var i = 0; i < 8; i++) {
      cardToIndex[i] = new Array()
      for (var j = 0; j < 12; j++) {
        cardToIndex[i][j] = []
      }
    }
    for (var i = 0; i < this.data.table.length; i++) {
      indexToCard[i] = []
      for (var j = Number(this.data.table[i]["Course_Start"]); j < Number(this.data.table[i]["Course_Length"]) + Number(this.data.table[i]["Course_Start"]); j++) {
        indexToCard[i].push({
          "x": Number(this.data.table[i]["Course_Time"]),
          "y": j
        })
        cardToIndex[Number(this.data.table[i]["Course_Time"])][j].push(i)
      }
    }
    if (this.data.firstWeek.length >= 1) {
      var enableNow = new Array()
      var weekNow = undefined
      if (!e) {
        weekNow = Math.floor(((new Date()).getTime() - (new Date(this.data.firstWeek)).getTime()) / (24 * 3600 * 1000 * 7)) + 1
        that.setData({
          weekNow: weekNow,
          weekNowAgain: weekNow
        })
      } else {
        weekNow = this.data.weekNow
      }
      var date = new Date(this.data.firstWeek);
      var courseTime = []
      date.setDate(date.getDate() + (weekNow - 1) * 7)
      var dateList = Array(7)
      var month = date.getMonth() + 1
      if (month < 5 || month > 9) {
        courseTime = ["8:00", "8:55", "10:10", "11:05", "14:00", "14:55", "16:10", "17:05", "19:00", "19:55", "20:50"]
      } else {
        courseTime = ["8:00", "8:55", "10:10", "11:05", "14:30", "15:25", "16:40", "17:35", "19:30", "20:25", "21:20"]
      }
      this.setData({
        courseTime: courseTime
      })
      date.setDate(date.getDate() - 1)
      for (var i = 0; i < 7; i++) {
        date.setDate(date.getDate() + 1)
        dateList[i] = date.getDate() + "日"
      }
      this.setData({
        monthNow: month + "月",
        dateList: dateList
      })
      for (var i = 0; i < this.data.table.length; i++) {
        var t = this.handleWeek({
          data: this.data.table[i]["Course_Week"]
        })
        if (t.indexOf(weekNow) != -1) {
          enableNow[i] = true
        } else {
          enableNow[i] = false
        }
      }
      that.setData({
        enableNow: enableNow
      })
    }
    that.setData({
      hasData: hasData,
      isOverlapping: isOverlapping,
      cardToIndex: cardToIndex,
      indexToCard: indexToCard,
      title: "第" + that.data.weekNow + "周▼",
    })
  },
  handleWeek: function (e) {
    if (!e.data) {
      return []
    }
    var weekList = []
    var tempList = undefined
    let isEvenWeek = e.data.indexOf("双") != -1
    let isOddWeek = e.data.indexOf("单") != -1
    tempList = this.removeChinese(e.data).split(",")
    for (var i = 0; i < tempList.length; i++) {
      var str = String(tempList[i])
      if (str.indexOf("-") != -1) {
        var t = str.split("-")
        for (var j = Number(t[0]); j <= Number(t[1]); j++) {
          if (isEvenWeek && j % 2 == 1) {
            continue
          }
          if (isOddWeek && j % 2 == 0) {
            continue
          }
          weekList.push(j)
        }
      } else {
        weekList.push(Number(str))
      }
    }
    return weekList
  },
  removeChinese: function (strValue) {
    if (strValue != null && strValue != "") {
      var reg = /[\u4e00-\u9fa5\(\)（）]/g;
      return strValue.replace(reg, "");
    } else
      return "";
  },
  getCourseTable: function (e) {
    var that = this
    if (this.data.loading) {
      var that = this;
      this.setData({
        tips: "数据加载中，请勿操作",
        showTopTips: true
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 1500);
      return
    }

    this.setData({
      name: app.globalData.name,
      passwd: app.globalData.passwd,
      autoVcode: app.globalData.autoVcode,
      isShowModel: false,
      vcode: ""
    })
    var that = this

    if (app.globalData.name === "" || app.globalData.passwd === "") {
      if (this.data.showed) {
        return
      }
      this.setData({
        showed: true
      })
      wx.showModal({
        title: '未登录',
        content: '跳转到登录页面，或者以游客身份浏览',
        cancelText: "游客",
        cancelColor: "#03a6ff",
        confirmText: "去登陆",
        confirmColor: "#79bd9a",
        success: function (res) {
          that.setData({
            showed: false
          })
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/Account/Account',
            })
          } else {
            app.globalData.name = "guest"
            app.globalData.passwd = "guest"
            that.getCourseTable()
          }
        }
      })
      return
    }
    this.getCourseTableWithoutVcode()
  },
  getCourseTableWithoutVcode: function () {
    if (!(app.globalData.name === "" || app.globalData.passwd === "")) {
      API.newAPI({
        url: "v2/GetCourseTable",
        data: {
          name: app.globalData.name,
          passwd: app.globalData.passwd
        },
        callBack: (data) => {
          if (data) {
            this.handleData({
              data: data
            })
          }
        }
      })
    }
  },
  showCardView: function (e) {
    var index = e.currentTarget.dataset.courseindex
    console.log(index)
    var showCardsList = []
    if (index < 0) {
      showCardsList = showCardsList.concat(-index)
    } else {
      var card = this.data.indexToCard[index]
      for (var i = 0; i < card.length; i++) {
        var p = this.data.cardToIndex[card[i]["x"]][card[i]["y"]]
        showCardsList = showCardsList.concat(p)
      }
    }
    showCardsList = Array.from(new Set(showCardsList))
    if (showCardsList.length < 1) {
      return
    }
    this.setData({
      showCardsList: showCardsList,
      showMoreInformation: true,
      current: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    API.getData2("notice.txt", (data) => {
      that.setData({
        notice: data
      })
    })
    app.eventBus.on("clearCourseTable", this, () => {
      that.setData({
        name: "",
        passwd: "",
        count: 0,
        table: [],
        tables: [],
        courseIndex: 0,
        enableRefresh: true,
        courseTableRawData: [],
        showCardsList: [],
      })
    })
    app.eventBus.on("updateCourseTable", this, () => {
      console.log("ok")
      that.getCourseTable()
    })
    app.eventBus.on("refreshCourseTable", this, () => {
      this.handleData({
        data: app.globalData.courseTableRawData
      })
    })
    var courseTime = []
    var month = new Date().getMonth() + 1;
    if (month < 5 || month > 9) {
      courseTime = ["8:00", "8:55", "10:10", "11:05", "14:00", "14:55", "16:10", "17:05", "19:00", "19:55", "20:50"]
    } else {
      courseTime = ["8:00", "8:55", "10:10", "11:05", "14:30", "15:25", "16:40", "17:35", "19:30", "20:25", "21:20"]
    }
    this.setData({
      courseTime: courseTime
    })
    var that = this

    app.globalData.firstWeek = wx.getStorageSync("firstWeek")
    this.setData({
      firstWeek: app.globalData.firstWeek,
    })
    API.getData2("date.txt", (data) => {
      that.setData({
        firstWeek: data
      })
      wx.setStorageSync("firstWeek", data)
    })
    if (options.courseTableRawData != undefined) {
      wx.navigateTo({
        url: 'CourseTableFriend/CourseTableFriend?courseTableRawData=' + options.courseTableRawData,
      })
    }
    app.globalData.courseTableRawData = wx.getStorageSync("courseTableRawData")
    if (app.globalData.courseTableRawData != "") {
      this.handleData({
        data: app.globalData.courseTableRawData
      })
    } else {
      this.getCourseTable()
    }
  },
  onUnload: function () {
    app.eventBus.off("updateCourseTable", this)
    app.eventBus.off("refreshCourseTable", this)
    app.eventBus.off("clearCourseTable", this)
  },
  refresh: function () {
    this.getCourseTable()
  },
  onShareAppMessage: function (e) {
    console.log('courseTableRawData=' + JSON.stringify(this.data.table))
    return {
      title: '我的课程表',
      path: 'pages/CourseTable/CourseTable?courseTableRawData=' + JSON.stringify(this.data.table),
    }
  }
})