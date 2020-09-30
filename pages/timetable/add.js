// pages/Add/Add.js
const app = getApp();
let timetableId = -1;
Page({
  data: {
    values: {},
  },
  showMessage(message) {
    wx.showModal({
      title: '无法保存',
      content: message,
      showCancel: false,
    });
  },
  formSubmit(e) {
    const data = e.detail.value;
    if (!data.name) {
      this.showMessage('课程名不能为空');
      return;
    }
    if (!data.weeks) {
      this.showMessage('周次不能为空');
      return;
    }
    // 验证周次格式
    for (let x of data.weeks.split(',')) {
      // 只有一个周次
      if (x.indexOf('-') == -1) {
        if (isNaN(x)) {
          this.showMessage('周次格式有误');
          return;
        }
      } else {
        // 范围周次
        const splited = x.split('-');
        if (
          splited.length != 2 ||
          !splited[0] ||
          isNaN(splited[0]) ||
          !splited[1] ||
          isNaN(splited[1])
        ) {
          this.showMessage('周次格式有误');
          return;
        }
      }
    }
    if (
      !data.dayOfWeek ||
      isNaN(data.dayOfWeek) ||
      data.dayOfWeek > 7 ||
      data.dayOfWeek < 1
    ) {
      this.showMessage('星期只能为 1~7');
      return;
    }
    if (!data.start || data.start > 11 || data.start < 1) {
      this.showMessage('开始节次只能为 1~11');
      return;
    }
    if (data.length < 1) {
      this.showMessage('时长不能为空');
      return;
    }
    const end = Number.parseInt(data.start) + Number.parseInt(data.length);
    if (isNaN(end) || end > 12) {
      this.showMessage('结束节次不能大于 12');
      return;
    }
    data.start = Number.parseInt(data.start);
    data.length = Number.parseInt(data.length);
    data.custom = true;
    data.color = Math.floor(Math.random() * 21);
    data.weeks += '周';
    if (timetableId != -1) {
      app.storage.getKey('customTimetable')[timetableId] = data;
    } else {
      if (!(app.storage.getKey('customTimetable') instanceof Array)) {
        app.storage.setKey('customTimetable', []);
      }
      app.storage.getKey('customTimetable').push(data);
    }
    app.storage.save();
    app.eventBus.emit('updateTimeTable', true);
    wx.navigateBack({
      delta: 1,
    });
  },
  onLoad: function (options) {
    if (options.id) {
      timetableId = options.id;
      const timetableItem = app.storage.getKey('customTimetable')[options.id];
      timetableItem.weeks = timetableItem.weeks.replace('周', '');
      this.setData({
        values: timetableItem,
      });
    }
  },
});
