const app = getApp();

function generArr(n) {
  return Array(...Array(n)).map((v, i) => i);
}

let nums = generArr(17);
nums.shift();
const buildsName = nums.map(item => {
  return item + '号楼';
});
buildsName.push('旧1号楼');

let weekNums = generArr(21);
weekNums.shift();
const weeks = weekNums.map(item => {
  return `第${item}周`;
});

const weekdayNum = [
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期天',
];

let clsNum = generArr(12);
clsNum.shift();
const clsNums = clsNum.map(item => {
  return `第${item}节`;
});

Component({
  data: {
    list: [],
    multiArray: [buildsName, weeks, weekdayNum, clsNums],
    multiIndex: [10, 9, 2, 2],
  },
  methods: {
    pad(num, n) {
      var len = num.toString().length;
      while (len < n) {
        num = '0' + num;
        len++;
      }
      return num;
    },
    onLoad() {
      const now = new Date();
      let dayOfWeek = new Date().getDay();
      if (dayOfWeek == 0) {
        dayOfWeek = 7;
      }
      const multiIndex = [
        10,
        Math.floor(
          (now.getTime() -
            new Date(app.storage.getKey('firstWeekDateTime')).getTime()) /
          (24 * 3600 * 1000 * 7)
        ),
        dayOfWeek - 1,
        0,
      ];
      // 新学期没有开始时计算的周数是负值
      if (multiIndex[1] < 0) {
        multiIndex[1] = 0;
      }
      this.setData({
        multiIndex,
      });
      for (let i = 0; i < 4; i++) {
        multiIndex[i] += 1;
      }
      this.queryRoom(...multiIndex);
    },
    onMultiChange(e) {
      this.setData({
        multiIndex: e.detail.value,
      });
      this.queryRoom(
        this.pad(e.detail.value[0] + 1, 2),
        e.detail.value[1] + 1,
        e.detail.value[2] + 1,
        e.detail.value[3] + 1
      );
    },
    queryRoom(id, week, day, cls) {
      if (id === 17) {
        id = 'J01';
      }
      app.api.request({
        url: `v3/emptyClassroom/${id}/${week}/${day}/${cls}`,
        data: {},
        callBack: data => {
          if (data.length === 0) {
            wx.showToast({
              title: '没有空教室啦',
              image: '/images/Sad.png',
              mask: true,
            });
          }
          this.setData({
            list: data.sort((a, b) => {
              if (a.roomId > b.roomId) {
                return 1;
              } else {
                return -1;
              }
            }),
          });
        },
      });
    },
  },
});
