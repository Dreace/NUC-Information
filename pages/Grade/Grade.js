 // pages/Grade/Grade.js
 const API = require("../../utils/API.js")
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
     showed: false,
     termName: ["大一", "大二", "大三", "大四"],
     termName_: ["上学期", "下学期"],
     termIndex: 0,
     termIndex_: 0,
     visible: false
   },
   onTermClick(e) {
     // console.log(e.currentTarget.dataset.index)

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
         datas: this.data.tables[termsIndex]["grade"],
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
         datas: this.data.tables[termsIndex]["grade"],
         termIndex_: e.currentTarget.dataset.index
       })
     }
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
   copy: function(e) {
     wx.showLoading({
       title: '加载中',
     })
     wx.downloadFile({
       url: 'https://dreace.top/GPA.pdf',
       success: function(res) {
         var filePath = res.tempFilePath
         wx.openDocument({
           filePath: filePath,
           success: function(res) {
             wx.hideLoading()
           }
         })
       }
     })
   },
   refresh: function() {
     this.getGrade()
   },
   preventTouchMove: function() {},
   showModel: function(e) {
     this.setData({
       isShowModel: true,
       ModelContent: e.ModelContent
     })
   },
   handleData: function(e) {
     var data = e.data
     var that = this
     var count
     var terms = []
     for (var i = 0; i < data.length; i++) {
       terms.push(data[i]["name"])
     }
     var count = terms.length
     var app = getApp()
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
       datas: that.data.tables[termsIndex]["grade"],
       gradeRawData: data
     })
     wx.setStorageSync("gradeRawData", data)
   },
   getGrade: function(e) {
     if (this.data.loading) {
       var that = this;
       this.setData({
         tips: "数据加载中，请勿操作",
         showTopTips: true
       });
       setTimeout(function() {
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
         success: function(res) {
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
   getGradeWithoutVcode: function() {
     var check = require("../../utils/check_request_time.js")
     if (!check.check()) {
       return
     }
     var that = this
     if (!(this.data.name === "" || this.data.passwd === "")) {
       API.newAPI({
         url: "GetGrade",
         data: {
           name: this.data.name,
           passwd: this.data.passwd
         },
         callBack: (data) => {
           if (data) {
             this.handleData({
               data: data
             })
           }
         }
       })
       //  API.getData("grade", {
       //    "name": this.data.name,
       //    "passwd": this.data.passwd
       //  }, (data) => {
       //    if (data) {
       //      this.handleData({
       //        data: data
       //      })
       //    }
       //  })
     }
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
     var app = getApp()
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
   onShareAppMessage: function(e) {
     var that = this
     let termsIndex = that.data.termIndex * 2 + that.data.termIndex_
     return {
       title: '我的成绩-' + that.data.terms[termsIndex],
       path: 'pages/Grade/Grade?gradeRawData=' + JSON.stringify({
         "term": that.data.terms[termsIndex],
         "table": that.data.tables[termsIndex]["grade"]
       }),
     }

   }
 })