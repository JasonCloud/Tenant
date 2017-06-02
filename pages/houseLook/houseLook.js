// pages/houseLook/houseLook.js
const http = require('../../utils/http');
const util = require('../../utils/util');
Page({
  data:{
    id:null,
    mask:false,
    btnType:'prevlook',
    phone_num:'',
    detailObj:{}
  },
  formSubmit(e){
    var name = e.detail.value.nickname;
    var phone = e.detail.value.phone;
    http.post('/api/apply/wechat/order',{tenantsName:name,tenantsPhone:phone,apartmentId:this.data.id},true).then(res=>{
      this.formReset();
      util.alert({content:'预约成功！我们将安排专业顾问带你看房，请内心等待～'});
    }).catch(err=>{
      util.alert({content:JSON.stringify(err)});
    })
  },
  formReset(e){
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
  getDetail(id){
    http.get('/api/apartment/detail',{id:id}).then(res=>{
      res.data.totalPrice = parseInt(res.data.totalPrice);
      res.data.unitPrice = parseInt(res.data.unitPrice);
      res.data.totalArea = parseInt(res.data.totalArea);
      this.setData({
        phone_num:res.data.telephone,
        detailObj:res.data
      })
    })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({id:options.id});
    this.getDetail(options.id);
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