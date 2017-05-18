// pages/homeSource/homeSource.js
const http = require('../../utils/http')
const util = require('../../utils/util')
Page({
  data:{
    list:[],
    search_input:"",
    areaType:'area',//默认选择为区域
    page_num:1,
    tabType:{
      area:'',
      price:'',
      subwayPerimeter:'',
      landmarkBuilding:'',
      office:'',
      creativeGarden:''
    },
    selectConditionId:{
      area:-1,
      price:-1,
      subwayPerimeter:-1,
      landmarkBuilding:-1,
      office:-1,
      creativeGarden:-1
    },
    condition:{},//所有的筛选条件
    selectId:-1,//区域选择二级id
    areaOrFilter:'filter',//区域和筛选切换
    listOne:[],
    listTow:[],
    conditionKey:['area','price','subwayPerimeter','landmarkBuilding','office','creativeGarden']
  },
  //删除搜索
  dele(){
    this.setData({
      search_input:''
    })
  },
  //跳转到详情
  gotoDetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:"../homeDetail/homeDetail?id="+id
    })
  },
  //获取某一个区域的id
  selectConditionId(e){
    let id = e.target.dataset.id;
    let type = e.target.dataset.type;
    this.data.selectConditionId[type] = id;
    this.setData({
      selectConditionId:this.data.selectConditionId
    })
  },
  //选择区域或者筛选切换
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
  tab(e){
    let type = e.currentTarget.dataset.type;
    if(type == this.data.tabType[type]){
      this.data.tabType[type] = '';
      this.setData({
        tabType:this.data.tabType
      })
    }else {
      this.data.tabType[type] = type;
      this.setData({
        tabType:this.data.tabType
      })
    }

  },
  //获取房源列表
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
  //获取筛选条件
  getCondition(){
    return util.getStorage('condition')
  },
  //选择区域和地铁线路
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
  //选择具体某个城市或者地铁的某个站点
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
  //显示筛选数据的处理
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
  //重置筛选条件
  reset(){
    let obj_condition = this.data.selectConditionId;
    for(let key in obj_condition){
      if(obj_condition.hasOwnProperty(key)){
        obj_condition[key] = -1;
      }
    }
    this.setData({
      selectConditionId:obj_condition
    })
  },
  confirm(){
    this.setData({
      areaOrFilter:''
    })
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