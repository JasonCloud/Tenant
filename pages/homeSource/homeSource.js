// pages/homeSource/homeSource.js
const http = require('../../utils/http')
const util = require('../../utils/util')
const Throttle = util.Throttle();
const app = getApp();
Page({
  data:{
    list:[],
    search_input:"",
    areaType:'area',//默认选择为区域
    page_num:1,
    resultAreaId:'',
    upChoiceValue:'',//价格排序图标控制
    tabType:{ //展开控制
      area:'',
      price:'',
      subwayPerimeter:'',
      landmarkBuilding:'',
      office:'',
      creativeGarden:''
    },
    selectConditionId:{
      area:'',
      price:'',
      subwayPerimeter:'',
      landmarkBuilding:'',
      office:'',
      creativeGarden:''
    },
    condition:{},//所有的筛选条件
    selectId:-1,//区域选择二级id
    areaOrFilter:'',//区域和筛选切换
    listOne:[],
    listTow:[],
    conditionKey:['area','price','subwayPerimeter','landmarkBuilding','office','creativeGarden'],
    pageSize:10
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

    if(id == this.data.selectConditionId[type]){
      this.data.selectConditionId[type] = '';
      this.setData({
        selectConditionId:this.data.selectConditionId
      })
    }else {
      this.data.selectConditionId[type] = id;
      this.setData({
        selectConditionId:this.data.selectConditionId
      })
    }


  },
  //价格排序
  priceSort(){
    if(this.data.list.length <2) return;
    Throttle(()=>{

      if(this.data.upChoiceValue){
        this.data.list.sort((a,b) =>{
          return a.price - b.price;
        })
      }else{
        this.data.list.sort((a,b) =>{
          return b.price - a.price;
        })
      }
      this.setData({
        upChoiceValue:!this.data.upChoiceValue,
        list:this.data.list
      })
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
        areaOrFilter:type,
        resultAreaId:''
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
  choiceArea(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      areaOrFilter:'',
      page_num:1
    })
    if(this.data.resultAreaId != id){
      let obj = {
        pageNo:this.data.page_num
      }
      this.data.areaType == 'metro'? obj.subway = id : obj.region = id;
      console.log(obj)
      this.get_house_list(obj,true).then(res => {
        this.setData({
          resultAreaId:id
        })
      })
    }
    console.log(this.data.resultAreaId)
    console.log(id)

  },
  //获取房源列表
  get_house_list(obj,reset=false){
    obj.pageSize = this.data.pageSize;
   return http.get('/api/mansion/list',obj).then(res => {
     console.log(res);
     let arr = res.data && res.data.result;
     if(!!arr){
       arr.forEach(res => {
         res.price = res.price.replace(/\D/g,'')
       })
       this.setData({
         list:reset ? arr : Array.prototype.concat(this.data.list,arr)
       })
     }
    }).catch(res =>{

    })
  },
  //获取筛选条件
  getCondition(){
    // return util.getStorage('condition')

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
  //搜索
  search(){
    wx.navigateTo({
      url:"../search/search"
    })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.get_house_list({pageNo:this.data.page_num});
    // let condition = this.initCondition(this.getCondition());
    app.getCondition(res => {
      console.log(res);
      let condition = this.initCondition(res);
      this.setData({
        condition:condition,
        listOne:condition.region.allChildrenKeyword,
        listTow:condition.region.allChildrenKeyword[0].allChildrenKeyword,
      })
    });
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
        obj_condition[key] = '';
      }
    }
    this.setData({
      selectConditionId:obj_condition,
      upChoiceValue:'',
      page_num:1
    });
    this.get_house_list({pageNo:this.data.page_num},true);
  },
  //筛选条件确定
  confirm(){
    this.setData({
      areaOrFilter:'',
      page_num:1
    })
    if(!this.objectEmpty()(this.data.selectConditionId)){
      let obj = Object.assign({},this.data.selectConditionId);
      this.data.areaType == 'metro'? obj.subway = this.data.resultAreaId : obj.region = this.data.resultAreaId;
      this.get_house_list(obj,true)
    }

  },
  objectEmpty(){
    let flag = true;
    return function fn(obj){
      let arrKey = Object.keys(obj);
      let len = arrKey.length;
      if(len ===0 )return flag;
      for(let i of arrKey){
        if(typeof obj[i] == 'string' && !!obj[i].trim()){
          flag = false
        }else if(typeof obj[i] == 'object' && !!obj[i]){
          fn(obj[i])
        }else if(typeof obj[i] !== 'string'){
          flag = false;
        }
      }
      return flag;
    }
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