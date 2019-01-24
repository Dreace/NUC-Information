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
    enableRefresh:true,
    gradeRawData:undefined
  },
  backto: function () {
    wx.navigateBack({

    })
  },
  preventTouchMove: function () { },
  showModel: function (e) {
    this.setData({
      isShowModel: true,
      ModelContent: e.ModelContent
    })
  },
  cancel: function (e) {
    //关闭模态弹窗
    this.setData({
      isShowModel: false
    })
  },
  //确定事件
  confirm: function (e) {
    var that = this
    if (this.data.vcode != "") {
      this.setData({
        isShowModel: false
      })

      if (!(this.data.name === "" || this.data.name === "")) {
        wx.showToast({
          title: '加载中',
          icon: 'loading',
          duration: 10000
        })
        wx.request({
          url: 'https://cdn.dreace.top',
          data: {
            name: this.data.name,
            passwd: this.data.passwd,
            vcode: this.data.vcode,
            cookie: this.data.cookie
          },
          success: function (res) {
            wx.hideToast()
            that.handleData({
              data: res.data
            })
          },
          fail: function (e) {
            wx.showToast({
              title: '网络异常',
              image: '/images/Error.png',
              duration: 3000
            })
            console.log(e)
          },
          complete: function () {
            that.setData({
              vcode: ""
            })
          }
        })
      }
    }
  },
  inputvcode: function (e) {
    this.setData({
      vcode: e.detail.value
    })
  },
  handleData: function (e) {
    var data = e.data
    var that = this
    if (data[0]["code"] === "-1") {
      wx.showToast({
        title: '加载失败',
        mask: true,
        image: '/images/Error.png',
        duration: 3000
      })
      return
    }
    if (data[0]["code"] === "1") {
      var that = this;
      this.setData({
        tips: "验证码错误",
        showTopTips: true
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      if (this.data.autoVcode) {
        this.getGradeWithVcode({
          message: "自动识别失败，请手动输入验证码"
        })
      } else {
        this.getGradeWithVcode({
          message: "自动识别关闭，请手动输入验证码"
        })
      }
      return
    }
    if (data[0]["code"] === "2") {
      var that = this;
      this.setData({
        tips: "账号或密码错误",
        showTopTips: true
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      return
    }
    var count = data[1]["count"]
    var terms = []
    for (var i = count + 1; i > 1; i--) {
      terms.push(data[i][1])
    }
    that.setData({
      terms: terms,
      count: count,
      grades: data
    })
    that.setData({
      datas: that.data.grades[that.data.count + 1 - that.data.termsIndex][2],
      gradeRawData:data
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app=getApp()
    app.globalData.name = wx.getStorageSync("name")
    app.globalData.passwd = wx.getStorageSync("passwd")
    app.globalData.autoVcode = wx.getStorageSync("autoVcode")
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
    this.getGrade()
  },
  bindTermChange: function (e) {
    this.setData({
      termsIndex: e.detail.value
    })
    this.setData({
      datas: this.data.grades[this.data.count + 1 - this.data.termsIndex][2]
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})