const app = getApp();
Page({
  data: {
    gradeItems: [],
    headerItems: ['项目', '成绩', '单位', '分数'],
  },
  onLoad: function (options) {
    this.setData({
      title: options.title,
    });
    app.api.request({
      url: `v3/fitness/grade/${options.id}`,
      data: {},
      callBack: data => {
        this.setData({
          gradeItems: data,
        });
      },
    });
  },
});
