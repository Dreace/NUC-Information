const app = getApp();
Page({
  data: {
    fullscreen: false,
    latitude: 38.0127323734,
    longitude: 112.4496173859,
    buildlData: [],
    windowHeight: '',
    windowWidth: '',
    isSelectedBuild: -1,
    isSelectedBuildType: 0,
    imgCDN: 'https://img.dreace.top/',
    islocation: true,
  },
  onLoad: function () {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
        });
      },
    });
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    app.api.staticData('map/map.json', data => {
      this.setData({
        buildlData: data,
      });
      app.globalData.map = data;
      wx.hideLoading();
    });
  },
  navigateHelp: function () {
    wx.navigateTo({
      url: 'help',
    });
  },
  onShow: function () {
    if (!app.storage.getKey('mapShowed')) {
      wx.showModal({
        title: '征集图片',
        content: '如果你有教学楼、宿舍等地点的外部照片能否提供给我？',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: 'help',
            });
          }
        },
      });
    }
    app.storage.setKey('mapShowed', true);
  },
  regionchange(e) {
    // 视野变化
    // console.log(e.type)
  },
  markertap(e) {
    // 选中 其对应的框
    this.setData({
      isSelectedBuild: e.markerId,
    });
  },
  navigateSearch() {
    wx.navigateTo({
      url: 'search',
    });
  },
  openLocation: function (e) {
    wx.openLocation({
      latitude: Number(e.currentTarget.dataset['latitude']),
      longitude: Number(e.currentTarget.dataset['longitude']),
      name: '中北大学',
      address: e.currentTarget.dataset['name'],
    });
  },
  location: function () {
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: res => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        });
      },
    });
  },
  clickButton: function (e) {
    //console.log(this.data.fullscreen)
    //打印所有关于点击对象的信息
    this.setData({
      fullscreen: !this.data.fullscreen,
    });
  },
  changePage: function (event) {
    this.setData({
      isSelectedBuildType: event.currentTarget.id,
      isSelectedBuild: -1,
    });
  },
  onShareAppMessage: function (res) {
    var title, path;
    title = '中北大学校园导览';
    path = 'pages/more/map/map';
    return {
      title: title,
      path: path,
    };
  },
});
