//app.js
const eventBus = require("./utils/eventBus.js")
const API = require("./utils/API.js")
App({
  eventBus: eventBus,
  API: API,
  globalData: {
    name: "",
    passwd: "",
    autoVcode: "",
    firstWeek: "",
    courseTableRawData: [],
    gradeRawData: [],
    converted: true,
    accountList: [],
    updateCourseTable: false,
    updateGrade: false,
    accountID: -1,
    clearFlagCourseTable: false,
    clearFlagGrade: false,
    additionalData: {},
    term: undefined,
    PhyEwsRawData: undefined,
    PhyEwsname: undefined,
    PhyEwspassed: undefined,
    updatePhyEwsGrade: false,
    clearFlagPhyEwsGrade: false,
    map: [],
    imgCDN: "https://img.dreace.top/",
    mapShowed: true,
  },
  onLaunch: function() {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = {
          width: 80,
          height: 30,
          left: e.windowWidth - 12 - 80,
          right: e.windowWidth - 12,
          top: e.statusBarHeight + 10,
          bottom: e.statusBarHeight + 10 + 30
        }
        try {
          if (typeof(qq) === 'undefined') {
            custom = wx.getMenuButtonBoundingClientRect();
          }
        } catch (error) { }
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function(res) {
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function() {
      wx.setStorageSync("updated", true)
      updateManager.applyUpdate()
    })

    updateManager.onUpdateFailed(function() {
      wx.showToast({
        title: '版本更新失败',
      })
    })
    API.loadKeyFromStorage()
    this.globalData.converted = wx.getStorageSync("converted")
    this.globalData.name = wx.getStorageSync("name")
    this.globalData.passwd = wx.getStorageSync("passwd")
    this.globalData.mapShowed = wx.getStorageSync("mapShowed")
    var temp = undefined
    temp = wx.getStorageSync("additionalData")
    if (temp != "") {
      this.globalData.additionalData = temp
    }
    var that = this
    if (this.globalData.converted === true) {
      this.globalData.accountList = wx.getStorageSync("accountList")
    }
    var ID = wx.getStorageSync("accountID")
    if (ID == "") {
      this.globalData.accountID = -1
    }
    if (wx.getStorageSync("updated")) {
      wx.setStorageSync("updated", false)
      wx.showModal({
        title: '更新完成',
        content: '已更新到最新版本，是否查看版本说明？',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../pages/WhatsNew/WhatsNew',
            })
          }
        }
      })
    }
  },
})