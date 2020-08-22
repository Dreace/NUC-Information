const app = getApp();
const typeList = ['书名', '作者', '出版社'];
const typeListConvert = {
  书名: '正题名',
  作者: '责任者',
  出版社: '出版者',
};
let inputValue = '';
let typeListIndex = 0;
Page({
  data: {
    barCodeRes: '',
    type: typeList[typeListIndex] + '▼',
  },
  selectType() {
    var that = this;
    this.setData({
      type: typeList[typeListIndex] + '▲',
    });
    wx.showActionSheet({
      itemList: typeList,
      success: e => {
        typeListIndex = e.tapIndex;
        that.setData({
          type: typeList[typeListIndex] + '▼',
        });
      },
      fail: e => {
        that.setData({
          type: typeList[typeListIndex] + '▼',
        });
      },
    });
  },
  inputChange(e) {
    inputValue = e.detail.value;
  },
  searchByName() {
    if (inputValue.length < 1) {
      return;
    }
    wx.navigateTo({
      url: `result?bookName=${inputValue}&type=${
        typeListConvert[typeList[typeListIndex]]
      }`,
    });
  },
  scanBarcode() {
    wx.scanCode({
      success: res => {
        wx.navigateTo({
          url: `result?isbn=${res.result}`,
        });
      },
    });
  },
});
