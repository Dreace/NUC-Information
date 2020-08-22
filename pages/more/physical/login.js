const app = getApp();
let name;
let password;
Page({
  inputname: function (e) {
    name = e.detail.value;
  },
  inputpasswd: function (e) {
    password = e.detail.value;
  },
  login: function (e) {
    if (!name || !password) {
      wx.showToast({
        title: '账号密码不能为空',
        icon: 'none',
        duration: 1000,
      });
      return;
    }
    app.api.request({
      url: 'v3/physical/login',
      data: {
        name: name,
        passwd: password,
      },
      callBack: data => {
        wx.showToast({
          title: '登录成功',
          icon: 'succes',
          duration: 1000,
        });
        app.storage.setKey('physical', {
          name,
          password,
        });
        app.eventBus.emit('updatePhysicalGrade');
        wx.navigateBack();
      },
    });
  },
});
