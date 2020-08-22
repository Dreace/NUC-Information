const app = getApp();
Page({
  data: {
    account: app.storage.getKey('name'),
    openId: app.storage.getKey('openId'),
    version: app.storage.getKey('version'),
    insider: false,
  },
  copyOpenId: function () {
    wx.setClipboardData({
      data: app.storage.getKey('openId'),
    });
  },
  toFeedback: function () {
    wx.getUserInfo({
      success: res => {
        console.log(res);
      },
    });
    wx.navigateToMiniProgram({
      appId: 'wx8abaf00ee8c3202e',
      extraData: {
        id: '66656',
      },
    });
  },
  getInfo: function () {
    wx.getUserInfo({});
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onLoad: function () {
    this.setData({
      isQQ: !(typeof qq === 'undefined'),
    });
  },
});
