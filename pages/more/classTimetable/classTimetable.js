const app = getApp();
let indexToCard = [];
let cardToIndex = [];
let timetableItems = [];
let classNo = '';
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
    customBarHeight: app.storage.getKey('customBarHeight'),
    courseTime: [],
    courseDetailIndex: 0,
  },
  bindSearchInput:function(e){
    classNo = e.detail.value;
  },
  tapSearchButton:function(){
    if(classNo){
      app.api.request({
        url: `v3/classTimetable/${classNo}`,
        data: {
        },
        callBack: data => {
          if (data) {
            this.handleData(data);
          }
        },
      });
    }
  },
  preventTouchMove: function () {},

  closeCourseDetailModal: function () {
    this.setData({
      showcourseDetailModal: false,
      courseDetailIndex: 0,
    });
  },
  handleData: function (data) {
    timetableItems = data;
    this.handleMoreData(data);
    this.setData({
      timetableItems: timetableItems,
    });
  },
  handleMoreData: function (data) {
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
  onLoad: function (options) {
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
    // if (options.timetable) {
    //   wx.showToast({
    //     title: '好友的课表',
    //     mask: true,
    //     image: '/images/Happy.png',
    //     duration: 1500,
    //   });
    //   this.handleData(JSON.parse(options.timetable));
    // }
  },
});
