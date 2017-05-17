// pages/homeSource/homeSource.js
const http = require('../../utils/http')
const util = require('../../utils/util')
Page({
  data:{
    list:[],
    search_input:"",
    areaType:'area',//默认选择为区域
    page_num:1,
    selectConditionId:-1,
    condition:{},//所有的筛选条件
    selectId:-1,//区域选择二级id
    areaOrFilter:'filter',//区域和筛选切换
    listOne:[],
    listTow:[],
    conditionKey:['area','price','subwayPerimeter','landmarkBuilding','office','creativeGarden']
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
  choiceCondition(e){
    let type = e.currentTarget.dataset.type;
    if(type == this.data.areaOrFilter){
      this.setData({
        areaOrFilter:''
      })
    }else{
      this.setData({
        areaOrFilter:type
      })
    }

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
  getCondition(){
    return util.getStorage('condition')
  },
  changeArea(e){
    let areaType = e.target.dataset.type;
    if(areaType == 'area'){
      this.setData({
        areaType:areaType,
        listOne:this.data.condition.region.allChildrenKeyword,
        listTow:this.data.condition.region.allChildrenKeyword[0].allChildrenKeyword,
        selectId:-1
      })
    }else if(areaType == 'metro'){
      this.setData({
        areaType:areaType,
        listTow:this.data.condition.metro.allChildrenKeyword[0].allChildrenKeyword,
        listOne:this.data.condition.metro.allChildrenKeyword,
        selectId:-1
      })
    }

  },
  changeCity(e){
    let index = e.target.dataset.index
    let id = e.target.dataset.id
    if(this.data.listOne[index]){
      this.setData({
        listTow:this.data.listOne[index]['allChildrenKeyword'],
        selectId:id
      })
    }

  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.get_house_list({pageNo:this.data.page_num})
    let condition = this.initCondition(this.getCondition());
    this.setData({
      condition:condition,
      listOne:condition.region.allChildrenKeyword,
      listTow:condition.region.allChildrenKeyword[0].allChildrenKeyword,
    })
  },
  initCondition(condition){
    if(!condition)return {}
    condition.area.wordName = '面积(㎡)';
    condition.price.wordName = '价格(元/㎡/月)';
    condition.area.allChildrenKeyword.forEach((v,k) => {
      v.wordName = v.wordName.match(/\d+/g).join('-')
    })
    condition.price.allChildrenKeyword.forEach((v,k) => {
      v.wordName = v.wordName.match(/\d+/g).join('')
    })
    return condition;
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