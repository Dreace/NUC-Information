// pages/More/Library/Library.js
let app = getApp()
let inputValue = ""
const typeList = ["书名", "作者", "出版社"]
const typeListConvert = {
  "书名": "正题名",
  "作者": "责任者",
  "出版社": "出版者"
}
var typeListIndex = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    barCodeRes: "",
    type: typeList[typeListIndex] + "▼"
  },
  selectType() {
    var that = this
    this.setData({
      type: typeList[typeListIndex] + "▲"
    })
    wx.showActionSheet({
      itemList: typeList,
      success: (e) => {
        typeListIndex = e.tapIndex
        that.setData({
          type: typeList[typeListIndex] + "▼"
        })
      },
      fail:(e)=>{
        that.setData({
          type: typeList[typeListIndex] + "▼"
        })
      }
      
    })
  },
  inputChange(e) {
    inputValue = e.detail.value
  },
  searchByName() {
    if (inputValue.length < 1) {
      return
    }
    wx.navigateTo({
      url: 'SearchResults?bookName=' + inputValue + "&type=" + typeListConvert[typeList[typeListIndex]],
    })
  },
  scanBarcode() {
    var that = this
    wx.scanCode({
      success: function(res) {
        wx.navigateTo({
          url: 'SearchResults?isbn=' + res.result,
        })
      }
    })
  },
  // onReady: function() {
  //   app = getApp()
  // }
})