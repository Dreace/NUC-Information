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
    tables: undefined,
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
    var table
    var adata = app.globalData.additionalData[this.data.termsIndex]
    if (adata != undefined && adata.length > 0) {
      table = that.data.tables[this.data.termsIndex]["table"].concat(adata)
    } else {
      table = that.data.tables[this.data.termsIndex]["table"]
    }
    API.getData("ical", {
      data: JSON.stringify(table),
      firtMonday: this.data.value,
    }, (data) => {
      that.setData({
        show: true,
        tableURL: data
      })
      wx.setClipboardData({
        data: data,
      })
    },"POST")
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
    for (var i = 0; i < this.data.tables.length; i++) {
      terms.push(this.data.tables[i]["name"])
    }
    this.setData({
      terms: terms,
      termsIndex:terms.length-1
    })
  }
})