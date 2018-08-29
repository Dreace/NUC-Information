// pages/ClassTable/ClassTable.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorArrays: ["#48493f", "#ca8269", "#b23e52", "#008d56", "#455765", "#cd6118", "#474b42", "#6f6f43", "#6c2c2f", "#79520b"],
    loading: false,
    name: "",
    passwd: "",
    autoVcode: false,
    vcode: "",
    count: 0,
    terms: [],
    termsIndex: 0,
    table: undefined,
    tables: [],
    vcodeImage: "",
    cookie: "",
    courseIndex: 0,
    isShowModel: false, //控制弹窗是否显示，默认不显示
    isShowConfirm: false, //是否只显示确定按钮，默认不是
    ModelId: 0, //弹窗id
    ModelTitle: '验证码', //弹窗标题
    ModelContent: '', //弹窗文字内容
    showMoreInformation: false,
    showTopTips: false,
    tips: ""
  },
  preventTouchMove: function () { },
  showInformation: function (e) {
    this.setData({
      showMoreInformation: true
    })
  },
  showInformationConfirm: function () {
    this.setData({
      showMoreInformation: false
    })
  },
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
          url: 'https://cdn.dreace.top/coursetable',
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
        this.getCourseTableWithVcode({
          message: "自动识别失败，请手动输入验证码"
        })
      } else {
        this.getCourseTableWithVcode({
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
      tables: data
    })
    that.setData({
      table: that.data.tables[that.data.count + 1 - that.data.termsIndex][2]
    })
    wx.setStorageSync("courseTableRawData", data)
  },
  getCourseTable: function (e) {
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
    if (this.data.name === "" || this.data.name === "") {
      wx.showModal({
        title: '信息未设置',
        content: '你好像还没有设置教务账号\n请前往"我的"进行设置',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/My/My',
            })
          }
        }
      })
      return
    }
    if (this.data.autoVcode) {
      this.getCourseTableWithoutVcode()
    } else {
      this.getCourseTableWithVcode({
        message: "自动识别关闭，请手动输入验证码"
      })
    }
  },
  getCourseTableWithVcode: function (e) {
    var that = this
    try {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
      })
      that.setData({
        loading: true
      })
      wx.request({
        url: 'https://cdn.dreace.top/getvcode',
        success: function (res) {
          wx.hideToast()
          that.setData({
            vcodeImage: 'data:image/jpeg;base64,' + res.data[0],
            cookie: res.data[1]
          })
          that.showModel({
            ModelContent: e.message
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
            loading: false
          })
        }
      })
    } catch (e) {
      console.log(e)
    }
  },
  getCourseTableWithoutVcode: function () {
    var that = this
    if (!(this.data.name === "" || this.data.name === "")) {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
      })
      that.setData({
        loading: true
      })
      wx.request({
        url: 'https://cdn.dreace.top/coursetable',
        data: {
          name: this.data.name,
          passwd: this.data.passwd
        },
        success: function (res) {
          wx.hideToast()
          that.handleData({
            data: res.data
          })
        },
        fail: function () {
          wx.showToast({
            title: '网络异常',
            image: '/images/Error.png',
            duration: 3000
          })
        },
        complete: function () {
          that.setData({
            loading: false
          })
        }
      })
    }
  },
  showCardView: function (e) {
    var index = e.currentTarget.dataset.courseindex
    console.log(index)
    this.setData({
      courseIndex: index,
      showMoreInformation: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp()
    app.globalData.name = wx.getStorageSync("name")
    app.globalData.passwd = wx.getStorageSync("passwd")
    app.globalData.autoVcode = wx.getStorageSync("autoVcode")
    app.globalData.courseTableRawData = wx.getStorageSync("courseTableRawData")
    app.globalData.name = "1707004548"
    app.globalData.passwd = "1707004548"
    app.globalData.autoVcode = true
    if (app.globalData.courseTableRawData != "") {
      this.handleData({
        data: app.globalData.courseTableRawData
      })
    } else {
      this.getCourseTable()
    }
  },
  bindTermChange: function (e) {
    this.setData({
      termsIndex: e.detail.value
    })
    this.setData({
      table: this.data.tables[this.data.count + 1 - this.data.termsIndex][2]
    })
  },
  refresh: function () {
    this.getCourseTable()
  },
  onShareAppMessage: function (e) {
    return {
      title: '我的课程表',
      path: 'pages/CourseTable/CourseTable',
      success: function (res) {
        wx.showToast({
          title: '已转发',
          duration: 3000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败',
          image: '/images/Error.png',
          duration: 3000
        })
      }
    }

  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})