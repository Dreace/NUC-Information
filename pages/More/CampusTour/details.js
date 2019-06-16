// pages/map/details.js
//获取应用实例
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tid: 0,
    bid: 0,
    building: {
      img: []//加载中图片地址
    },
    imgCDN: app.globalData.imgCDN
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var bid = parseInt(options.bid);
    var tid = parseInt(options.tid);
    if (!options.bid || !options.tid) {
      var data = app.globalData.introduce;
    } else {
      var data = app.globalData.map[tid].data[bid];
    }
    this.setData({
      bid: bid,
      tid: tid,
      building: data
    });
    wx.setNavigationBarTitle({
      title: data.name
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var title, path;
    title = this.data.building.name + ' - 中北大学校园导览'
    path = "pages/More/CampusTour/details?tid=" + this.data.tid + "&bid=" + this.data.bid
    return {
      title: title,
      path: path,
      imageUrl: app.imgCDN + this.data.building.img[0],
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})