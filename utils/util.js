const _Promise = require('./bluebird');
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/*设置缓存*/
function setStorage(key,val,sync=true){
  if(sync){
    wx.setStorageSync(key, val)
  }else{
    wx.setStorage({
      key:key,
      data:val
    });
  }
};
/*在缓存获取数据*/
function getStorage(key,cb,sync=true){
  if(sync){
    var value = wx.getStorageSync(key);
    if(value){
      return value;
    }else{
      return false;
    }
  }else{
    wx.getStorage({
      key: key,
      success: function(res) {
        if(cb && typeof  cb == 'function'){
          cb(res.data);
        }
      },
      fail:function () {
        return false;
      }
    })
  }
};
function Throttle () {
  var time = null;
  return function (fn,timerout=500) {
    clearTimeout(time);
    time = setTimeout(() => {
      fn()
    },timerout)
  }
}
//移除缓存
function removeStorage(key,cb,sync=true){
  if(sync){
    wx.removeStorageSync(key);
  }else{
    wx.removeStorage({
      key: key,
      success: function(res) {
        if(cb && typeof  cb == 'function'){
          cb(res.data);
        }
      }
    })
  }
};
//谈提示框
function alert(obj={},showCancel=false){
  return new _Promise((reslove,reject)=>{
    wx.showModal({
      title: obj.title?obj.title:'',
      content: obj.content?obj.content:'',
      showCancel:showCancel,
      success: function(res) {
        if (res.confirm) {
          reslove({confirm:true});
        }else{
          reslove({confirm:false})
        }
      }
    })
  });
};
//电话号码分隔
function toThousands(num) {
  var result = [ ], counter = 0;
  num = (num || '').toString().split('');
  for (var i = num.length - 1; i >= 0; i--) {
    counter++;
    result.unshift(num[i]);
    if (!(counter % 4) && i != 0) { result.unshift(' '); }
  }
  return result.join('');
}
module.exports = {
  formatTime: formatTime,
  setStorage: setStorage,
  getStorage: getStorage,
  removeStorage: removeStorage,
  alert: alert,
  toThousands: toThousands,
  Throttle:Throttle
}
