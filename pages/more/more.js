Page({
  data: {
    svgCDN: 'https://cdn.jsdelivr.net/gh/dreace/NUC-Info-Static@master/svg/',
  },
  navArticle: function (e) {
    wx.navigateTo({
      url:
        e.currentTarget.dataset.url + '?type=' + e.currentTarget.dataset.type,
    });
  },
  nav: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    });
  },
});
