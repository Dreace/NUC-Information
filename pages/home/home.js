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
    balance: {
      balance: '---.--',
      time: '-- --:-- 暂时不可查',
    },
    title: '',
    animation: null,
    timer: null,
    duration: 0,
    textWidth: 0,
    wrapWidth: 0,
    date: null,
    weekday: null,
    cardCur: 0,
    toggleDelay: false,
    content: null,
    swiperList: [{}],
    homeList: [
      {
        name: '中北指南',
        icon:
          'https://cdn.jsdelivr.net/gh/dreace/NUC-Info-Static@master/svg/navigate.svg',
        url: '/pages/more/guide/guide',
      },
      {
        name: '校园导览',
        icon:
          'https://cdn.jsdelivr.net/gh/dreace/NUC-Info-Static@master/svg/navgation-map.svg',
        url: '/pages/more/map/map',
      },

      {
        name: '我的成绩',
        icon:
          'https://cdn.jsdelivr.net/gh/dreace/NUC-Info-Static@master/svg/grade.svg',
        url: '/pages/more/grade/grade',
      },
      {
        name: '查询考试',
        icon:
          'https://cdn.jsdelivr.net/gh/dreace/NUC-Info-Static@master/svg/search.svg',
        url: '/pages/more/exam/exam',
      },
    ],
    holiday: null,
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

      this.getBalance();
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
        url: 'v3/weather',
        data: {},
        callBack: data => {
          let notice = null;
          if (data.notice) {
            notice = data.notice;
          } else {
            const weather = data.weather.lives[0];
            notice = {
              title: `现在中北大学${weather.weather}，气温${weather.temperature}度，${weather.winddirection}风${weather.windpower}级，湿度${weather.humidity}%`,
            };
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
    getBalance() {
      if (app.storage.getKey('name')) {
        app.api.request({
          dontShowLoading: true,
          rawData: true,
          url: `v3/balance/${app.storage.getKey('name')}`,
          data: {},
          callBack: data => {
            if (data.code === 0) {
              this.setData({
                balance: data.data,
              });
            }
          },
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
        that.setData(
          {
            wrapWidth: rect[0].width,
            textWidth: rect[1].width,
          },
          () => {
            this.startAnimation();
          }
        );
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
    },
  },
});
