//获取应用实例
var app = getApp();
Page({
  data: {
    fullscreen: false,
    latitude: 38.0127323734,
    longitude: 112.4496173859,
    buildlData: [],
    windowHeight: "",
    windowWidth: "",
    isSelectedBuild: -1,
    isSelectedBuildType: 0,
    imgCDN: app.globalData.imgCDN,
    islocation: true
  },
  onLoad: function () {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        //获取当前设备宽度与高度，用于定位控键的位置
        _this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
        })
        console.log(res.windowWidth)
      }
    })
    //载入更新后的数据
    wx.showLoading({
      title: '加载地图数据',
    })
    wx.request({
      url: 'https://dreace.top/res/CampusTour.json',
      success: function (res) {
        _this.setData({
          buildlData: res.data
        })
        app.globalData.map = res.data
      },
      complete: function () {
        wx.hideLoading()
      }
    })
    // this.setData({
    //   buildlData: app.globalData.map
    // })
  },
  navigateHelp:function(){
    wx.navigateTo({
      url: 'help',
    })
  },
  onShow: function () {
    if (!app.globalData.mapShowed) {
      wx.showModal({
        title: '征集图片',
        content: '如果你有教学楼、宿舍等地点的外部照片能否提供给我？',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: 'help',
            })
          }
        }
      })
    }
    wx.setStorageSync("mapShowed", true)
    app.globalData.mapShowed = true
  },
  regionchange(e) {
    // 视野变化
    // console.log(e.type)
  },
  markertap(e) {
    // 选中 其对应的框
    this.setData({
      isSelectedBuild: e.markerId
    })
    let temp = this.data.buildlData
    for (var i in temp[this.data.isSelectedBuildType].data) {
      temp[this.data.isSelectedBuildType].data[i].iconPath = temp[this.data.isSelectedBuildType].data[i].iconPath.replace("-1.png", ".png")
    }
    temp[this.data.isSelectedBuildType].data[e.markerId].iconPath = temp[this.data.isSelectedBuildType].data[e.markerId].iconPath.replace(".png", "-1.png")
    this.setData({
      buildlData: temp
    })
    // console.log("e.markerId", e.markerId)
  },
  navigateSearch() {
    wx.navigateTo({
      url: 'search'
    })
  },
  openLocation: function (e) {
    wx.openLocation({
      latitude: Number(e.currentTarget.dataset["latitude"]),
      longitude: Number(e.currentTarget.dataset["longitude"]),
      name: "中北大学",
      address: e.currentTarget.dataset["name"]
    })
  },
  location: function () {
    var _this = this
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
      success: function (res) {
        _this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
    })
  },
  clickButton: function (e) {
    //console.log(this.data.fullscreen)
    //打印所有关于点击对象的信息
    this.setData({
      fullscreen: !this.data.fullscreen
    })
  },
  changePage: function (event) {
    this.setData({
      isSelectedBuildType: event.currentTarget.id,
      isSelectedBuild: -1
    });
  },
  onShareAppMessage: function (res) {
    var title, path;
    title = '中北大学校园导览'
    path = "pages/More/CampusTour/CampusTour"
    return {
      title: title,
      path: path,
    }
  },
})