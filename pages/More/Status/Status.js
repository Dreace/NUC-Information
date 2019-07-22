// pages/More/Status/Status.js
const API = require("../../../utils/API.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: undefined
  },

  checkServer:function(){
    var that = this
    API.getData2("status.json",(data)=>{
      that.setData({
        status: data
      })
    })
  },
  onUnload:function(){
    clearInterval(this.data.interval)
  },
  onHide:function(){
    clearInterval(this.data.interval)
  },
  onShow: function () {
    var that = this
    that.checkServer()
    var interval = setInterval(that.checkServer, 1000)
    that.setData({
      interval: interval
    })
  },

})