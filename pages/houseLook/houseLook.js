// pages/houseLook/houseLook.js
Page({
  data:{
    mask:false,
    btnType:'prevlook',
    phone_num:'110'
  },
  formSubmit(e){
    console.log(e)
  },
  formReset(e){
    console.log(e)
    this.setData({
      mask:false
    })
  },
  control_mask(){
    console.log(999)
    this.setData({
      mask:!this.data.mask
    })
  },
  prevent(){
    console.log('pre')
  },
  call(){
    var self = this
    wx.makePhoneCall({
      phoneNumber: this.data.phone_num, //仅为示例，并非真实的电话号码
      success:function(){
        self.setData({
          mask:false
        })
      }
    })
  },
  prev_look_home(){
    this.setData({
      mask:true,
      btnType:'prevlook'
    })
  },
  zi_xun(){
    this.setData({
      mask:true,
      btnType:'zi_xun'
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