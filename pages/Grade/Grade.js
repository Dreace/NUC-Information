 // pages/Grade/Grade.js
 const API = require("../../utils/API.js")
 const app = getApp()
 var usingMode2 = false
 const buttons = [{
     label: '刷新',
     icon: "/images/Refresh.png",
   },
   {
     label: '刷新（稍后通知）',
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
   },
   {
     label: '导出成绩',
     icon: "/images/Export.png",
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
     heads: ["课程名", "学分", "绩点", "成绩"],
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
     showed: false,
     termName: ["大一", "大二", "大三", "大四"],
     termName_: ["上学期", "下学期"],
     termIndex: 0,
     termIndex_: 0,
     visible: false,
     showExportModal: false,
   },
   closethis() {
     this.setData({
       showExportModal: false
     })
   },
   export (e) {
     API.newAPI({
       url: "v2/ExportGrade",
       data: {
         name: app.globalData.name,
         passwd: app.globalData.passwd,
         type: e.currentTarget.dataset.filetype
       },
       callBack: (data) => {
         if (data) {
           this.setData({
             showExportModal: false
           })
           wx.setClipboardData({
             data: data["url"],
           })
           wx.showModal({
             title: '导出成功',
             content: '文件链接复制到剪贴板，可粘贴到浏览器中下载',
             confirmText: "好的",
             confirmColor: "#79bd9a",
             showCancel: false
           })
         }
       }
     })
   },
   onTermClick(e) {
     let termsIndex = e.currentTarget.dataset.index * 2 + this.data.termIndex_
     if (termsIndex + 1 > this.data.count) {
       this.setData({
         visible: true,
         datas: [],
         termIndex: e.currentTarget.dataset.index
       })
     } else {
       this.setData({
         visible: false,
         datas: this.data.tables[termsIndex],
         termIndex: e.currentTarget.dataset.index
       })
     }
   },
   onTermClick_(e) {
     // console.log(e.currentTarget.dataset.index)
     let termsIndex = this.data.termIndex * 2 + e.currentTarget.dataset.index
     if (termsIndex + 1 > this.data.count) {
       this.setData({
         visible: true,
         datas: [],
         termIndex_: e.currentTarget.dataset.index
       })
     } else {
       this.setData({
         visible: false,
         datas: this.data.tables[termsIndex],
         termIndex_: e.currentTarget.dataset.index
       })
     }
   },
   onClick(e) {
     if (e.detail.index === 0) {
       this.refresh()
     } else if (e.detail.index === 1) {
       this.refreshAsync()
     } else if (e.detail.index === 3) {
       this.setData({
         p: this.data.p + 1
       })
     } else if (e.detail.index === 4) {
       this.setData({
         showExportModal: true
       })
     }
   },
   refreshAsync: function () {
     if (!app.globalData.openId) {
       wx.showModal({
         title: '无法订阅',
         content: '还未获取到 OpenID，请稍后再试',
         showCancel: false
       })
       return
     }
     wx.requestSubscribeMessage({
       tmplIds: ['YsXoEvD-biQR20DUekLsnkOKW0A3Cg9QKNqRMkRP5AM'],
       success(res) {
         if (res['YsXoEvD-biQR20DUekLsnkOKW0A3Cg9QKNqRMkRP5AM'] === 'accept') {
           API.newAPI({
             url: "v2/GetGrade/Async",
             data: {
               name: app.globalData.name,
               passwd: app.globalData.passwd,
               openID: app.globalData.openId,
             },
             callBack: (data) => {
               wx.showToast({
                 title: '请稍后查看微信消息',
                 image: "/images/Happy.png",
                 mask: true,
               })
             }
           })
         }
       },
       fail(res) {
         wx.showToast({
           title: '你未授权订阅消息',
         })
       }
     })

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
   preventTouchMove: function () {},
   showModel: function (e) {
     this.setData({
       isShowModel: true,
       ModelContent: e.ModelContent
     })
   },
   handleData: function (e) {
     var data = e.data
     var that = this
     var count
     var terms = []
     for (var i = 0; i < data.length; i++) {
       terms.push(data[i]["name"])
     }
     var count = terms.length

     that.setData({
       terms: terms,
       count: count,
       tables: data
     })
     let termsIndex = count - 1
     that.setData({
       visible: false,
       termIndex: Math.ceil(count / 2 - 1),
       termIndex_: 1 - count % 2,
       datas: that.data.tables[termsIndex],
       gradeRawData: data
     })
     if (app.globalData.name != "guest") {
       wx.setStorageSync("gradeRawData", data)
     }
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
         title: '未登录',
         content: '跳转到登录页面，或者以游客身份浏览',
         cancelText: "游客",
         cancelColor: "#03a6ff",
         confirmText: "去登陆",
         confirmColor: "#79bd9a",
         success: function (res) {
           that.setData({
             showed: false
           })
           if (res.confirm) {
             wx.navigateTo({
               url: '/pages/Account/Account',
             })
           } else {
             app.globalData.name = "guest"
             app.globalData.passwd = "guest"
             that.getGrade()
           }
         }
       })
       return
     }
     this.getGradeWithoutVcode()
   },
   getGradeWithoutVcode: function () {
     var that = this
     if (!(app.globalData.name === "" || app.globalData.passwd === "")) {
       API.newAPI({
         url: "v2/GetGrade",
         data: {
           name: app.globalData.name,
           passwd: app.globalData.passwd
         },
         callBack: (data) => {
           if (data) {
             this.handleData({
               data: data
             })
           }
         }
       })
     }
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {

     var that = this
     app.eventBus.on("clearGrade", this, () => {
       that.setData({
         loading: false,
         name: "",
         passwd: "",
         count: 0,
         terms: [],
         termsIndex: 0,
         termIndex: 0,
         termIndex_: 0,
         grades: [],
         datas: [],
         gradeRawData: [],
       })
     })
     app.eventBus.on("updateGrade", this, () => {
       that.getGrade()
     })
     if (options.gradeRawData) {
       wx.navigateTo({
         url: 'GradeFriend/GradeFriend?gradeRawData=' + options.gradeRawData,
       })
     }
     if (options.grade) {
       app.globalData.gradeRawData = JSON.parse(options.grade)
       console.log(app.globalData.gradeRawData)
     } else {
       app.globalData.gradeRawData = wx.getStorageSync("gradeRawData")
     }
     if (app.globalData.gradeRawData) {
       this.handleData({
         data: app.globalData.gradeRawData
       })
     } else {
       this.getGrade()
     }
   },
   onUnload: function () {
     app.eventBus.off("clearGrade", this)
     app.eventBus.off("updateGrade", this)
   },
   onShareAppMessage: function (e) {
     var that = this
     let termsIndex = that.data.termIndex * 2 + that.data.termIndex_
     return {
       title: '我的成绩',
       path: 'pages/Grade/Grade?gradeRawData=' + JSON.stringify({
         "table": that.data.tables[termsIndex]
       }),
     }

   }
 })