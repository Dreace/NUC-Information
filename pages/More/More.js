// pages/More/More.js
let videoAd = null
let interstitialAd = null
Page({
  /**
   * 页面的初始数据
   */
  data: {
    notice: ""
  },
  ad: function () {
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            wx.showToast({
              title: '视频广告加载失败',
            })
          })
      })
    } else {
      wx.showToast({
        title: '当前微信版本不支持视频广告',
      })
    }
  },
  nav: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 在页面中定义插屏广告


    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-92cf10bed8c3ff03'
      })
    }
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-41e72a756d924507'
      })
      videoAd.onLoad(() => { })
      videoAd.onError((err) => { })
      videoAd.onClose((res) => { })
    }

    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },
  onShow: function () {
    var that = this
    wx.request({
      url: 'https://dreace.top/res/notice.txt',
      success: function (res) {
        that.setData({
          notice: res.data
        })
      }
    })
  }

})