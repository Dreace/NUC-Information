//app.js
App({
  globalData: {
    name: "",
    passwd: "",
    autoVcode: "",
    firstWeek:"",
    courseTableRawData: [],
    gradeRawData:[]
  },
  onLaunch: function () {
    if(!wx.getStorageSync("newed")){
      wx.showModal({
        title: '更新完成',
        content: '由于系统升级,请前往"我的"更新信息',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../pages/Setting/Setting',
            })
          }
        }
      })
    }
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            wx.setStorageSync("updated", true)
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      wx.showToast({
        title: '版本更新失败',
      })
    })
    console.log(wx.getStorageSync("updated"))
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
      }
      )
    }
  },
})