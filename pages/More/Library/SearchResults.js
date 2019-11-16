// pages/More/Library/SearchResults.js
var app = getApp()
var page = 1
var totalPages = Infinity
var data = ""
var api = "SearchLibrary"
var type = ""
Page({

  data: {
    bookList: []
  },
  onReachBottom: function() {
    page = page + 1
    this.searchBook({
      page: page
    })
  },
  goBookDetail(e) {
    wx.navigateTo({
      url: 'BookDetail?detail=' + JSON.stringify(this.data.bookList[e.currentTarget.dataset.index]),
    })
  },
  searchBook(e) {
    if (page >= totalPages) {
      wx.showToast({
        title: '没有更多数据',
        icon: 'none'
      })
      return
    }
    var that = this
    app.API.newAPI({
      url: api,
      data: {
        keyword: data,
        page: e.page,
        type: type
      },
      callBack: (data) => {
        var bookList = this.data.bookList
        bookList = bookList.concat(data["list"])
        totalPages = Math.ceil(data["total_records"] / data["page_records"])
        that.setData({
          bookList: bookList
        })
      }
    })
    // app.API.cloudAPI(
    //   api, {
    //     keyword: data,
    //     page: e.page,
    //     type: type
    //   }, (data) => {
    //     var bookList = this.data.bookList
    //     bookList = bookList.concat(data["list"])
    //     totalPages = Math.ceil(data["total_records"] / data["page_records"])
    //     that.setData({
    //       bookList: bookList
    //     })
    //   }
    // )
  },
  onLoad: function(options) {
    page = 1
    totalPages = Infinity
    if (options.bookName) {
      data = options.bookName
      api = "SearchLibrary"
      type = options.type
    } else {
      data = options.isbn
      api = "SearchLibraryByISBN"
    }
    this.searchBook({
      page: 1
    })
  },

})