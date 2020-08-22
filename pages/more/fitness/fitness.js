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
    gradeItems: [],
    buttons,
    p: 0,
    postion: ['bottomRight', 'bottomLeft'],
  },
  goDetail(e) {
    if (!e.currentTarget.dataset.id) {
      return;
    }
    wx.navigateTo({
      url: `detail?id=${e.currentTarget.dataset.id}&title=${e.currentTarget.dataset.title}`,
    });
  },
  onFloatButtonClick(e) {
    if (e.detail.index === 0) {
      this.getGrade();
    } else if (e.detail.index === 2) {
      this.setData({
        p: this.data.p + 1,
      });
    } else if (e.detail.index === 1) {
      this.setData({
        gradeItems: [],
      });
      app.storage.removeKey('fitness');
      wx.navigateTo({
        url: 'login',
      });
    }
  },
  preventTouchMove: function () {},
  getGrade: function () {
    if (!app.storage.getKey('fitness') || !app.storage.getKey('fitness').id) {
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
      return;
    }
    app.api.request({
      url: `v3/fitness/${app.storage.getKey('fitness').id}`,
      data: {},
      callBack: data => {
        this.setData({
          gradeItems: data,
        });
      },
    });
  },
  onLoad: function () {
    this.getGrade();
    app.eventBus.on('updateFitness', this, () => {
      this.getGrade();
    });
  },
  onUnload: function () {
    app.eventBus.off('updateFitness');
  },
});
