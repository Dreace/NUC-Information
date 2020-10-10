const app = getApp();
let name = '';
let password = '';
let captcha = '';
Page({
  data: {
    showPassword: false,
    captchaInfo: {},
  },
  getCaptcha: function () {
    app.api.request({
      dontShowLoading: true,
      url: 'v3/fitness/captcha',
      data: {},
      callBack: data => {
        this.setData({
          captchaInfo: data,
        });
      },
    });
  },
  inputname: function (e) {
    name = e.detail.value;
  },
  inputcaptcha: function (e) {
    captcha = e.detail.value;
  },
  inputpasswd: function (e) {
    password = e.detail.value;
  },
  login: function (e) {
    if (!name || !password) {
      wx.showToast({
        title: '账号密码不能为空',
        icon: 'none',
        duration: 2500,
      });
      return;
    }
    if (!captcha) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2500,
      });
      return;
    }
    app.api.request({
      rawData: true,
      url: 'v3/fitness/login',
      data: {
        name: name,
        passwd: password,
        JSESSIONID: this.data.captchaInfo.JSESSIONID,
        captcha: captcha,
      },
      callBack: data => {
        if (data.code == 0) {
          wx.showToast({
            title: '登录成功',
            icon: 'succes',
            duration: 2500,
          });
          app.storage.setKey('fitness', { id: data.data.id });
          app.eventBus.emit('updateFitness');
          wx.navigateBack();
        } else {
          wx.showToast({
            title: data.message,
            image: '/images/Sad.png',
          });
          this.getCaptcha();
        }
      },
    });
  },
  onLoad: function () {
    this.getCaptcha();
  },
});
