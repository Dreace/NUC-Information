const app = getApp();
Page({
  data: {
    balance: {},
  },
  getData: function () {
    app.api.request({
      url: `v3/balance`,
      data: {
        name: app.storage.getKey('name'),
        passwd: app.storage.getKey('password'),
      },
      callBack: data => {
        data.balance = parseFloat(data.balance).toFixed(2)
        this.setData({
          balance: data,
        });
        app.storage.setKey('balance', data);
      },
    });
  },
  onLoad: function () {
    if (!app.storage.getKey('name')) {
      wx.showModal({
        title: '未登录',
        content: '跳转到登录页面，或者以游客身份浏览',
        cancelText: '游客',
        cancelColor: '#03a6ff',
        confirmText: '去登陆',
        confirmColor: '#79bd9a',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/my/login/login',
            });
          } else {
            app.storage.setKey('name', 'guest');
            app.storage.setKey('password', 'guest');
            this.getData();
          }
        },
      });
      return;
    }
    this.getData();
  },
});
