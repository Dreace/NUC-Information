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
    additionalData: {},
    term: undefined,
    PhyEwsRawData: undefined,
    PhyEwsname: undefined,
    PhyEwspassed: undefined,
    updatePhyEwsGrade: false,
    clearFlagPhyEwsGrade: false,
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
    this.globalData.converted = wx.getStorageSync("converted")
    this.globalData.name = wx.getStorageSync("name")
    this.globalData.passwd = wx.getStorageSync("passwd")
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