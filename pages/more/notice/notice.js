const app = getApp();
Page({
  data: {
    stick: [],
    notStick: [],
  },
  goContent(e) {
    wx.navigateTo({
      url: 'detail?id=' + e.currentTarget.dataset.id,
    });
  },
  onLoad: function () {
    app.api.request({
      url: 'v3/notices',
      data: {},
      callBack: data => {
        if (data) {
          data.stick.forEach(x => (x.time = new Date(x.time).toLocaleString()));
          data.notStick.forEach(x => (x.time = new Date(x.time).toLocaleString()));
          this.setData({
            stick: data.stick,
            notStick: data.notStick,
          });
        }
      },
    });
  },
});
