// pages/ClassTable/ClassTable.js
const API = require("../../utils/API.js")
import {
  $wuxSelect
} from '../../dist/index'

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
    terms: [],
    termsIndex: 0,
    table: undefined,
    tables: [],
    vcodeImage: "",
    cookie: "",
    courseIndex: 0,
    isShowModel: false, //控制弹窗是否显示，默认不显示
    isShowConfirm: true, //是否只显示确定按钮，默认不是
    ModelId: 0, //弹窗id
    ModelTitle: '验证码', //弹窗标题
    ModelContent: '', //弹窗文字内容
    showMoreInformation: false,
    showTopTips: false,
    tips: "",
    enableRefresh: true,
    courseTableRawData: undefined,
    hasData: undefined,
    toRight: undefined,
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
    termName: ["大一", "大二", "大三", "大四"],
    termName_: ["上学期", "下学期"],
    termIndex: 0,
    termIndex_: 0,
    visible: false,
    transitionTime: 400,
    translateY: 0,
    translateY_: 0,
    __maxY: 0, // 内部使用，最大Y的偏移 单位像素
  },
  onSwitch() {
    let translateY = 0
    if (this.data.translateY == 0) {
      translateY = this.data.__maxY
    } else {
      translateY = 0
    }
    this.setData({
      translateY: translateY
    })
    setTimeout(() => {
      this.setData({
        translateY_: translateY
      })
    }, translateY == 0 ? 400 : 0)
  },
  onTermClick(e) {
    // console.log(e.currentTarget.dataset.index)

    let termsIndex = e.currentTarget.dataset.index * 2 + this.data.termIndex_
    if (termsIndex + 1 > this.data.count) {
      this.setData({
        visible: true,
        table: [],
        termIndex: e.currentTarget.dataset.index
      })
    } else {
      this.setData({
        visible: false,
        termIndex: e.currentTarget.dataset.index
      })
      this.bindTermChange(termsIndex)
    }
  },
  onTermClick_(e) {
    // console.log(e.currentTarget.dataset.index)
    let termsIndex = this.data.termIndex * 2 + e.currentTarget.dataset.index
    if (termsIndex + 1 > this.data.count) {
      this.setData({
        visible: true,
        table: [],
        termIndex_: e.currentTarget.dataset.index
      })
    } else {
      this.setData({
        visible: false,
        termIndex_: e.currentTarget.dataset.index
      })
      this.bindTermChange(termsIndex)
    }
  },
  onClick(e) {
    if (e.detail.index === 0) {
      this.refresh()
    } else if (e.detail.index === 4) {
      if (this.data.courseTableRawData !== undefined && this.data.courseTableRawData[0]["name"]) {
        wx.navigateTo({
          url: '/pages/Export/Export?tables=' + JSON.stringify(this.data.courseTableRawData),
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
      console.log(1)
      wx.navigateTo({
        url: '/pages/Add/Add?term=' + this.data.terms[this.data.termsIndex],
      })
    }
  },
  preventTouchMove: function() {},
  closethis: function() {
    this.setData({
      showMoreInformation: false,
      showCardsList: []
    })
  },
  closeAddCiew: function() {
    this.setData({
      showAddView: false
    })
  },
  showInformation: function(e) {
    this.setData({
      showMoreInformation: true
    })
  },
  showInformationConfirm: function() {
    this.setData({
      showMoreInformation: false
    })
  },
  showModel: function(e) {
    this.setData({
      isShowModel: true,
      ModelContent: e.ModelContent
    })
  },
  delete_: function(e) {
    var app = getApp()
    var that = this
    wx.showModal({
      title: '删除',
      content: '确认删除这个课程，删除后不可恢复',
      success: function(res) {
        if (res.confirm) {

          var table = that.data.tables[that.data.termsIndex]["table"]
          console.log(that.data.showCardsList[e.currentTarget.dataset["index"]] - table.length)
          app.globalData.additionalData[that.data.terms[that.data.termsIndex]].splice(that.data.showCardsList[e.currentTarget.dataset["index"]] - table.length, 1)
          that.setData({
            showMoreInformation: false,
            showCardsList: []
          })
          var adata = app.globalData.additionalData[that.data.terms[that.data.termsIndex]]
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
          that.handleMoreData()
        } else {

        }
      }
    })
  },
  handleData: function(e) {
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
    var terms = []
    for (var i = 0; i < data.length; i++) {
      terms.push(data[i]["name"])
    }
    var count = terms.length
    var app = getApp()
    that.setData({
      terms: terms,
      count: count,
      tables: data
    })
    let termsIndex = count - 1
    var adata = app.globalData.additionalData[this.data.terms[termsIndex]]
    if (adata != undefined && adata.length > 0) {
      that.setData({
        table: that.data.tables[termsIndex]["table"].concat(adata)
      })
    } else {
      that.setData({
        table: that.data.tables[termsIndex]["table"]
      })
    }
    that.setData({
      termsIndex: termsIndex,
      visible: false,
      termIndex: Math.ceil(count / 2 - 1),
      termIndex_: 1 - count % 2,
      courseTableRawData: data
    })
    that.handleMoreData()
    wx.setStorageSync("courseTableRawData", data)
  },
  changeWeek: function() {
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
  handleMoreData: function(e) {
    if (!this.data.table) {
      return
    }
    var hasData = new Array()
    var toRight = new Array()
    var that = this
    for (var i = 0; i < 8; i++) {
      hasData[i] = new Array()
      for (var j = 0; j < 12; j++) {
        hasData[i][j] = false
      }
    }
    for (var i = 0; i < this.data.table.length; i++) {
      toRight[i] = false
      if (this.data.table[i]["Course_Start"] === '') {
        continue
      }
      var flag = false
      for (var j = Number(this.data.table[i]["Course_Start"]); j < Number(this.data.table[i]["Course_Length"]) + Number(this.data.table[i]["Course_Start"]); j++) {
        if (hasData[Number(this.data.table[i]["Course_Time"])][j]) {
          flag = true
          break
        }
      }
      if (flag) {
        toRight[i] = true
      }
      for (var j = Number(this.data.table[i]["Course_Start"]); j < Number(this.data.table[i]["Course_Length"]) + Number(this.data.table[i]["Course_Start"]); j++) {
        hasData[Number(this.data.table[i]["Course_Time"])][j] = true
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
      toRight: toRight,
      cardToIndex: cardToIndex,
      indexToCard: indexToCard,
      title: "第" + that.data.weekNow + "周▼",
    })
  },
  handleWeek: function(e) {
    var weekList = []
    var tempList = undefined
    tempList = this.removeChinese(e.data).split(",")
    for (var i = 0; i < tempList.length; i++) {
      var str = String(tempList[i])
      if (str.indexOf("-") != -1) {
        var t = str.split("-")
        for (var j = Number(t[0]); j <= Number(t[1]); j++) {
          weekList.push(j)
        }
      } else {
        weekList.push(Number(str))
      }
    }
    return weekList
  },
  removeChinese: function(strValue) {
    if (strValue != null && strValue != "") {
      var reg = /[\u4e00-\u9fa5]/g;
      return strValue.replace(reg, "");
    } else
      return "";
  },
  getCourseTable: function(e) {
    var that = this
    if (this.data.loading) {
      var that = this;
      this.setData({
        tips: "数据加载中，请勿操作",
        showTopTips: true
      });
      setTimeout(function() {
        that.setData({
          showTopTips: false
        });
      }, 1500);
      return
    }
    var app = getApp()
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
        title: '信息未设置',
        content: '你好像还没有设置教务账号\n请前往"我的"进行设置',
        success: function(res) {
          that.setData({
            showed: false
          })
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/Account/Account',
            })
          }
        }
      })
      return
    }
    this.getCourseTableWithoutVcode()
  },
  getCourseTableWithoutVcode: function() {
    if (!(this.data.name === "" || this.data.passwd === "")) {
      API.getData("coursetable", {
        "name": this.data.name,
        "passwd": this.data.passwd
      }, (data) => {
        if (data) {
          this.handleData({
            data: data
          })
        }
      })
    }
  },
  showCardView: function(e) {
    var index = e.currentTarget.dataset.courseindex
    console.log(e.currentTarget.dataset.courseindex)
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
  onLoad: function(options) {
    // wx.navigateTo({
    //   url: '/pages/More/CampusTour/CampusTour',
    // })
    var app = getApp()
    var that = this
    app.eventBus.on("clearCourseTable", this, () => {
      that.setData({
        name: "",
        passwd: "",
        count: 0,
        terms: [],
        termsIndex: 0,
        table: [],
        tables: [],
        termIndex: 0,
        termIndex_: 0,
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
    var app = getApp()
    app.globalData.firstWeek = wx.getStorageSync("firstWeek")
    this.setData({
      firstWeek: app.globalData.firstWeek
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
    app.globalData.autoVcode = true
    if (app.globalData.courseTableRawData != "") {
      this.handleData({
        data: app.globalData.courseTableRawData
      })
    } else {
      this.getCourseTable()
    }
  },
  bindTermChange: function(e) {
    var that = this
    var app = getApp()
    this.setData({
      termsIndex: e
    })
    let termsIndex = e
    var table = that.data.tables[termsIndex]["table"]
    var adata = app.globalData.additionalData[that.data.terms[termsIndex]]
    console.log(adata != undefined && adata.length > 0)
    if (adata != undefined && adata.length > 0) {
      that.setData({
        table: table.concat(adata)
      })
    } else {
      that.setData({
        table: table
      })
    }
    this.handleMoreData()
  },
  refresh: function() {
    this.getCourseTable()
  },
  onReady() {
    var app = getApp()
    app.globalData.term = this.data.terms[this.data.termsIndex]
    var query = wx.createSelectorQuery();
    var that = this
    query.select('#boxid').boundingClientRect()
    query.exec(function(res) {
      var height
      try {
        height = res[0].height
      } catch (err) {
        height = 105.6
      }
      that.setData({
        __maxY: height
      })
    })
  },
  onShareAppMessage: function(e) {
    var that = this
    var app = getApp()
    var termsIndex = this.data.termsIndex
    var table = that.data.tables[termsIndex]["table"]
    var adata = app.globalData.additionalData[that.data.terms[termsIndex]]
    console.log(adata != undefined && adata.length > 0)
    if (adata != undefined && adata.length > 0) {
      table = table.concat(adata)
    } else {
      table = table
    }
    console.log(table)
    return {
      title: '我的课程表-' + that.data.terms[that.data.termsIndex],
      path: 'pages/CourseTable/CourseTable?courseTableRawData=' + JSON.stringify({
        "term": that.data.terms[that.data.termsIndex],
        "table": table
      }),
    }
  }
})