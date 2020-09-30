const api = require('./utils/api');
const storage = require('./utils/storage');
const eventBus = require('./utils/eventBus');

App({
  require: path => require(path),
  api: api,
  storage: storage,
  eventBus: eventBus,
  globalData: {},
  onLaunch: function () {
    storage.setKey('isQQ', typeof qq !== 'undefined');
    // 初始化云函数
    if (!storage.getKey('isQQ')) {
      wx.cloud.init({
        env: 'nuc-code-eeed10',
        traceUser: true,
      });
    }
    wx.getSystemInfo({
      success: e => {
        storage.setKey('statusBarHeight', e.statusBarHeight);
        let custom = {
          width: 80,
          height: 30,
          left: e.windowWidth - 12 - 80,
          right: e.windowWidth - 12,
          top: e.statusBarHeight + 10,
          bottom: e.statusBarHeight + 10 + 30,
        };
        try {
          if (!storage.getKey('isQQ')) {
            custom = wx.getMenuButtonBoundingClientRect();
          }
        } catch (error) {}
        storage.setKey(
          'customBarHeight',
          custom.bottom + custom.top - e.statusBarHeight
        );
      },
    });
    // 学期第一天
    api.request({
      dontShowLoading: true,
      rawData: true,
      url: 'static/firstWeekDateTime',
      data: {},
      callBack: res => {
        storage.setKey('firstWeekDateTime', res);
      },
    });

    if (!storage.getKey('version')) {
      storage.setKey('updated', wx.getStorageSync('updated'));
      storage.setKey('name', wx.getStorageSync('name'));
      storage.setKey('password', wx.getStorageSync('passwd'));
      storage.setKey('mapModalShowed', wx.getStorageSync('mapShowed'));
      storage.setKey('openId', wx.getStorageSync('openId'));
      storage.setKey('updatedPassword', wx.getStorageSync('updatedPasswd'));
      storage.setKey('lastShowNoticeID', wx.getStorageSync('lastShowNoticeID'));
      storage.setKey(
        'dontShowLatestNotice',
        wx.getStorageSync('dontShowLatestNotice')
      );
      eventBus.emit('updateKey');

      // 需要重新登录
      if (storage.getKey('name') && !storage.getKey('updatedPassword')) {
        // storage.removeKey('customTimetable')
        storage.removeKey('accountList');
        storage.removeKey('name');
        storage.removeKey('password');

        wx.showModal({
          title: '需重新登录',
          content: '已适配新教务系统，需重新登录，默认密码“zbdx+身份证后六位”',
          confirmText: '去登陆',
          confirmColor: '#79bd9a',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/my/login/login',
              });
            }
          },
        });
      }
    }
    if (storage.getKey('name') === 'guest') {
      storage.removeKey('name');
      storage.removeKey('password');
    }
    // 向下兼容
    if (storage.getKey('name') && storage.getKey('version') < '2.2.1') {
      storage.setKey('accounts', [
        {
          name: storage.getKey('name'),
          password: storage.getKey('password'),
        },
      ]);
    }
    if (!storage.getKey('name')) {
      storage.setKey('accounts', []);
    }
    storage.setKey('version', '2.2.3');
    // 新版本检查
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        console.log('检测到新版本');
      }
    });

    updateManager.onUpdateReady(function () {
      storage.setKey('updated', true);
      updateManager.applyUpdate();
    });

    updateManager.onUpdateFailed(function () {
      wx.showToast({
        title: '版本更新失败',
      });
    });

    // 获取 OpenID
    this.getOpenId();
    if (storage.getKey('updated') === true) {
      storage.setKey('updated', false);
      wx.showModal({
        title: '更新完成',
        content: '已更新到最新版本，是否查看版本说明？',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/more/releaseNote/releaseNote',
            });
          }
        },
      });
    }
  },
  getOpenId: function () {
    if (storage.getKey('isQQ')) {
      return;
    }
    if (!storage.getKey('openId')) {
      wx.cloud.callFunction({
        name: 'getOpenId',
        complete: res => {
          storage.setKey('openId', res.result.openId);
          eventBus.emit('updateKey');
        },
      });
    }
  },
});
