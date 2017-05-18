// pages/homeDetail/homeDetail.js
const http = require('../../utils/http')
Page({
  data:{
    indicatorDots:true,
    autoplay:true,
    interval:4000,
    duration:500,
    list:[1,2,3,4],
    mask:false,
    page_num:1,
    detail_obj:{},
    detailObject:{},
    phone_num:'15216175693',
    btnType:'prevlook',
    imgUrls:[
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494154720483&di=189fc9c3663d9580aecf139880bf8623&imgtype=0&src=http%3A%2F%2Fimage.tianjimedia.com%2FuploadImages%2F2015%2F028%2F31%2FQ3U828G33506.JPEG',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494154720482&di=ecd977d0df516af5cddcbd392e07c1a3&imgtype=0&src=http%3A%2F%2Fimage.tianjimedia.com%2FuploadImages%2F2015%2F028%2F22%2FP822ETRKJOU0.JPEG',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494154720482&di=cf09b5974e321ce3aa9a580ba95923b9&imgtype=0&src=http%3A%2F%2Fimage.tianjimedia.com%2FuploadImages%2F2015%2F028%2F25%2F6Q1AIE18139Y.JPEG',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494154720482&di=24b13864d742c8e6fcc516eb7bd9dcb9&imgtype=0&src=http%3A%2F%2Fimage.tianjimedia.com%2FuploadImages%2F2015%2F028%2F28%2FIW4C75336797.JPEG'
    ],
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
  get_house_detail(id){
    http.get('/api/mansion/detail',{id:id}).then(res => {
      console.log(res)
    }).catch(res =>{
      let obj = this.initDetailData(res.data.data)
      this.setData({
        detailObject: obj
      })
    })
  },
  initDetailData(obj){
    if(!obj) return {};
    obj.price = obj.price.replace(/\D/g,'');
    return obj;
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.get_house_detail(options.id)
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