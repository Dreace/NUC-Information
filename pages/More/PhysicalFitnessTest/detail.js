// pages/More/PhysicalFitnessTest/detail.js
const app = getApp()
const API = app.API
const that = this
Page({

  data: {
    datas: [],
    heads: ["项目", "成绩", "单位", "分数"]
  },
  onLoad: function(options) {
    let id = options.id
    let that = this
    this.setData({
      title: options.title
    })
    API.newAPI({
      url: "PhysicalFitnessTestGetScore",
      data: {
        id: id
      },
      callBack: (data) => {
        that.setData({
          datas: data
        })
      }
    })
  },
})