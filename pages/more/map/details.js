const app = getApp();
Page({
  data: {
    tid: 0,
    bid: 0,
    building: {
      img: [], //加载中图片地址
    },
    title: '',
    imgCDN: 'https://img.dreace.top/',
  },
  openLocation: function (e) {
    console.log(e);
    wx.openLocation({
      latitude: Number(e.currentTarget.dataset['latitude']),
      longitude: Number(e.currentTarget.dataset['longitude']),
      name: '中北大学',
      address: e.currentTarget.dataset['name'],
    });
  },
  onLoad: function (options) {
    if (!app.globalData.map) {
      app.api.staticData('map/map.json', data => {
        this.setData({
          buildlData: data,
        });
        app.globalData.map = data;
        this.afterLoad(options);
      });
    } else {
      this.afterLoad(options);
    }
  },
  afterLoad: function (options) {
    const bid = parseInt(options.bid);
    const tid = parseInt(options.tid);
    const building = app.globalData.map[tid].data[bid];
    this.setData({
      bid: bid,
      tid: tid,
      building: building,
      title: building.name,
    });
  },
  onShareAppMessage: function () {
    return {
      title: this.data.building.name + ' - 中北大学校园导览',
      path: `pages/more/map/details?tid=${this.data.tid}&bid=${this.data.bid}`,
      imageUrl: this.data.imgCDN + this.data.building.img[0],
    };
  },
});
