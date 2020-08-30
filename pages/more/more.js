// pages/more/more.js
let videoAd = null;
let interstitialAd = null;
Page({
  data: {
    svgCDN: 'https://cdn.jsdelivr.net/gh/dreace/NUC-Info-Static@master/svg/',
  },
  navArticle: function (e) {
    wx.navigateTo({
      url:
        e.currentTarget.dataset.url + '?type=' + e.currentTarget.dataset.type,
    });
  },
  nav: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    });
  },
  onLoad: function () {
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-92cf10bed8c3ff03',
      });
    }
    if (interstitialAd) {
      interstitialAd.show().catch(err => {
        console.error(err);
      });
    }
  },
});
