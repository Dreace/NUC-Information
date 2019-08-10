// pages/map/search.js
//获取应用实例
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    keyword: null,
    buildlData: app.globalData.map,
    showData: null,
    cursor: 0,
    visible: true,
    imgCDN: app.globalData.imgCDN
  },
  onCancel: function () {
    wx.navigateBack({

    })
  },
  openLocation: function (e) {
    console.log(e)
    wx.openLocation({
      latitude: Number(e.currentTarget.dataset["latitude"]),
      longitude: Number(e.currentTarget.dataset["longitude"]),
      name: "中北大学",
      address: e.currentTarget.dataset["name"]
    })
  },
  onShow:function(){
    this.setData({
      buildlData: app.globalData.map
    })
  },
  bindSearchInput: function (e) {
    let showData = new Array();
    let searchdata = this.data.buildlData;
    if (e.detail.cursor >= this.data.cursor) {
      //输入文字
      let inputData = e.detail.value

      if (inputData) {
        let z = 0
        for (var b in searchdata) {
          for (var i in searchdata[b].data) {
            if (searchdata[b].data[i].name.indexOf(inputData) != -1) {
              let build = searchdata[b].data[i];
              build.tid = b;
              build.bid = i;
              z = z + 1;
              build.index = z;
              showData.push(build);
            }
          }
        }
        this.setData({
          showData: showData,
          visible: false
        });
      }
    } else {
      this.setData({
        showData: null
      });
    }
    this.data.cursor = e.detail.cursor;
  },
  reset: function () {
    this.setData({
      keyword: null,
      visible: true
    });
  }
})