const app = getApp();
Page({
  data: {
    total: '0 KiB',
    used: '0 KiB',
  },
  clearAll: function () {
    wx.showModal({
      title: '确认清空本地存储',
      content: '清空本地存储将退出所有账号，并清理所有本地数据',
      confirmColor: '#e54d42',
      success: res => {
        if (res.confirm) {
          wx.clearStorageSync();
          this.update();
          app.storage.clear();
          app.getOpenId();
        }
      },
    });
  },
  update: function () {
    wx.getStorageInfo({
      success: option => {
        this.setData({
          total: (option.limitSize / 1024).toFixed(2) + ' MiB',
          used:
            option.currentSize > 1024
              ? (option.currentSize / 1024).toFixed(2) + ' MiB'
              : option.currentSize + ' KiB',
        });
      },
    });
  },
  onLoad: function () {
    this.update();
  },
});
