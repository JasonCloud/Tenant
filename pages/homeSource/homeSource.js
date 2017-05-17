// pages/homeSource/homeSource.js
const http = require('../../utils/http')
Page({
  data:{
    list:[],
    search_input:"",
    page_num:1
  },
  dele(){
    this.setData({
      search_input:''
    })
  },
  gotoDetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:"../homeDetail/homeDetail?id="+id
    })
  },
  get_house_list(obj){
    http.get('/api/mansion/list',obj).then(res => {
      console.log('====')
      console.log(res)
    }).catch(res =>{
      let arr = res.data.data && res.data.data.result;

      if(!!arr){
        arr.forEach(res => {
          res.price = res.price.replace('￥','元')
        })
        this.setData({
          list:Array.prototype.concat(this.data.list,arr)
        })
      }
    })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.get_house_list({pageNo:this.data.page_num})
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