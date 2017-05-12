//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    interval:4000,//图片自动轮播时间间隔
    duration:500,//单张滑动持续时间
    autoplay:true,//是否自动切换
    circular:true,//是否无缝切换
    current_num:0,
    choice_checked_first:0,
    imgs:[
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494482002162&di=bc955b8e8d96445ba38f8fe739cc5b0d&imgtype=0&src=http%3A%2F%2Fimg27.51tietu.net%2Fpic%2F2017-011500%2F20170115001256mo4qcbhixee164299.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494482002162&di=283f0eb8cc25eb797820a5944042b413&imgtype=0&src=http%3A%2F%2Fd.5857.com%2Fxgyw_170321%2Fdesk_001.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494482002160&di=ef18698bc49d09617fc8842148fcaf33&imgtype=0&src=http%3A%2F%2Fwww.zhlzw.com%2FUploadFiles%2FArticle_UploadFiles%2F201204%2F20120412123912727.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494482002159&di=ec7d061a41058f9912613282a3241a88&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F13%2F59%2F88%2F47v58PICab5_1024.jpg'
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  check(e){
    let idx = e.currentTarget.dataset.index;
    this.setData({
      choice_checked_first:idx
    })
  },
  change(e){
    this.setData({
      current_num:e.detail.current
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
