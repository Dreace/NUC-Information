// pages/Grade/Grade.js
const buttons = [{
  label: '刷新',
  icon: "/images/Refresh.png",
},
{
  openType: 'share',
  label: '分享',
  icon: "/images/Share.png",

},
{
  label: '切换按钮位置',
  icon: "/images/Switch.png",
}
]
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
    gradeRawData: undefined,
    buttons,
    p: 0,
    postion: ["bottomRight", "bottomLeft"],
    showed: false
  },
  onClick(e) {
    if (e.detail.index === 0) {
      this.refresh()
    } else if (e.detail.index === 2) {
      this.setData({
        p: this.data.p + 1
      })
    }
  },
  copy: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    wx.downloadFile({
      url: 'https://dreace.top/GPA.pdf',
      success: function (res) {
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            wx.hideLoading()
          }
        })
      }
    })
  },
  refresh: function () {
    this.getGrade()
  },
  preventTouchMove: function () { },
  showModel: function (e) {
    this.setData({
      isShowModel: true,
      ModelContent: e.ModelContent
    })
  },
  handleData: function (e) {
    var data = e.data
    var that = this
    if (data[0]["code"] === "-1") {
      wx.showToast({
        title: '服务器异常',
        mask: true,
        image: '/images/Error.png',
        duration: 1500
      })
      return
    }
    if (data[0]["code"] === "1") {
      wx.showToast({
        title: '系统错误',
        image: '/images/Error.png',
        duration: 3000
      })
      return
    }
    if (data[0]["code"] === "0") {
      wx.showToast({
        title: '暂时没有成绩',
        image: '/images/Sad.png',
        duration: 3000
      })
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
    if (count > 0) {
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
        gradeRawData: data
      })
    }
    wx.setStorageSync("gradeRawData", data)
  },
  getGrade: function (e) {
    if (this.data.loading) {
      var that = this;
      this.setData({
        tips: "数据加载中，请勿操作",
        showTopTips: true
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 1500);
      return
    }
    var app = getApp()
    this.setData({
      name: app.globalData.name,
      passwd: app.globalData.passwd,
      autoVcode: app.globalData.autoVcode,
      isShowModel: false,
      vcode: ""
    })
    var that = this
    if (app.globalData.name === "" || app.globalData.passwd === "") {
      if (this.data.showed) {
        return
      }
      this.setData({
        showed: true
      })
      wx.showModal({
        title: '信息未设置',
        content: '你好像还没有设置教务账号\n请前往"我的"进行设置',
        success: function (res) {
          that.setData({
            showed: false
          })
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/Account/Account',
            })
          }
        }
      })
      return
    }
    this.getGradeWithoutVcode()
  },
  getGradeWithoutVcode: function () {
    var check = require("../../utils/check_request_time.js")
    if (!check.check()) {
      return
    }
    var that = this
    if (!(this.data.name === "" || this.data.passwd === "")) {
      wx.showToast({
        title: '加载中',
        mask: true,
        icon: 'loading',
        duration: 60000
      })
      that.setData({
        loading: true
      })
      var auth = require("../../utils/authenticate.js")
      wx.request({
        url: 'https://cdn.dreace.top',
        data: {
          name: this.data.name,
          passwd: this.data.passwd,
          version: auth.version,
          uuid: auth.uuid
        },
        success: function (res) {
          wx.hideToast()
          that.handleData({
            data: res.data
          })
          wx.reportAnalytics('get_grade', {
            name_grade: that.data.name,
            code_grade: res.data[0]["code"],
            count_grade: res.data[1]["count"],
          });
        },
        fail: function () {
          wx.showToast({
            title: '未能完成请求',
            mask: true,
            image: '/images/Error.png',
            duration: 3000
          })
        },
        complete: function () {
          that.setData({
            loading: false
          })
          var app = getApp()
          app.globalData.lastRequestTime = new Date()
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp()
    app.globalData.name = wx.getStorageSync("name")
    app.globalData.passwd = wx.getStorageSync("passwd")
    if (options.gradeRawData != undefined) {
      wx.navigateTo({
        url: 'GradeFriend/GradeFriend?gradeRawData=' + options.gradeRawData,
      })
    }
    app.globalData.gradeRawData = wx.getStorageSync("gradeRawData")
    if (app.globalData.gradeRawData != "") {
      this.handleData({
        data: app.globalData.gradeRawData
      })
    } else {
      this.getGrade()
    }
  },
  bindTermChange: function (e) {
    this.setData({
      termsIndex: e.detail.value
    })
    this.setData({
      datas: this.data.grades[this.data.count + 1 - this.data.termsIndex][2]
    })
  },
  onShareAppMessage: function (e) {
    var that = this
    return {
      title: '我的成绩',
      path: 'pages/Grade/Grade?gradeRawData=' + JSON.stringify({
        "term": that.data.terms[that.data.termsIndex],
        "table": this.data.grades[this.data.count + 1 - this.data.termsIndex][2]
      }),
    }

  },
  onShow: function () {
    var app = getApp()
    if (app.globalData.clearFlagGrade) {
      this.setData({
        loading: false,
        name: "",
        passwd: "",
        count: 0,
        terms: [],
        termsIndex: 0,
        grades: [],
        datas: [],
        gradeRawData: [],
      })
      app.globalData.clearFlagGrade = false
    }
    if (app.globalData.updateGrade) {
      this.getGrade()
      app.globalData.updateGrade = false
      return
    }
    if (this.data.gradeRawData != undefined && this.data.gradeRawData.length > 0) {
      this.handleData({
        data: this.data.gradeRawData
      })
    } else {
      this.getGrade()
    }
  }
})