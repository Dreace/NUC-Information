const app = getApp();
Page({
  data: {
    isMainLogin:
      app.storage.getKey('name') && app.storage.getKey('name') !== 'guest',
    isFitnessLogin: !!app.storage.getKey('fitness'),
    isPhysicalLogin: !!app.storage.getKey('physical'),
  },
  logoutMain() {
    wx.showModal({
      title: '确认退出登录',
      content: '退出教务系统登录后，将清空已保存的本地信息',
      confirmColor: '#e54d42',
      success: res => {
        if (res.confirm) {
          app.storage.removeKey('name');
          app.storage.removeKey('password');
          app.storage.removeKey('timetableCache');
          app.storage.removeKey('gradeCache');
          this.setData({
            isMainLogin: false,
          });
          wx.showToast({
            title: '已退出登录',
          });
        }
      },
    });
  },
  logoutFitness() {
    wx.showModal({
      title: '确认退出登录',
      content: '退出体育综合信息管理系统登录后，将清空已保存的本地信息',
      confirmColor: '#e54d42',
      success: res => {
        if (res.confirm) {
          app.storage.removeKey('fitness');
          this.setData({
            isFitnessLogin: false,
          });
          wx.showToast({
            title: '已退出登录',
          });
        }
      },
    });
  },
  logoutPhysical() {
    wx.showModal({
      title: '确认退出登录',
      content: '退出物理教学实验中心登录后，将清空已保存的本地信息',
      confirmColor: '#e54d42',
      success: res => {
        if (res.confirm) {
          app.storage.removeKey('physical');
          this.setData({
            isPhysicalLogin: false,
          });
          wx.showToast({
            title: '已退出登录',
          });
        }
      },
    });
  },
  onShow: function () {
    this.setData({
      isMainLogin:
        app.storage.getKey('name') && app.storage.getKey('name') !== 'guest',
      isFitnessLogin: !!app.storage.getKey('fitness'),
      isPhysicalLogin: !!app.storage.getKey('physical'),
    });
  },
});
