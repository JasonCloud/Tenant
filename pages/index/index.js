//index.js
//获取应用实例
var app = getApp();
const http = require('../../utils/http');
const util = require('../../utils/util');
var onLoadend = false;
var loadingTimer = null;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    dataObj:{},
    interval:4000,//图片自动轮播时间间隔
    duration:500,//单张滑动持续时间
    autoplay:true,//是否自动切换
    circular:true,//是否无缝切换
    current_num:0,
    choice_checked_first:0,
    groupType: 1,
    imgs:[
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494482002162&di=bc955b8e8d96445ba38f8fe739cc5b0d&imgtype=0&src=http%3A%2F%2Fimg27.51tietu.net%2Fpic%2F2017-011500%2F20170115001256mo4qcbhixee164299.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494482002162&di=283f0eb8cc25eb797820a5944042b413&imgtype=0&src=http%3A%2F%2Fd.5857.com%2Fxgyw_170321%2Fdesk_001.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494482002160&di=ef18698bc49d09617fc8842148fcaf33&imgtype=0&src=http%3A%2F%2Fwww.zhlzw.com%2FUploadFiles%2FArticle_UploadFiles%2F201204%2F20120412123912727.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494482002159&di=ec7d061a41058f9912613282a3241a88&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F13%2F59%2F88%2F47v58PICab5_1024.jpg'
    ],
    positionCity:'广州'
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
      choice_checked_first:idx,
      groupType: e.currentTarget.dataset.type
    })
  },
  change(e){
    this.setData({
      current_num:e.detail.current
    })
  },
  routerGo(e){
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url:`../${type}/${type}`
    })
  },
  //定位
  position(availableCity){
    console.log('position');
    console.log(availableCity);
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        util.qqMap.reverseGeocoder({
          location:{latitude:latitude,longitude:longitude},
          success:function(res){
            console.log(res);
          },
          fail:function(err){
            console.log(err);
          }
        })
      }
    })
  },
  onLoad: function () {
    if(!onLoadend){
      http.get('/api/home/index').then(res=>{
        onLoadend = true;
        console.log(res);
        res.data.groups = res.data.groups.map(function(item){
          if(item.type == 1){
            item.title = '热门商圈';
          }else if(item.type == 2){
            item.title = '团队规模';
          }else if(item.type == 3){
            item.title = '办公类型';
          }
          return item
        });
        this.position(res.data.citys);
        this.setData({
          dataObj:res.data
        })
      })
    }
  },
  onShow(){
    if(onLoadend){
      http.get('/api/home/index').then(res=>{
        console.log(res);
        res.data.groups = res.data.groups.map(function(item){
          if(item.type == 1){
            item.title = '热门商圈';
          }else if(item.type == 2){
            item.title = '团队规模';
          }else if(item.type == 3){
            item.title = '办公类型';
          }
          return item
        });
        this.setData({
          dataObj:res.data
        })
      })
    }
  },
});
