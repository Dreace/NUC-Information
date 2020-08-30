const app = getApp();
let semesterItems = [];
let semesterItemIndex = 0;
const buttons = [
  {
    label: '刷新',
    icon: '/images/Refresh.png',
  },
  {
    label: '刷新（稍后通知）',
    icon: '/images/Refresh.png',
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
    label: '导出成绩',
    icon: '/images/Export.png',
  },
];
Page({
  data: {
    gradeItems: [],
    headerNames: ['课程名', '学分', '绩点', '成绩'],
    buttons,
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
  goToPage: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    });
  },
  closeExportGrade() {
    this.setData({
      showExportModal: false,
    });
  },
  exportGrade(e) {
    app.api.request({
      url: 'v3/grade/export',
      data: {
        name: app.storage.getKey('name'),
        passwd: app.storage.getKey('password'),
        type: e.currentTarget.dataset.filetype,
      },
      callBack: data => {
        if (data) {
          this.setData({
            showExportModal: false,
          });
          wx.setClipboardData({
            data: data['url'],
          });
          wx.showModal({
            title: '导出成功',
            content: '文件链接复制到剪贴板，可粘贴到浏览器中下载',
            confirmText: '好的',
            confirmColor: '#79bd9a',
            showCancel: false,
          });
        }
      },
    });
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
  getGradeAsync: function () {
    if (!app.storage.getKey('openId')) {
      wx.showModal({
        title: '无法订阅',
        content: '还未获取到 OpenID，请稍后再试',
        showCancel: false,
      });
      return;
    }
    wx.requestSubscribeMessage({
      tmplIds: ['YsXoEvD-biQR20DUekLsnkOKW0A3Cg9QKNqRMkRP5AM'],
      success(res) {
        if (res['YsXoEvD-biQR20DUekLsnkOKW0A3Cg9QKNqRMkRP5AM'] === 'accept') {
          app.api.request({
            url: 'v3/grade/async',
            data: {
              name: app.storage.getKey('name'),
              passwd: app.storage.getKey('password'),
              openID: app.storage.getKey('openId'),
            },
            callBack: data => {
              wx.showToast({
                title: '请稍后查看微信消息',
                image: '/images/Happy.png',
                mask: true,
              });
            },
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: '你未授权订阅消息',
        });
      },
    });
  },
  openGradePointPDF: function (e) {
    wx.downloadFile({
      url:
        'https://cdn.jsdelivr.net/gh/dreace/NUC-Info-Static@master/PDF/GPA.pdf',
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
  getGrade: function () {
    // 没有设置账号显示一个提示，然后直接返回
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
            // 跳到账号列表
            wx.navigateTo({
              url: '/pages/my/login/login',
            });
          } else {
            // 显示测试数据
            app.storage.setKey('name', 'guest');
            app.storage.setKey('password', 'guest');
            this.getGrade();
          }
        },
      });
      return;
    }
    app.api.request({
      url: 'v3/grade',
      data: {
        name: app.storage.getKey('name'),
        passwd: app.storage.getKey('password'),
      },
      callBack: data => {
        if (data) {
          this.handleData(data);
        }
      },
    });
  },
  onLoad: function (options) {
    app.api.request({
      dontShowLoading: true,
      url: 'v3/notices/latest',
      data: {},
      callBack: data => {
        if (data) {
          this.setData({
            notice: data,
          });
        }
      },
    });
    app.eventBus.on('updateGrade', this, () => {
      this.getGrade();
    });
    // 从订阅消息进入
    if (options.grade) {
      console.log(options.grade);
      this.handleData(JSON.parse(options.grade));
    } else if (app.storage.getKey('gradeCache')) {
      this.handleData(app.storage.getKey('gradeCache'));
    } else {
      this.getGrade();
    }
  },
  onUnload: function () {
    app.eventBus.off('updateGrade', this);
  },
  onShareAppMessage: function (e) {
    return {
      title: '我的成绩',
      path: 'pages/grade/friend?grade=' + JSON.stringify(semesterItems),
    };
  },
});
