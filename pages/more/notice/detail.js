const app = getApp();
Page({
  data: {
    detail: {},
  },
  onLoad: function (options) {
    app.api.request({
      url: `v3/notices/${options.id}`,
      data: {},
      callBack: data => {
        if (data) {
          data.time = new Date(data.time).toLocaleString();
          this.setData({
            detail: data,
          });
        }
      },
    });
  },
});
