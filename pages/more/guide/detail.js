const cdnUrl = 'https://cdn.jsdelivr.net/gh/dreace/NUC-Guide@master';
Page({
  data: {
    cdnUrl,
    loading: true,
  },
  onLoad: function (parameters) {
    wx.request({
      url: `${cdnUrl}/posts/${parameters.url}.json`,
      success: res => {
        this.setData({
          article: res.data,
        });
      },
      complete: _ => {
        this.setData({
          loading: false,
        });
      },
    });
  },
  copyText(e) {
    let content = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: content,
      success(res) {
        wx.getClipboardData({
          success: rs => {
            console.log(rs);
          },
        });
      },
    });
  },
});
