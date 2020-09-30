const cdnUrl = 'https://cdn.jsdelivr.net/gh/dreace/NUC-Guide@master';
let url = '';
Page({
  data: {
    cdnUrl,
    loading: true,
    article: {},
  },
  onLoad: function (parameters) {
    url = parameters.url;
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
  jumpTo: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    });
  },
  copyText(e) {
    let content = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: content,
    });
  },
  onShareAppMessage: function (e) {
    return {
      title: `${this.data.article.title} - 中北指南`,
      path: `pages/more/guide/detail?url=${url}`,
    };
  },
});
