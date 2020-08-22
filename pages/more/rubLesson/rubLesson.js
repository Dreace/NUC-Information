// pages/MoreCourse/MoreCourse.js
const app = getApp();
const pinyinUtil = app.require('utils/pinyinUtil.js');
let keyword = '';
let items = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    Week: ['一', '二', '三', '四', '五', '六', '日'],
    customBarHeight: app.storage.getKey('customBarHeight'),
    hidden: true,
    list: [],
    listCur: 0,
    showDetailModal: false,
  },
  addCustomCourse: function () {
    const course = this.data.detail;
    course.start = Number.parseInt(course.start);
    course.length = Number.parseInt(course.length);
    course.custom = true;
    course.color = Math.floor(Math.random() * 21);
    if (!(app.storage.getKey('customTimetable') instanceof Array)) {
      app.storage.setKey('customTimetable', []);
    }
    app.storage.getKey('customTimetable').push(course);
    app.storage.save();
    app.eventBus.emit('updateTimeTable', true);
    this.closeDetailModal();
    wx.showToast({
      title: '已添加到课程表',
      icon: 'success',
      duration: 1000,
      mask: true,
    });
  },
  closeDetailModal: function () {
    this.setData({
      showDetailModal: false,
    });
  },
  showDetail: function (e) {
    this.setData({
      detail: items[e.currentTarget.dataset.id - 1],
      showDetailModal: true,
    });
  },
  search() {
    if (!keyword) {
      return;
    }
    app.api.request({
      url: 'v3/course',
      data: {
        keywords: keyword,
      },
      callBack: data => {
        wx.showLoading({
          mask: true,
          title: '处理中',
        });
        const alphabet = [];
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(initial => {
          // 拼音首字母列表
          const cells = data.filter(
            course =>
              pinyinUtil.pinyinUtil.getFirstLetter(course['name']).charAt(0) ==
              initial
          );
          if (cells.length > 0) {
            alphabet.push({
              initial,
              cells,
            });
          }
        });
        this.setData({
          list: alphabet,
          listCur: alphabet[0] ? alphabet[0] : 0,
        });
        items = data;
        setTimeout(wx.hideLoading, 1000);
      },
    });
  },
  onKeywordChange: function (e) {
    keyword = e.detail.value;
  },

  // 以下代码来自 Color UI
  //获取文字信息
  getCur(e) {
    this.setData({
      hidden: false,
      listCur: this.data.list[e.target.id],
    });
  },
  setCur(e) {
    this.setData({
      hidden: true,
      listCur: this.data.listCur,
    });
  },
  //滑动选择Item
  tMove(e) {
    let y = e.touches[0].clientY,
      offsettop = this.data.boxTop,
      that = this;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      let num = parseInt((y - offsettop) / 20);
      this.setData({
        listCur: that.data.list[num],
      });
    }
  },

  //触发全部开始选择
  tStart() {
    this.setData({
      hidden: false,
    });
  },

  //触发结束选择
  tEnd() {
    this.setData({
      hidden: true,
      listCurID: this.data.listCur,
    });
  },
  indexSelect(e) {
    let that = this;
    let barHeight = this.data.barHeight;
    let list = this.data.list;
    let scrollY = Math.ceil((list.length * e.detail.y) / barHeight);
    for (let i = 0; i < list.length; i++) {
      if (scrollY < i + 1) {
        that.setData({
          listCur: list[i],
          movableY: i * 20,
        });
        return false;
      }
    }
  },
});
