Page({
  data: {
    accountList: [],
  },
  doDel(e) {
    var accountList = this.data.accountList
    accountList.splice(e.target.id, 1)
    this.setData({
      accountList: accountList
    })
    var app = getApp()
    if (accountList.length < 1) {
      wx.clearStorageSync()
      app.globalData.name = ""
      app.globalData.passwd = ""
      app.globalData.courseTableRawData = []
      app.globalData.gradeRawData = []
      app.globalData.clearFlagCourseTable = true
      app.globalData.clearFlagGrade = true
    } else if (app.globalData.accountID == e.target.id) {
      app.globalData.accountID = 0
      app.globalData.name = this.data.accountList[0]["name"]
      app.globalData.passwd = this.data.accountList[0]["passwd"]
      wx.setStorageSync("name", app.globalData.name)
      wx.setStorageSync("accountID", app.globalData.accountID)
      wx.setStorageSync("passwd", app.globalData.passwd)
      app.globalData.clearFlagCourseTable = true
      app.globalData.clearFlagGrade = true
    } else if (e.target.id < app.globalData.accountID) {
      app.globalData.accountID -= 1
      wx.setStorageSync("accountID", app.globalData.accountID)
    }

    app.globalData.accountList = accountList
    wx.setStorageSync("accountList", accountList)
  },
  doEdit(e) {
    wx.navigateTo({
      url: '/pages/Setting/Setting?id=' + e.target.id,
    })
  },
  addAccount() {
    wx.navigateTo({
      url: '/pages/Setting/Setting?id=' + -1,
    })
  },
  switchAccount: function(e) {
    var app = getApp()
    if (app.globalData.name != this.data.accountList[e.currentTarget.id]["name"]) {
      app.globalData.name = this.data.accountList[e.currentTarget.id]["name"]
      app.globalData.passwd = this.data.accountList[e.currentTarget.id]["passwd"]
      app.globalData.accountID = e.currentTarget.id
      wx.setStorageSync("name", app.globalData.name)
      wx.setStorageSync("accountID", app.globalData.accountID)
      wx.setStorageSync("passwd", app.globalData.passwd)
      app.globalData.updateCourseTable = true
      app.globalData.updateGrade = true
    }

    wx.reLaunch({
      url: '/pages/My/My',
    })
  },
  onShow: function() {
    var app = getApp()
    this.setData({
      accountList: app.globalData.accountList
    })
    wx.setStorageSync("accountList", this.data.accountList)
    console.log(this.data.accountList.length)
    if (this.data.accountList.length == 1) {
      app.globalData.name = this.data.accountList[0]["name"]
      app.globalData.passwd = this.data.accountList[0]["passwd"]
      wx.setStorageSync("name", app.globalData.name)
      wx.setStorageSync("passwd", app.globalData.passwd)
    }
  },
  onLoad: function() {
    var app = getApp()
    var list = []
    var that = this
    if (!(app.globalData.converted === true)) {
      app.globalData.converted = true
      wx.setStorageSync("converted", true)
      if (wx.getStorageSync("name") == "") {
        return
      }
      list.push({
        remark: "不愿透露姓名",
        name: wx.getStorageSync("name"),
        passwd: wx.getStorageSync("passwd")
      })
      that.setData({
        accountList: list
      })
      app.globalData.accountList = list
      wx.setStorageSync("accountList", app.globalData.accountList)
    } else {
      that.setData({
        accountList: app.globalData.accountList
      })
    }
  }
})