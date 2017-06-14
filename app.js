//app.js
const http = require('./utils/http');
//appid wxbdaf2837541eb89f
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据

  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getCondition(cb){
    http.get('/api/mansion/condition',{city:this.globalData.serverCity}).then(res => {
      if(cb && typeof cb == 'function'){
        cb(res.data);
      }
      util.setStorage('condition',res.data);
    }).catch(res => {

    })
  },
  globalData:{
    userInfo:null,
    serverCity:'广州市'
  },
  setGlobalData(key,value){
    this.globalData[key] = value;
  }
})