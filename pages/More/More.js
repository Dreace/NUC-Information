// pages/More/More.js
let videoAd = null
let interstitialAd = null
Page({
  /**
   * 页面的初始数据
   */
  data: {
    notice: "",
  },
  jumpToReward: function() {
    wx.navigateToMiniProgram({
      appId: 'wx18a2ac992306a5a4',
      path: 'pages/apps/largess/detail?id=%2BWTvJNpJDUygPc1CLmE7uw%3D%3D'
    })
  },
  showRewardedVideoAd: function() {
    if (videoAd) {
      videoAd.show().catch(() => {
        videoAd.load()
          .then(() => videoAd.show())
      })
    }
  },
  navArticle: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url + "?type=" + e.currentTarget.dataset.type,
    })
  },
  nav: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-92cf10bed8c3ff03'
      })
    }
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: typeof(qq) === 'undefined' ? 'adunit-41e72a756d924507' : "4a439a4c5aebff88ea5a596b49648907"
      })
      videoAd.onLoad(() => {
        that.setData({
          canShowRewardedVideoAd: true
        })
      })
      videoAd.onError((err) => {})
      videoAd.onClose((res) => {})
    }

    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },
  // onShow: function () {
  //   var that = this
  //   wx.request({
  //     url: 'https://dreace.top/res/notice.txt',
  //     success: function (res) {
  //       that.setData({
  //         notice: res.data
  //       })
  //     }
  //   })
  // }

})