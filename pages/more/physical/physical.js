const app = getApp();
const buttons = [
  {
    label: '刷新',
    icon: '/images/Refresh.png',
  },
  {
    label: '登出',
    icon: '/images/Logout.png',
  },
  {
    label: '切换按钮位置',
    icon: '/images/Switch.png',
  },
];
Page({
  data: {
    heads: ['序号', '实验', '成绩'],
    buttons,
    p: 0,
    postion: ['bottomRight', 'bottomLeft'],
    gradeItems: [],
  },
  onClick(e) {
    if (e.detail.index === 0) {
      this.getGrade();
    } else if (e.detail.index === 2) {
      this.setData({
        p: this.data.p + 1,
      });
    } else if (e.detail.index === 1) {
      app.storage.removeKey('physical');
      this.setData({
        gradeItems: [],
      });
    }
  },
  preventTouchMove: function () {},
  getGrade: function (e) {
    if (!app.storage.getKey('physical')) {
      wx.showModal({
        title: '未登录',
        content: '登陆后才能查看成绩，现在登录？',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: 'login',
            });
          }
        },
      });
    } else {
      app.api.request({
        url: 'v3/physical/grade',
        data: {
          name: app.storage.getKey('physical').name,
          passwd: app.storage.getKey('physical').password,
        },
        callBack: data => {
          this.setData({
            gradeItems: data,
          });
        },
      });
    }
  },

  onLoad: function () {
    if (
      app.storage.getKey('physical') &&
      app.storage.getKey('physical').cache
    ) {
      this.setData({
        gradeItems: app.storage.getKey('physical').cache,
      });
    } else {
      this.getGrade();
    }
    app.eventBus.on('updatePhysicalGrade', this, () => {
      this.getGrade();
    });
  },
  onUnloadL: function () {
    app.eventBus.off('updatePhysicalGrade');
  },
});
