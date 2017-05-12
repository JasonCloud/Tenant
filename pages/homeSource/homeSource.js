// pages/homeSource/homeSource.js
Page({
  data:{
    list:[1,2,3,4,5],
    search_input:""
  },
  dele(){
    this.setData({
      search_input:''
    })
  },
  gotoDetail(){
    wx.navigateTo({
      url:"../homeDetail/homeDetail"
    })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})