// pages/Grade/Grade.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    name: "",
    passwd: "",
    autoVcode: false,
    vcode: "",
    count: 0,
    terms: [],
    termsIndex: 0,
    grades: undefined,
    datas: [],
    heads: ["课程名", "属性", "学分", "成绩"],
    vcodeImage: "",
    cookie: "",
    isShowModel: false, //控制弹窗是否显示，默认不显示
    isShowConfirm: false, //是否只显示确定按钮，默认不是
    ModelId: 0, //弹窗id
    ModelTitle: '验证码', //弹窗标题
    ModelContent: '', //弹窗文字内容
    showTopTips: false,
    tips: "",
    enableRefresh: true,
    gradeRawData: undefined
  },
  backto: function() {
    wx.navigateBack({

    })
  },
  preventTouchMove: function() {},
  showModel: function(e) {
    this.setData({
      isShowModel: true,
      ModelContent: e.ModelContent
    })
  },
  cancel: function(e) {
    //关闭模态弹窗
    this.setData({
      isShowModel: false
    })
  },
  //确定事件
  handleData: function(e) {
    var data = e.data
    var that = this
    var terms = []
    terms[0] = data.term
    that.setData({
      terms: terms,
      datas: data.table
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var app = getApp()
    if (options.gradeRawData != undefined) {
      this.setData({
        enableRefresh: false
      })
      this.handleData({
        data: JSON.parse(options.gradeRawData)
      })
      wx.showToast({
        title: '好友的成绩',
        mask: true,
        image: '/images/Happy.png',
        duration: 1500
      })
      return
    }
  },
  bindTermChange: function(e) {

  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  }
})