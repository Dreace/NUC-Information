//app.js
App({
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
    announcementCheck: undefined,
    interval: undefined
  },
  getAnnouncementCheck: function() {
    var that = this
    wx.request({
      url: 'https://dreace.top/dl/Announcement/0.json',
      success: function(res) {
        if (that.globalData.announcementCheck != res.data["announcementCheck"]) {
          wx.showTabBarRedDot({
            index: 3,
          })
        }
      }
    })
  },
  onLaunch: function() {

    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            wx.setStorageSync("updated", true)
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function() {
      wx.showToast({
        title: '版本更新失败',
      })
    })
    console.log(wx.getStorageSync("updated"))
    this.globalData.converted = wx.getStorageSync("converted")
    this.globalData.name = wx.getStorageSync("name")
    this.globalData.passwd = wx.getStorageSync("passwd")
    this.globalData.announcementCheck = wx.getStorageSync("announcementCheck")
    var that = this

    that.getAnnouncementCheck()
    var interval = setInterval(that.getAnnouncementCheck, 10000)
    this.globalData.interval = interval
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