// pages/ClassTable/ClassTable.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorArrays: ["#ca8269", "#b23e52", "#008d56", "#455765", "#cd6118", "#474b42", "#6f6f43", "#48493f", "#6c2c2f", "#79520b", "#cd6118", "#104539", "#003a47", "#595455", "#6d3c14", "#005b98", "ee869a", "73b8e2", "b28c6e", "bce1df"],
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
    isShowConfirm: false, //是否只显示确定按钮，默认不是
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
    indexToCard: undefined
  },
  backto: function () {
    wx.navigateBack({

    })
  },
  preventTouchMove: function () { },
  closethis: function () {
    this.setData({
      showMoreInformation: false
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
  handleData: function (e) {
    var data = e.data
    var that = this
    if (data[0]["code"] === "-1") {
      wx.showToast({
        title: '加载失败',
        image: '/images/Error.png',
        duration: 3000
      })
      return
    }
    if (data[0]["code"] === "1") {
      var that = this;
      this.setData({
        tips: "验证码错误",
        showTopTips: true
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      return
    }
    if (data[0]["code"] === "2") {
      var that = this;
      this.setData({
        tips: "账号或密码错误",
        showTopTips: true
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      return
    }
    var count = data[1]["count"]
    var terms = []
    for (var i = count + 1; i > 1; i--) {
      terms.push(data[i][1])
    }
    that.setData({
      terms: terms,
      count: count,
      tables: data
    })
    that.setData({
      table: that.data.tables[that.data.count + 1 - that.data.termsIndex][2]
    })
    that.setData({
      courseTableRawData: data
    })
    that.handleMoreData()
  },
  handleMoreData: function () {
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
    that.setData({
      hasData: hasData,
      toRight: toRight,
      cardToIndex: cardToIndex,
      indexToCard: indexToCard
    })
  },
  showCardView: function (e) {
    var index = e.currentTarget.dataset.courseindex
    var showCardsList = []
    console.log(index)
    var card = this.data.indexToCard[index]
    for (var i = 0; i < card.length; i++) {
      var p = this.data.cardToIndex[card[i]["x"]][card[i]["y"]]
      showCardsList = showCardsList.concat(p)
    }
    showCardsList = Array.from(new Set(showCardsList))
    this.setData({
      showCardsList: showCardsList,
      showMoreInformation: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      if (options.courseTableRawData != undefined) {
        this.setData({
          enableRefresh: false
        })
        this.handleData({
          data: JSON.parse(options.courseTableRawData)
        })
        wx.showToast({
          title: '好友的课程表',
          mask: true,
          image: '/images/Happy.png',
          duration: 1500
        })
        return
      }
    } catch (e) {
      wx.showToast({
        title: '加载失败',
        mask: true,
        image: '/images/Error.png',
        duration: 1500
      })
    }

  },
  bindTermChange: function (e) {
    this.setData({
      termsIndex: e.detail.value
    })
    this.setData({
      table: this.data.tables[this.data.count + 1 - this.data.termsIndex][2]
    })
    this.handleMoreData()
  },
  refresh: function () {
    this.getCourseTable()
  },
  onShareAppMessage: function (e) {
    return {
      title: '我的课程表',
      path: 'pages/CourseTable/CourseTable?courseTableRawData=' + JSON.stringify(this.data.courseTableRawData),
      success: function (res) {
        wx.showToast({
          title: '已转发',
          mask: true,
          duration: 3000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败',
          mask: true,
          image: '/images/Error.png',
          duration: 3000
        })
      }
    }
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})