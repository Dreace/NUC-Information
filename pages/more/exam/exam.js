// pages/home/exam/exam.js
const app = getApp();
Component({
  data: {
    isDataEmpty: false,
    info: null
  },
  methods: {
    onLoad(){
      this.getExam();
    },
    getExam(){
      app.api.request({
        url: 'v3/exam',
        data: {
          name: app.storage.getKey('name'),
          passwd: app.storage.getKey('password'),
        },
        callBack: data => {
          if (data.length !== 0) {
            this.setData({
              isDataEmpty: true,
              info: data.data
            })
          }
        },
      });
    }
  }
})