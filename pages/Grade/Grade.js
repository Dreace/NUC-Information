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
      wx.showToast({
        title: '系统错误',
        image: '/images/Error.png',
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
      this.getGradeWithoutVcode()
    } else {
      this.getGradeWithVcode({
        message: "自动识别关闭，请手动输入验证码"
      })
    }
  },
  getGradeWithVcode: function (e) {
    var that = this
    try {
      wx.showToast({
        title: '加载中',
        mask: true,
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
            mask: true,
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
  getGradeWithoutVcode: function () {
    var that = this
    if (!(this.data.name === "" || this.data.passwd === "")) {
      wx.showToast({
        title: '加载中',
        mask: true,
        icon: 'loading',
        duration: 10000
      })
      that.setData({
        loading: true
      })
      wx.request({
        url: 'https://cdn.dreace.top',
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
            mask: true,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app=getApp()
    app.globalData.name = wx.getStorageSync("name")
    app.globalData.passwd = wx.getStorageSync("passwd")
    app.globalData.autoVcode = wx.getStorageSync("autoVcode")
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
    return {
      title: '我的成绩',
      path: 'pages/Grade/Grade?gradeRawData='+JSON.stringify(this.data.gradeRawData),
      success: function (res) {
        wx.showToast({
          title: '已转发',
          mask: true,
          duration: 3000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败',
          mask: true,
          image: '/images/Error.png',
          duration: 3000
        })
      }
    }

  },
  onShow: function () {
    if (!wx.getStorageSync("newed")) {
      wx.showModal({
        title: '更新完成',
        content: '由于系统升级,请前往"我的"更新信息',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../pages/Setting/Setting',
            })
          }
        }
      })
    }
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.getGrade()
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  }
})