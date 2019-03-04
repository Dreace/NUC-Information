// pages/Add/Add.js
const isTel = (value) => !/^1[34578]\d{9}$/.test(value)

Page({
  data: {
    error0: true,
    error1: true,
    error2: true,
    error3: true,
    error4: true,
    value0: undefined,
    value1: undefined,
    value2: undefined,
    value3: undefined,
    values: [],
    term: undefined
  },
  add: function() {
    console.log(this.data.values)
    var map = {
      "Course_Number": this.data.values[1],
      "Course_Name": this.data.values[0],
      "Course_Credit": this.data.values[3],
      "Course_Attribute": this.data.values[4],
      "Course_Teacher": this.data.values[2],
      "Course_Week": this.data.values[10] + "周上",
      "Course_Color": Math.floor(Math.random() * 21),
      "Course_Time": this.data.values[5],
      "Course_Start": this.data.values[6],
      "Course_Length": this.data.values[7],
      "Course_Building": this.data.values[8],
      "Course_Classroom": this.data.values[9],
      "Additional": true
    }
    var app = getApp()
    if (app.globalData.additionalData[this.data.term] == undefined) {
      app.globalData.additionalData[this.data.term] = []
    }
    app.globalData.additionalData[this.data.term].push(map)
    wx.setStorageSync("additionalData", app.globalData.additionalData)
    wx.navigateBack({

    })
  },
  onChange(e) {
    this.data.values[parseInt(e.currentTarget.dataset.index)] = e.detail.value
  },
  onChange0(e) {
    this.setData({
      error0: e.detail.value.length < 1,
      value0: e.detail.value,
    })
    this.data.values[0] = e.detail.value
  },
  onChange1(e) {
    this.setData({
      error1: e.detail.value > 7 || e.detail.value < 1,
      value1: e.detail.value
    })
    this.data.values[5] = e.detail.value
  },
  onChange2(e) {
    this.setData({
      error2: e.detail.value > 11 || e.detail.value < 1,
      value2: e.detail.value
    })
    this.data.values[6] = e.detail.value
  },
  onChange3(e) {
    this.setData({
      error3: parseInt(e.detail.value) + parseInt(this.data.value2) > 11,
      value3: e.detail.value
    })
    this.data.values[7] = e.detail.value
  },
  onChange4(e) {
    let flag = false
    for (let x of e.detail.value) {
      let m = parseInt(x)
      console.log(x, m)
      if (isNaN(m) && (x !== ',' && x !== '-')) {
        flag = true
      }
    }
    for (let x of e.detail.value.split(",")) {
      if (x.indexOf("-") == -1) {
        if (isNaN(parseInt(x))) {
          flag = true
        }
      } else {
        var t = x.split("-")
        if (isNaN(parseInt(t[0])) || isNaN(parseInt(t[1]))) {
          flag = true
        }
      }
    }
    if (e.detail.value == "") {
      flag = true
    }
    this.setData({
      error4: flag
    })
    this.data.values[10] = e.detail.value
  },
  onError(e) {
    wx.showModal({
      title: e.currentTarget.dataset.message,
      showCancel: !1,
    })
  },
  onLoad: function(e) {
    let values = []
    for (let i = 0; i <= 10; i++) {
      values[i] = ""
    }
    this.setData({
      values: values,
      term: e.term
    })
  }
})