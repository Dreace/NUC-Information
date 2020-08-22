const app = getApp();
let timetableItems = [];
let indexToCard = [];
let cardToIndex = [];
const buttons = [
  {
    label: '刷新',
    icon: '/images/Refresh.png',
  },
  {
    label: '添加',
    icon: '/images/Add.png',
  },
  {
    openType: 'share',
    label: '分享',
    icon: '/images/Share.png',
  },
  {
    label: '切换按钮位置',
    icon: '/images/Switch.png',
  },
  {
    label: '导出课程表',
    icon: '/images/Export.png',
  },
];
Page({
  data: {
    colorArrays: [
      '#99CCFF',
      '#FFCC99',
      '#FFCCCC',
      '#CC6699',
      '#99CCCC',
      '#FF6666',
      '#CCCC66',
      '#66CC99',
      '#FF9966',
      '#66CCCC',
      '#6699CC',
      '#99CC99',
      '#669966',
      '#99CC99',
      '#99CCCC',
      '#66CCFF',
      '#CCCCFF',
      '#99CC66',
      '#CCCC99',
      '#FF9999',
    ],
    isScheduled: undefined,
    // 可以被选择的周数
    weekOfYear: 0,
    // 当前是第几周（真实值）
    weekNow: 0,
    buttons,
    dayOfWeek: undefined,
    p: 0,
    postion: ['bottomRight', 'bottomLeft'],
    title: '▼',
    courseTime: [],
    monthNow: 0,
    dateList: [],
    showPicker: false,
    pickerData: [],
  },

  onFloatButtonClick(e) {
    if (e.detail.index === 0) {
      this.getTimetable();
    } else if (e.detail.index === 4) {
      this.exportTimetable();
    } else if (e.detail.index === 3) {
      this.setData({
        p: this.data.p + 1,
      });
    } else if (e.detail.index === 1) {
      wx.navigateTo({
        url: 'add',
      });
    }
  },
  preventTouchMove: function () {},
  goToPage: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    });
  },
  dontShowLatestNotice: function () {
    app.storage.setKey('dontShowLatestNotice', true);
    this.closeNoticeModal();
  },
  closeNoticeModal: function () {
    this.setData({
      showNoticeModal: false,
    });
  },
  closeCourseDetailModal: function () {
    this.setData({
      showcourseDetailModal: false,
      courseDetailIndex: 0,
    });
  },
  deleteCustomCourse: function (e) {
    // Todo 删除自定义课程
    wx.showModal({
      title: '删除',
      content: '确认删除这个课程，删除后不可恢复',
      success: res => {
        if (res.confirm) {
          app.storage
            .getKey('customTimetable')
            .splice(
              this.data.courseDetailItems[e.currentTarget.dataset['index']] -
                timetableItems.length,
              1
            );
        }
        app.storage.save();
        this.handleData(timetableItems);
      },
    });
    this.closeCourseDetailModal();
  },
  editCustomCourse: function (e) {
    wx.navigateTo({
      url:
        'add?id=' +
        (this.data.courseDetailItems[e.currentTarget.dataset['index']] -
          timetableItems.length),
    });
    this.closeCourseDetailModal();
  },
  exportTimetable: function () {
    let data = timetableItems;
    if (app.storage.setKey('customTimetable')) {
      data = data.concat(app.storage.setKey('customTimetable'));
    }
    app.api.request({
      url: 'v3/timetable/export',
      method: 'POST',
      data: {
        timetable: data,
        firstWeekDateTime: app.storage.getKey('firstWeekDateTime'),
      },
      callBack: res => {
        wx.setClipboardData({
          data: res.url,
        });
        wx.showModal({
          title: '导出成功',
          content: 'iCal 文件链接已复制到剪贴板',
          confirmText: '好的',
          confirmColor: '#79bd9a',
          showCancel: false,
        });
      },
    });
  },
  handleData: function (data) {
    timetableItems = data;
    // 星期几
    let dayOfWeek = new Date().getDay();
    if (dayOfWeek == 0) {
      dayOfWeek = 7;
    }
    this.setData({
      dayOfWeek: dayOfWeek,
    });
    // 自定义课程
    if (app.storage.getKey('customTimetable')) {
      data = data.concat(app.storage.getKey('customTimetable'));
    }
    this.handleMoreData(data);
    this.setData({
      timetableItems: data,
    });
  },
  pickerSure: function (event) {
    let data = timetableItems;
    if (app.storage.getKey('customTimetable')) {
      data = data.concat(app.storage.getKey('customTimetable'));
    }
    this.handleMoreData(data, event.detail.choosedIndexArr[0] + 1);
    this.setData({
      showPicker: false,
      timetableItems: data,
    });
  },
  pickerCancel: function () {
    this.setData({
      title: '第' + this.data.weekNow + '周▼',
      showPicker: false,
    });
  },
  changeWeek: function () {
    const weekList = [];
    for (let i = 0; i < 35; i++) {
      weekList[i] = '第' + (i + 1) + '周';
    }
    weekList[this.data.weekNow - 1] += '（本周）';
    this.setData({
      title: '第' + this.data.weekOfYear + '周▲',
      pickerData: [weekList],
      showPicker: true,
    });
  },
  handleMoreData: function (data, week) {
    // 课程卡片到下标的映射
    cardToIndex = [];
    // 下标到课程卡片的映射
    indexToCard = [];
    for (let i = 0; i < 8; i++) {
      cardToIndex[i] = [];
      for (let j = 0; j < 12; j++) {
        cardToIndex[i][j] = [];
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (!data[i]['weeks']) {
        continue;
      }
      indexToCard[i] = [];
      // 一节课可能是多个小节组成
      for (
        let j = data[i]['start'];
        j < data[i]['length'] + data[i]['start'];
        j++
      ) {
        indexToCard[i].push({
          x: Number(data[i]['dayOfWeek']),
          y: j,
        });
        cardToIndex[Number(data[i]['dayOfWeek'])][j].push(i);
      }
    }
    if (app.storage.getKey('firstWeekDateTime')) {
      // 一年的第几周
      let weekOfYear;
      // 用户选择的周数
      if (week) {
        weekOfYear = week;
        // 计算当前周数
      } else {
        weekOfYear =
          Math.floor(
            (new Date().getTime() -
              new Date(app.storage.getKey('firstWeekDateTime')).getTime()) /
              (24 * 3600 * 1000 * 7)
          ) + 1;
        this.setData({
          weekOfYear: weekOfYear,
          weekNow: weekOfYear,
        });
      }
      this.setData({
        title: '第' + weekOfYear + '周▼',
      });
      // 开学第一周的周一
      const firstWeekDateTime = new Date(
        app.storage.getKey('firstWeekDateTime')
      );
      // 当前日期
      const dateTimeNow = new Date(app.storage.getKey('firstWeekDateTime'));
      dateTimeNow.setDate(dateTimeNow.getDate() + (weekOfYear - 1) * 7);
      const monthNow = dateTimeNow.getMonth() + 1;
      // 一周七天的日期日期
      const dateList = [];
      dateTimeNow.setDate(dateTimeNow.getDate() - 1);
      for (let i = 0; i < 7; i++) {
        dateTimeNow.setDate(dateTimeNow.getDate() + 1);
        dateList[i] = dateTimeNow.getDate() + '日';
      }
      this.setData({
        monthNow: monthNow,
        dateList: dateList,
      });
      // 当前选择的周上课情况，根据下标对应
      var isScheduled = [];
      for (let i = 0; i < data.length; i++) {
        if (!data[i]['weeks']) {
          continue;
        }
        let t = this.handleWeek(data[i]['weeks']);
        if (t.indexOf(weekOfYear) != -1) {
          isScheduled[i] = true;
        } else {
          isScheduled[i] = false;
        }
      }
      this.setData({
        isScheduled: isScheduled,
      });
    }
  },
  handleWeek: function (weeksStr) {
    // 单双周
    const isEvenWeek = weeksStr.indexOf('双') != -1;
    const isOddWeek = weeksStr.indexOf('单') != -1;
    const tempList = this.removeChinese(weeksStr).split(',');
    const weeks = [];
    tempList.forEach(item => {
      // 形如：1-9
      if (item.indexOf('-') != -1) {
        const splited = item.split('-');
        for (let j = Number(splited[0]); j <= splited[1]; j++) {
          // 双周课，但是当前是单周，跳过
          if (isEvenWeek && j % 2 == 1) {
            continue;
          }
          if (isOddWeek && j % 2 == 0) {
            continue;
          }
          weeks.push(j);
        }
      } else {
        weeks.push(Number(item));
      }
    });
    return weeks;
  },
  removeChinese: function (str) {
    if (str) {
      var reg = /[\u4e00-\u9fa5\(\)（）]/g;
      return str.replace(reg, '');
    } else {
      return '';
    }
  },
  getTimetable: function () {
    if (!app.storage.getKey('name')) {
      wx.showModal({
        title: '未登录',
        content: '跳转到登录页面，或者以游客身份浏览',
        cancelText: '游客',
        cancelColor: '#03a6ff',
        confirmText: '去登陆',
        confirmColor: '#79bd9a',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/my/login/login',
            });
          } else {
            app.storage.setKey('name', 'guest');
            app.storage.setKey('password', 'guest');
            this.getTimetable();
          }
        },
      });
      return;
    }
    app.api.request({
      url: 'v3/timetable',
      data: {
        name: app.storage.getKey('name'),
        passwd: app.storage.getKey('password'),
      },
      callBack: data => {
        if (data) {
          this.handleData(data);
          if (app.storage.getKey('name') !== 'guest') {
            app.storage.setKey('timetableCache', data);
          }
        }
      },
    });
  },
  showCourseDetail: function (e) {
    let courseDetailItems = [];
    const card = indexToCard[e.currentTarget.dataset.index];
    for (let i = 0; i < card.length; i++) {
      // 根据课程卡片查找对应下标
      courseDetailItems = courseDetailItems.concat(
        cardToIndex[card[i]['x']][card[i]['y']]
      );
    }
    if (courseDetailItems.length) {
      this.setData({
        courseDetailItems: Array.from(new Set(courseDetailItems)),
        showcourseDetailModal: true,
        // swiper 复位
        courseDetailIndex: 0,
      });
    }
  },
  closeNotictModal() {
    this.setData({
      showNoticeModal: false,
    });
  },
  onLoad: function () {
    app.api.request({
      dontShowLoading: true,
      url: 'v3/notices/latest',
      data: {},
      callBack: data => {
        if (data) {
          this.setData({
            notice: data,
          });
          // 重要公告
          if (data.isImportant) {
            this.setData({
              showNoticeModal: true,
            });
            // 普通公告
          } else if (
            !app.storage.getKey('dontShowLatestNotice') &&
            app.storage.getKey('lastShowNoticeID') < data.id
          ) {
            app.storage.setKey('lastShowNoticeID', data.id);
            wx.showModal({
              title: '有新公告',
              content: data.title,
              cancelText: '不再提醒',
              cancelColor: '#03a6ff',
              confirmText: '去看看',
              confirmColor: '#79bd9a',
              success: res => {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/more/notice/detail?id=' + data.id,
                  });
                } else if (res.cancel) {
                  // 不再显示最新公告
                  app.storage.setKey('dontShowLatestNotice', true);
                }
              },
            });
          }
        }
      },
    });

    app.eventBus.on('updateTimeTable', this, useCache => {
      if (useCache) {
        this.handleData(timetableItems);
      } else {
        this.getTimetable();
      }
    });
    // 冬季、夏季作息时间不同
    const month = new Date().getMonth() + 1;
    if (month < 5 || month > 9) {
      this.setData({
        courseTime: [
          '8:00',
          '8:55',
          '10:10',
          '11:05',
          '14:00',
          '14:55',
          '16:10',
          '17:05',
          '19:00',
          '19:55',
          '20:50',
        ],
      });
    } else {
      this.setData({
        courseTime: [
          '8:00',
          '8:55',
          '10:10',
          '11:05',
          '14:30',
          '15:25',
          '16:40',
          '17:35',
          '19:30',
          '20:25',
          '21:20',
        ],
      });
    }
    // 加载缓存
    if (app.storage.getKey('timetableCache')) {
      this.handleData(app.storage.getKey('timetableCache'));
    } else {
      this.getTimetable();
    }
  },
  onUnload: function () {
    app.eventBus.off('updateTimeTable', this);
  },
  onShareAppMessage: function () {
    return {
      title: '我的课程表',
      path:
        'pages/timetable/friend?timetable=' +
        JSON.stringify(this.data.timetableItems),
    };
  },
});
