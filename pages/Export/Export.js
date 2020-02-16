// pages/Export/Export.js
const API = require("../../utils/API.js")
import {
  $wuxCalendar
} from '../../dist/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    table: undefined,
    termsIndex: 0,
    terms: undefined,
    value: [],
    // value: [new Date().toLocaleDateString().replace(/\//g, '-')],
    isFirst: true,
    tableURL: undefined,
    text: "",
    show: false,
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
  tap: function() {
    wx.setClipboardData({
      data: this.data.tableURL,
    })
  },
  exportTable: function() {
    var app = getApp()
    var that = this
    var table = that.data.table
    var adata = app.globalData.additionalData
    if (adata != undefined && adata.length > 0) {
      table = table.concat(adata)
    }
    API.newAPI({
      url: "ToiCal",
      method: "POST",
      data: {
        data: table,
        firtMonday: this.data.value[0],
      },
      callBack: (data) => {
        that.setData({
          show: true,
          tableURL: data.url
        })
        wx.setClipboardData({
          data: data.url,
        })
      }
    })
  },
  onLoad: function(e) {
    this.setData({
      table: JSON.parse(e.table),
    })
  }
})