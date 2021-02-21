const app = getApp();
Component({
  data: {
    show: false,
    notice: {},
    svgCDN: 'https://cdn.jsdelivr.net/gh/dreace/NUC-Info-Static@master/svg/',
    holiday: {
      name: '----',
      days: '--',
    },
    courseTime: null,
    newsList: [],
    type: 0,
    nextClass: '今天没有课啦',
    nextClassRoom: '好好享受吧！',
    title: '',
    animation: null,
    timer: null,
    duration: 0,
    textWidth: 0,
    wrapWidth: 0,
    isScheduled: undefined,
    date: null,
    weekday: null,
    cardCur: 0,
    toggleDelay: false,
    content: null,
    swiperList: [{}],
    homeList: [{
        name: '中北指南',
        icon: 'https://cdn.jsdelivr.net/gh/dreace/NUC-Info-Static@master/svg/navigate.svg',
        url: '/pages/more/guide/guide',
      },
      {
        name: '校园导览',
        icon: 'https://cdn.jsdelivr.net/gh/dreace/NUC-Info-Static@master/svg/navgation-map.svg',
        url: '/pages/more/map/map',
      },

      {
        name: '我的成绩',
        icon: 'https://cdn.jsdelivr.net/gh/dreace/NUC-Info-Static@master/svg/grade.svg',
        url: '/pages/more/grade/grade',
      },
      {
        name: '查询考试',
        icon: 'https://cdn.jsdelivr.net/gh/dreace/NUC-Info-Static@master/svg/search.svg',
        url: '/pages/more/exam/exam',
      },
    ],
    holiday: null,
    weekNow: 0
  },
  methods: {
    onLoad(options) {
      this.getHolidayPadding();
      this.towerSwiper('swiperList');
      this.getSlides();
      this.getNews();
      this.getNotice();
      let nextClass = this.nextClass();
      this.setData({
        date: this.getDate('date'),
        weekday: this.getDate('weekday'),
        nextClass: nextClass[0],
        nextClassRoom: nextClass[1],
        type: options.type,
      });
      this.setData({
        show: true,
      });
      this.toggleDelay();
    },
    onShow() {
      this.initAnimation(this.data.notice.text);
    },
    getHomeList() {
      //待更新...
    },
    getSlides() {
      app.api.request({
        dontShowLoading: true,
        url: 'v3/slides',
        data: {},
        callBack: data => {
          this.setData({
            swiperList: data,
          });
        },
      });
    },
    getNotice() {
      app.api.request({
        dontShowLoading: true,
        url: 'v3/notices/latest',
        data: {},
        callBack: data => {
          let notice = null;
          if (data) {
            notice = data;
          }
          this.setData({
            notice,
          });
          this.initAnimation(notice.text);
        },
      });
    },
    toggleDelay() {
      var that = this;
      that.setData({
        toggleDelay: true,
      });
      setTimeout(function () {
        that.setData({
          toggleDelay: false,
        });
      }, 1000);
    },
    getHolidayPadding() {
      app.api.request({
        dontShowLoading: true,
        url: `v3/vacation`,
        data: {},
        callBack: data => {
          const days = Math.floor(
            (new Date(data.date).getTime() - new Date().getTime()) /
            (24 * 3600 * 1000)
          );
          this.setData({
            holiday: {
              name: data.name,
              days,
            },
          });
        },
      });
    },
    removeChinese: function (str) {
      if (str) {
        var reg = /[\u4e00-\u9fa5\(\)（）]/g;
        return str.replace(reg, '');
      } else {
        return '';
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
    handleMoreData: function (data, week) {
      // 课程卡片到下标的映射
      let cardToIndex = [];
      // 下标到课程卡片的映射
      let indexToCard = [];
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
          let j = data[i]['start']; j < data[i]['length'] + data[i]['start']; j++
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
        // 开学第一周的周一
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
    nextClass() {
      let time = new Date();
      let otime = new Date(new Date().toLocaleDateString()).getTime();
      let now = time.getTime();
      const month = time.getMonth() + 1;
      let nextClassOrder = null;
      if (!app.storage.getKey('timetableCache')) {
        wx.showToast({
          title: '需要登录',
          image: '/images/Sad.png',
          mask: true,
        });
        return ['快去登录吧', '否则我不知道呀'];
      } else {
        let classes = app.storage.getKey('timetableCache').filter(item => {
          return item.dayOfWeek == time.getDay();
        });
        let weekOfYear = Math.floor(
          (new Date().getTime() -
            new Date(app.storage.getKey('firstWeekDateTime')).getTime()) /
          (24 * 3600 * 1000 * 7)
        ) + 1;
        this.setData({
          weekNow: weekOfYear,
        });

        this.handleMoreData(classes, this.data.weekNow);
        this.data.isScheduled.forEach((i, j) => {
          if (i === false) {
            classes.splice(j, 1);
          }
        })

        let cTime = null;
        if (month < 5 || month > 9) {
          cTime = [
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
          ];
        } else {
          cTime = [
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
          ];
        }

        let courseTimeFun = () => {
          let courseTime = cTime.map(item => {
            let it = item.split(':');
            return it[0] * 60 * 60 * 1000 + it[1] * 60 * 1000 + otime;
          });
          return courseTime;
        };
        let courseTime = courseTimeFun();

        for (let i = 0; i < courseTime.length - 1; i++) {
          if (courseTime[i] <= now && now < courseTime[i + 1]) {
            nextClassOrder = i + 2;
            break;
          } else if (now < courseTime[0]) {
            nextClassOrder = 1;
            break;
          } else if (courseTime[courseTime.length - 1] < now) {
            nextClassOrder = 0;
          }
        }

        let next = classes.filter(item => {
          return item.start >= nextClassOrder;
        });
        if (next.length !== 0) {
          if (next.toString() !== classes.toString()) {
            return [next[0].name, '@' + next[0].building + next[0].classroom];
          } else {
            return ['今天已经没课啦', '好好休息吧~'];
          }
        } else {
          return ['今天已经没课啦', '好好休息吧~'];
        }
      }
    },
    getNews: function () {
      app.api.request({
        dontShowLoading: true,
        url: `v3/news/1014`,
        data: {
          page: 1,
        },
        callBack: data => {
          if (data) {
            this.setData({
              newsList: data.slice(0, 8),
            });
          }
        },
      });
    },
    nav: function (e) {
      if (e.currentTarget.dataset.url) {
        wx.navigateTo({
          url: e.currentTarget.dataset.url,
        });
      }
    },
    onHide() {
      this.destroyTimer();
      this.setData({
        timer: null,
        show: false,
      });
    },
    onUnload() {
      this.destroyTimer();
      this.setData({
        timer: null,
      });
    },
    destroyTimer() {
      if (this.data.timer) {
        clearTimeout(this.data.timer);
      }
    },
    /**
     * 开启公告字幕滚动动画
     * @param  {String} text 公告内容
     * @return {[type]}
     */
    initAnimation() {
      let that = this;
      this.data.duration = 8000;
      this.data.animation = wx.createAnimation({
        duration: this.data.duration,
        timingFunction: 'linear',
      });
      let query = wx.createSelectorQuery();
      query.select('.content-box').boundingClientRect();
      query.select('#text').boundingClientRect();
      query.exec(rect => {
        try {
          that.setData({
              wrapWidth: rect[0].width,
              textWidth: rect[1].width,
            },
            () => {
              this.startAnimation();
            }
          );
        } catch (error) {}
      });
    },
    // 定时器动画
    startAnimation() {
      //reset
      // this.data.animation.option.transition.duration = 0
      const resetAnimation = this.data.animation
        .translateX(this.data.wrapWidth / 3)
        .step({
          duration: 0,
        });
      this.setData({
        animationData: resetAnimation.export(),
      });
      // this.data.animation.option.transition.duration = this.data.duration
      const animationData = this.data.animation
        .translateX(-this.data.textWidth + (this.data.wrapWidth / 3) * 2)
        .step({
          duration: this.data.duration,
        });
      setTimeout(() => {
        this.setData({
          animationData: animationData.export(),
        });
      }, 100);
      const timer = setTimeout(() => {
        this.startAnimation();
      }, this.data.duration);
      this.setData({
        timer,
      });
    },
    getDate(type) {
      let date = new Date();
      let week = ['天', '一', '二', '三', '四', '五', '六'];
      switch (type) {
        case 'date':
          return `${date.getMonth() + 1}月${date.getDate()}日`;
        case 'weekday':
          return `星期${week[date.getDay()]}`;
      }
    },
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current,
      });
    },
    // 初始化towerSwiper
    towerSwiper(name) {
      let list = this.data[name];
      for (let i = 0; i < list.length; i++) {
        list[i].zIndex =
          parseInt(list.length / 2) +
          1 -
          Math.abs(i - parseInt(list.length / 2));
        list[i].mLeft = i - parseInt(list.length / 2);
      }
      this.setData({
        swiperList: list,
      });
    },
    onShareAppMessage: function () {
      return {
        title: '中北信息',
        path: 'pages/home/home',
        imageUrl: 'http://img.dreace.top/shareImage.jpg',
      };
    }
  },
});