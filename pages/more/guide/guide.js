const cdnUrl = 'https://cdn.jsdelivr.net/gh/dreace/NUC-Guide@master';
Page({
  data: {
    cdnUrl,
  },
  goDetail: e => {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
      guide: [],
    });
  },
  onLoad: function () {
    wx.request({
      url: `${cdnUrl}/index.json`,
      success: res => {
        this.setData({
          guide: res.data,
        });
      },
    });
  },
});
