Page({
  data: {},
  copyText: e => {
    wx.setClipboardData({
      data: e.target.dataset['url'],
    });
  },
});
