const app = getApp();
let semesterItems = [];
let semesterItemIndex = 0;
Page({
  data: {
    gradeItems: [],
    headerNames: ['课程名', '学分', '绩点', '成绩'],
    floatButtonClickCount: 0,
    postion: ['bottomRight', 'bottomLeft'],
    yearNames: ['大一', '大二', '大三', '大四'],
    semesterNames: ['上学期', '下学期'],
    // 学年下标
    yearIndex: 0,
    // 学期下标
    semesterIndex: 0,
    showExportModal: false,
  },
  onYearClick(e) {
    this.setData({
      yearIndex: e.currentTarget.dataset.index,
    });
    this.updateSemesterItemIndex();
  },
  onSemesterIndexClick(e) {
    this.setData({
      semesterIndex: e.currentTarget.dataset.index,
    });
    this.updateSemesterItemIndex();
  },
  updateSemesterItemIndex() {
    semesterItemIndex = this.data.yearIndex * 2 + this.data.semesterIndex;
    this.setData({
      gradeItems:
        semesterItemIndex + 1 > semesterItems.length
          ? []
          : semesterItems[semesterItemIndex],
    });
  },
  onFloatButtonClick(e) {
    if (e.detail.index === 0) {
      this.getGrade();
    } else if (e.detail.index === 1) {
      this.getGradeAsync();
    } else if (e.detail.index === 3) {
      this.setData({
        floatButtonClickCount: this.data.floatButtonClickCount + 1,
      });
    } else if (e.detail.index === 4) {
      this.setData({
        showExportModal: true,
      });
    }
  },
  openGradePointPDF: function () {
    wx.downloadFile({
      url: 'https://dreace.top/GPA.pdf',
      success: function (res) {
        var filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
        });
      },
    });
  },
  preventTouchMove: function () {},
  handleData: function (data) {
    semesterItems = data;
    this.setData({
      visible: false,
      yearIndex: Math.ceil(data.length / 2 - 1),
      semesterIndex: 1 - (data.length % 2),
      gradeItems: data[data.length - 1],
    });
    if (app.storage.getKey('name') !== 'guest') {
      app.storage.setKey('gradeCache', data);
    }
  },
  
  onLoad: function (options) {
    if (options.grade) {
      wx.showToast({
        title: '好友的成绩',
        mask: true,
        image: '/images/Happy.png',
        duration: 1500,
      });
      this.handleData(JSON.parse(options.grade));
    }
  },
});
