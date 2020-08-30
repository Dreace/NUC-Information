const app = getApp();
let page = 1;
let totalPages = Infinity;
let data = '';
let api = 'SearchLibrary';
let type = '';
Page({
  data: {
    bookList: [],
  },
  onReachBottom: function () {
    if (page < totalPages) {
      page += 1;
      this.searchBook({
        page,
      });
    } else {
      wx.showToast({
        title: '到底了',
      });
    }
  },
  goBookDetail(e) {
    wx.navigateTo({
      url:
        'detail?detail=' +
        JSON.stringify(this.data.bookList[e.currentTarget.dataset.index]),
    });
  },
  searchBook() {
    app.api.request({
      url: `${api}${data}`,
      data: type
        ? {
            type,
            page,
          }
        : { page },
      callBack: data => {
        let bookList = this.data.bookList;
        bookList = bookList.concat(data['list']);
        totalPages = Math.ceil(data['records'] / data['recordsPerPage']);
        this.setData({
          bookList: bookList,
        });
      },
    });
  },
  onLoad: function (options) {
    if (options.bookName) {
      data = options.bookName;
      api = 'v3/library/search/name/';
      type = options.type;
    } else {
      data = options.isbn;
      api = 'v3/library/search/isbn/';
    }
    page = 1;
    this.searchBook();
  },
});
