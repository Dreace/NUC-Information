// pages/more/News/Content/Content.js
const typeName = {
  '1013': '中北新闻',
  '1014': '学校通知',
  '1354': '学术活动',
};
const app = getApp();
let id = '';
let type = '';
Page({
  data: {
    content: '',
  },
  onLoad: function (options) {
    id = options.id;
    type = options.type;
    app.api.request({
      url: `v3/news/${type}/${id}`,
      data: {},
      callBack: data => {
        data.publishTime = new Date(data.publishTime).toLocaleString();
        this.setData({
          content: data,
        });
      },
    });
  },
  onShareAppMessage() {
    return {
      title: typeName[type] + '-' + this.data.content['title'],
      path: `pages/more/news/detail?id=${id}&type=${type}`,
    };
  },
});
