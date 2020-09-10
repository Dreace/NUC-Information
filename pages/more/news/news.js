const typeName = {
  '1013': '中北新闻',
  '1014': '学校通知',
  '1354': '学术活动',
};
const app = getApp();
let page = 1;

Page({
  data: {
    newsList: [],
    title: '',
    type: 0,
  },
  onReachBottom: function () {
    page = page + 1;
    this.getNews();
  },
  goContent(e) {
    wx.navigateTo({
      url: `detail?id=${e.currentTarget.dataset.id}&type=${this.data.type}`,
    });
  },
  getNews: function () {
    app.api.request({
      url: `v3/news/${this.data.type}`,
      data: {
        page,
      },
      callBack: data => {
        if (!data) {
          wx.showToast({
            title: '没有更多数据',
          });
          page = page - 1;
        } else {
          data.forEach(
            x => (x.publishTime = new Date(x.publishTime).toLocaleString())
          );
          let newsList = this.data.newsList;
          newsList = newsList.concat(data);
          this.setData({
            newsList,
          });
        }
      },
    });
  },
  onLoad: function (options) {
    page = 1;
    this.setData({
      title: typeName[options.type],
      type: options.type,
    });
    this.getNews();
  },
});
