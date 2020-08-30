const app = getApp();
Page({
  data: {
    isMainLogin: [],
    isFitnessLogin: !!app.storage.getKey('fitness'),
    isPhysicalLogin: !!app.storage.getKey('physical'),
    accounts: [],
  },
  logoutMain(e) {
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
          wx.showToast({
            title: '已退出登录',
          });
          const accounts = app.storage.getKey('accounts');
          accounts.splice(e.target.dataset.index, 1);
          if (accounts.length > 0) {
            app.storage.setKey('name', accounts[0].name);
            app.storage.setKey('password', accounts[0].password);
            app.eventBus.emit('updateTimeTable', false);
            app.eventBus.emit('updateGrade');
          }
          app.storage.save();
          this.refreshLoginStatus();
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
    this.refreshLoginStatus();
  },
  nameChange: function (e) {
    const index = e.target.dataset.index;
    const accounts = app.storage.getKey('accounts');
    app.storage.setKey('name', accounts[index].name);
    app.storage.setKey('password', accounts[index].password);
    this.refreshLoginStatus();
    app.eventBus.emit('updateTimeTable', false);
    app.eventBus.emit('updateGrade');
  },
  refreshLoginStatus() {
    const isMainLogin = [];
    if (!(app.storage.getKey('accounts') instanceof Array)) {
      app.storage.setKey('accounts', []);
    }
    const accounts = app.storage.getKey('accounts');
    for (let i = 0; i < accounts.length; i++) {
      if (app.storage.getKey('name') === accounts[i].name) {
        isMainLogin.push(true);
      } else {
        isMainLogin.push(false);
      }
    }
    this.setData({
      isMainLogin,
      accounts,
      isFitnessLogin: !!app.storage.getKey('fitness'),
      isPhysicalLogin: !!app.storage.getKey('physical'),
    });
  },
});
