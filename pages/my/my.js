const app = getApp();
let lastTap = 0;
let tapCount = 0;
const statusMap = {
  '-1': '权限已注销',
  '-2': '已过期',
  '-3': '无权限',
};
Page({
  data: {
    account: app.storage.getKey('name'),
    openId: app.storage.getKey('openId'),
    version: app.storage.getKey('version'),
    insider: false,
    insiderText: '',
  },
  copyOpenId: function () {
    wx.setClipboardData({
      data: this.data.openId,
    });
  },
  OnTapName() {
    if (Date.now() - lastTap < 5e3) {
      tapCount += 1;
    } else {
      tapCount = 1;
    }
    lastTap = Date.now();
    if (tapCount == 3) {
      if (!app.storage.getKey('openId')) {
        return;
      }
      app.api.request({
        url: `v3/insiders/${app.storage.getKey('openId')}`,
        data: {},
        callBack: data => {
          if (data.status === -3 || data.status === -2 || data.status == -1) {
            wx.showToast({
              title: statusMap[data.status.toString()],
            });
            this.setData({ insider: false });
            app.storage.removeKey('insider');
            return;
          }
          this.setInsiderStatus(data);
        },
      });
    }
  },
  setInsiderStatus: function (data) {
    let insiderText = '';
    if (data.status == 0) {
      insiderText = new Date(data.expireAt).toLocaleString() + ' 到期';
    } else if (data.status == 1) {
      insiderText = '永久权限';
    }
    app.storage.setKey('insider', data);
    this.setData({
      insider: data,
      insiderText,
    });
  },
  toFeedback: function () {
    // wx.getUserInfo({
    //   success: res => {
    //     console.log(res);
    //   },
    // });
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
  onShow: function () {
    this.setData({
      account: app.storage.getKey('name'),
    });
  },
  onLoad: function () {
    this.setData({
      isQQ: !(typeof qq === 'undefined'),
      openId: app.storage.getKey('openId'),
    });
    if (app.storage.getKey('insider')) {
      this.setInsiderStatus(app.storage.getKey('insider'));
    }
  },
});
