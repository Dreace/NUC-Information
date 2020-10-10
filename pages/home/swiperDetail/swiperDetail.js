const app = getApp();
Page({
  data: {
    content: '',
  },
  onLoad: function (options) {
    app.api.request({
      url: `v3/slides/${options.id}`,
      data: {},
      callBack: data => {
        this.setData({
          content: data.content,
        });
      },
    });
  },
});
