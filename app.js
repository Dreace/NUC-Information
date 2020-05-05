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
    additionalData: [],
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
  onLaunch: function () {
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
          if (typeof (qq) === 'undefined') {
            custom = wx.getMenuButtonBoundingClientRect();
          }
        } catch (error) {}
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.setStorageSync("updated", true)
      updateManager.applyUpdate()
    })

    updateManager.onUpdateFailed(function () {
      wx.showToast({
        title: '版本更新失败',
      })
    })
    API.loadKeyFromStorage()
    this.globalData.converted = wx.getStorageSync("converted")
    this.globalData.name = wx.getStorageSync("name")
    this.globalData.passwd = wx.getStorageSync("passwd")
    this.globalData.mapShowed = wx.getStorageSync("mapShowed")
    this.globalData.additionalData = wx.getStorageSync("additionalData")
    var that = this
    if (this.globalData.converted) {
      this.globalData.accountList = wx.getStorageSync("accountList")
    }
    if (!wx.getStorageSync("accountID")) {
      this.globalData.accountID = -1
    }
    if (this.globalData.name && !wx.getStorageSync('updatedPasswd')) {
      wx.removeStorageSync('additionalData')
      wx.removeStorageSync('accountList')
      wx.removeStorageSync('name')
      wx.removeStorageSync('passwd')
      this.globalData.name = ""
      this.globalData.passwd = ""
      this.globalData.accountList = []
      this.globalData.accountID = -1
      wx.showModal({
        title: '需重新登录',
        content: '已适配新教务系统，需重新登录，默认密码“zbdx+身份证后六位”',
        confirmText: "去登陆",
        confirmColor: "#79bd9a",
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/Account/Account',
            })
          }
        }
      })
    }
    if (wx.getStorageSync("updated")) {
      wx.setStorageSync("updated", false)
      wx.showModal({
        title: '更新完成',
        content: '已更新到最新版本，是否查看版本说明？',
        success: function (res) {
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