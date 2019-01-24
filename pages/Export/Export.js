// pages/Export/Export.js
import {
  $wuxCalendar
} from '../../dist/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tables: undefined,
    termsIndex: 0,
    terms: undefined,
    value: [],
   // value: [new Date().toLocaleDateString().replace(/\//g, '-')],
    isFirst: true,
    tableURL:undefined,
    text:"",
    show:false,
  },
  openCalendar() {
    console.log(this.data.value)
    $wuxCalendar().open({
      value: this.data.isFirst ? [] : this.data.value,
      onChange: (values, displayValues) => {
        if (displayValues.length > 0) {
          this.setData({
            value: displayValues,
            isFirst: false
          })
        }
      },
    })
  },
  tap:function(){
    wx.setClipboardData({
      data: this.data.tableURL,
    })
  },
  exportTable:function(){
    var app = getApp()
    var that = this
    wx.showToast({
      title: '处理中',
      mask: true,
      icon: 'loading',
      duration: 60000
    })
    wx.request({
      url: 'https://cdn.dreace.top/ical',
      data: {
        data: JSON.stringify(this.data.tables[this.data.tables.length - 1 - this.data.termsIndex][2]),
        firtMonday:this.data.value,
      },
      method:'POST',
      success: function (res) {
        that.setData({
          show:true,
          tableURL:res.data
        })
        wx.hideToast()
        wx.setClipboardData({
          data: that.data.tableURL,
        })
      },
      fail: function (e) {
        wx.showToast({
          title: '未能完成请求',
          image: '/images/Error.png',
          duration: 3000
        })
        console.log(e)
      },
    })
  },
  bindTermChange: function(e) {
    this.setData({
      termsIndex: e.detail.value
    })
  },
  onLoad: function(e) {
    this.setData({
      tables: JSON.parse(e.tables),
    })
    var terms = []
    for (var i = this.data.tables[1]["count"] + 1; i > 1; i--) {
      terms.push(this.data.tables[i][1])
    }
    this.setData({
      terms: terms
    })
  }
})