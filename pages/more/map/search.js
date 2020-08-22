const app = getApp();
Page({
  data: {
    customBarHeight: app.storage.getKey('customBarHeight'),
    list: [],
    imgCDN: 'https://img.dreace.top/',
  },
  onCancel: function () {
    wx.navigateBack({});
  },
  openLocation: function (e) {
    wx.openLocation({
      latitude: Number(e.currentTarget.dataset['latitude']),
      longitude: Number(e.currentTarget.dataset['longitude']),
      name: '中北大学',
      address: e.currentTarget.dataset['name'],
    });
  },
  bindSearchInput: function (e) {
    const list = [];
    const inputData = e.detail.value;
    if (inputData) {
      let z = 0;
      for (let b in app.globalData.map) {
        for (let i in app.globalData.map[b].data) {
          if (app.globalData.map[b].data[i].name.indexOf(inputData) != -1) {
            const build = app.globalData.map[b].data[i];
            build.tid = b;
            build.bid = i;
            z = z + 1;
            build.index = z;
            list.push(build);
          }
        }
      }
      this.setData({
        list,
      });
    }
  },
});
