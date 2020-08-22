const app = getApp();
let bookDetail;
Page({
  data: {
    bookDetail: {},
    bookAvailableDetail: [],
  },

  onLoad: function (options) {
    bookDetail = JSON.parse(options.detail);
    this.setData({
      bookDetail,
    });
    app.api.request({
      url: `v3/library/books/${bookDetail.id}`,
      data: {},
      callBack: data => {
        this.setData({
          bookAvailableDetail: data,
        });
      },
    });
  },
  onShareAppMessage: function (e) {
    return {
      title: `${bookDetail.name} - 图书馆馆藏`,
      path: 'pages/more/library/detail?detail=' + JSON.stringify(bookDetail),
    };
  },
});
