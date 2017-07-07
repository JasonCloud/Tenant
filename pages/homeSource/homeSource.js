// pages/homeSource/homeSource.js
const http = require('../../utils/http');
const util = require('../../utils/util');
const Throttle = util.Throttle();
const app = getApp();
let loadend = false;
let loadingTimer = null;
Page({
  data:{
    list:[],
    search_input:"",
    areaType:'area',//默认选择为区域
    filterType:'', //选项类型
    page_num:1, //当前页数
    resultAreaId:'', //区域筛选的id
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
      areaText:'',
      area:-1,
      priceText:'',
      price:-1,
      subwayPerimeterText:'',
      subwayPerimeter:-1,
      landmarkBuildingText:'',
      landmarkBuilding:-1,
      officeText:'',
      office:-1,
      creativeGardenText:'',
      creativeGarden:-1
    },
    condition:{},//所有的筛选条件
    selectId:-1,//区域选择二级id
    selectText:'', //区域选择二级名字
    areaOrFilter:'',//区域和筛选切换
    listOne:[],
    listTow:[],
    // conditionKey:['area','price','subwayPerimeter','landmarkBuilding','office','creativeGarden'],
    conditionKey:['area','price'],
    pageSize:10,
    fetchAll:false, //标注是否加载完数据
    areaText:'', //选中的区域名称
    filterText:'',//选中的筛选条件
    showFilterText:false,
    onLoadend:false, //标注数据是否加载完
    minAndMax:{
      minArea:'',
      maxArea:'',
      minPrice:'',
      maxPrice:''
    }
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
    let apartmentCount = e.currentTarget.dataset.apartmentcount;
    wx.navigateTo({
      url:`../homeDetail/homeDetail?id=${id}&apartmentCount=${apartmentCount}`
    })
  },
  //获取某一个区域的id
  selectConditionId(e){
    let id = e.target.dataset.id;
    let type = e.target.dataset.type;
    let wordName = e.target.dataset.wordname;
    if(id == this.data.selectConditionId[type]){
      this.data.selectConditionId[type] = -1;
      this.data.selectConditionId[type+'Text'] = '';
      this.setData({
        selectConditionId:this.data.selectConditionId
      })
    }else {
      this.data.selectConditionId[type] = id;
      this.data.selectConditionId[type+'Text'] = wordName;
      if(type == 'area'){
        this.data.minAndMax.minArea = '';
        this.data.minAndMax.maxArea = '';
      }
      if(type == 'price'){
        this.data.minAndMax.minPrice = '';
        this.data.minAndMax.maxPrice = '';
      }
      this.setData({
        selectConditionId:this.data.selectConditionId,
        minAndMax:this.data.minAndMax
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
        // resultAreaId:'',
        filterType:type,
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
  //区
  choiceArea(e){
    let id = e.currentTarget.dataset.id;
    let wordName = e.currentTarget.dataset.wordname;
    this.setData({
      areaOrFilter:'',
      page_num:1,
      fetchAll:false,
    });
    if(id==0){
      let obj = {
        pageNo:this.data.page_num,
      };
      this.setData({
        areaText:this.data.selectText,
      });
      this.data.areaType == 'metro'? obj.subway = this.data.selectId : obj.region = this.data.selectId;
      this.get_house_list(obj,true);
    }
    if(this.data.resultAreaId != id){
      let obj = {
        pageNo:this.data.page_num,
      };
      this.setData({
        areaText:wordName
      });
      this.data.areaType == 'metro'? obj.subway = id : obj.region = id;
      this.get_house_list(obj,true).then(res => {
        this.setData({
          resultAreaId:id
        });
      })
    }
    // console.log(this.data.resultAreaId)
    // console.log(id)

  },
  //获取房源列表
  get_house_list(obj,reset=false){
    obj.pageSize = this.data.pageSize;
   return http.get('/api/mansion/list',obj).then(res => {
     if(res.data.result.length < this.data.pageSize){
       this.setData({
         fetchAll:true
       })
     }else if(res.data.result.length >= this.data.pageSize){
       this.setData({
         page_num:this.data.page_num + 1
       })
     }
     let arr = res.data && res.data.result;
     if(!!arr){
       arr.forEach(res => {
         // res.price = res.price.replace(/\D/g,'')
         var priceArr = res.price.split('-');
         res.price = priceArr.length > 1 ? priceArr[0]+res.price.replace(/[\d|-]/g,'').replace('以上','')+'起' : res.price.replace('以上','起');
       })
       if(!loadend){
         util.hiddenLoading(loadingTimer);
       }
       loadend = true;
       this.setData({
         list:reset ? arr : Array.prototype.concat(this.data.list,arr),
         onLoadend:true
       })
     }
    }).catch(res =>{

    })
  },
  //选择区域和地铁线路
  changeArea(e){
    let areaType = e.target.dataset.type;
    if(areaType == 'area'){
      this.setData({
        areaType:areaType,
        listOne:this.data.condition.region.allChildrenKeyword,
        listTow:this.data.condition.region.allChildrenKeyword.length > 0 ? this.data.condition.region.allChildrenKeyword[0].allChildrenKeyword:[],
        selectId:-1
      })
    }else if(areaType == 'metro'){
      this.setData({
        areaType:areaType,
        listTow:this.data.condition.metro.allChildrenKeyword.length > 0 ? this.data.condition.metro.allChildrenKeyword[0].allChildrenKeyword:[],
        listOne:this.data.condition.metro.allChildrenKeyword,
        selectId:-1
      })
    }

  },
  //选择具体某个城市或者地铁的某个站点
  //式
  changeCity(e){
    let index = e.target.dataset.index;
    let id = e.target.dataset.id;
    let wordName = e.target.dataset.wordname;
    if(this.data.listOne[index]){
      // console.log('选择城市');
      this.setData({
        listTow:this.data.listOne[index]['allChildrenKeyword'],
        selectId:id,
        selectText:wordName
      })
    }else{
      this.setData({
        listTow:[],
        selectId:id,
        selectText:wordName
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
    // let condition = this.initCondition(this.getCondition());
    if(!loadend){
      loadingTimer = util.showLoading();
    }
    this.setData({
      page_num:1
    });
    this.getCondition();
    var obj = util.getStorage('searchObj');
    var filterText = util.getStorage('filterText');
    if(filterText){
      filterText.showFilterText = filterText.filterText ? true : false;
      this.setData(filterText);
      util.removeStorage('filterText');
    }
    if(obj){
      obj.pageNo = 1;
      obj.cityName = app.globalData.serverCity;
      this.get_house_list(obj,true);
      util.removeStorage('searchObj');
    }else{
      this.get_house_list({pageNo:1},true);
    }

  },
  getCondition(){
    app.getCondition(res => {
      console.log(res);
      let condition = this.initCondition(res);
      console.log(condition);
      this.setData({
        condition:condition,
        listOne:condition.region.allChildrenKeyword,
        listTow:condition.region.allChildrenKeyword.length > 0 ? condition.region.allChildrenKeyword[0].allChildrenKeyword:[],
      });
    });
  },
  //显示筛选数据的处理
  initCondition(condition){
    if(!condition)return {}
    condition.area.wordName = '面积(㎡)';
    condition.price.wordName = '价格(元/㎡/月)';
    /*condition.area.allChildrenKeyword.forEach((v,k) => {
      v.wordName = v.wordName.match(/\d+/g).join('-')
    })
    condition.price.allChildrenKeyword.forEach((v,k) => {
      v.wordName = v.wordName.match(/\d+/g).join('')
    })*/
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
      page_num:1,
      filterType:'',
      fetchAll:false,
    });
    var obj = {
      pageNo:this.data.page_num,
    }
    this.data.areaType == 'metro'? obj.subway = this.data.resultAreaId : obj.region = this.data.resultAreaId;
    // this.get_house_list(obj,true);
    // this.detectionFilter();
  },
  //筛选条件确定
  confirm(){
    var minAndMax = this.data.minAndMax;
    var selectConditionId = this.data.selectConditionId;
    var selectObj = {};
    for(let key in selectConditionId){
      if(selectConditionId.hasOwnProperty(key)){
        if(selectConditionId[key] > -1  && key.indexOf('Text') < 0 ){
          selectObj[key] = selectConditionId[key];
        }
      }
    }
    this.setData({
      areaOrFilter:'',
      page_num:1,
    });
    if(!this.objectEmpty()(selectObj)){
      this.setData({fetchAll:false});
      let obj = Object.assign({},selectObj);
      this.data.areaType == 'metro'? obj.subway = this.data.resultAreaId : obj.region = this.data.resultAreaId;
      minAndMax.minArea ? obj.minArea = minAndMax.minArea : '';
      minAndMax.maxArea ? obj.maxArea = minAndMax.maxArea : '';
      minAndMax.minPrice ? obj.minPrice = minAndMax.minPrice : '';
      minAndMax.maxPrice ? obj.maxPrice = minAndMax.maxPrice : '';
      this.get_house_list(obj,true);
    }else{
      var obj = {
        pageNo:this.data.page_num,
      }
      this.data.areaType == 'metro'? obj.subway = this.data.resultAreaId : obj.region = this.data.resultAreaId;
      minAndMax.minArea ? obj.minArea = minAndMax.minArea : '';
      minAndMax.maxArea ? obj.maxArea = minAndMax.maxArea : '';
      minAndMax.minPrice ? obj.minPrice = minAndMax.minPrice : '';
      minAndMax.maxPrice ? obj.maxPrice = minAndMax.maxPrice : '';
      this.get_house_list(obj,true);
    }
    this.detectionFilter();
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
  //检测筛选显示文案
  detectionFilter(){
    var condition = this.data.selectConditionId;
    var minAndMax = this.data.minAndMax;
    var n = 0;
    for(let key in condition){
      if(condition.hasOwnProperty(key)){
        if(key.indexOf('Text')>-1 && condition[key] != ''){
              this.setData({
                filterText: condition[key]
              });
        }
        if(condition[key] > -1  && key.indexOf('Text') < 0 ){
          n = n + 1;
        }
      }
    }
    if(minAndMax.minArea && !minAndMax.maxArea){
      n = n + 1;
      this.setData({
        showFilterText: true,
        filterText:minAndMax.minArea + '㎡以上'
      })
    }else if (!minAndMax.minArea && minAndMax.maxArea){
      n = n + 1;
      this.setData({
        showFilterText: true,
        filterText: '0㎡～' + minAndMax.maxArea + '㎡'
      })
    }else if(minAndMax.minArea && minAndMax.maxArea){
      n = n + 1;
      this.setData({
        showFilterText: true,
        filterText:minAndMax.minArea + '㎡～' + minAndMax.maxArea + '㎡'
      })
    }

    if(minAndMax.minPrice && !minAndMax.maxPrice){
      n = n + 1;
      this.setData({
        showFilterText: true,
        filterText:minAndMax.minPrice + '元/月以上'
      })
    }else if(!minAndMax.minPrice && minAndMax.maxPrice){
      n = n + 1;
      this.setData({
        showFilterText: true,
        filterText:'0～'+minAndMax.maxPrice+'元/月'
      })
    }else if(minAndMax.minPrice && minAndMax.maxPrice){
      n = n + 1;
      this.setData({
        showFilterText: true,
        filterText:minAndMax.minPrice+'～'+minAndMax.maxPrice + '元/月'
      })
    }
    if(n==0){
      this.setData({
        showFilterText: false,
        filterText:''
      })
    }else if(n > 1){
      this.setData({
        showFilterText: true,
        filterText:'多选'
      })
    }else{
      this.setData({
        showFilterText: true,
      })
    }
  },
  //手动输入最大最小值搜索
  inputEnter(e){
    var type = e.currentTarget.dataset.type;
    var value = e.detail.value;
    switch (type){
      case 'minArea':
        this.data.minAndMax.minArea = value;
        this.setData({minAndMax:this.data.minAndMax});
        break;
      case 'maxArea':
        this.data.minAndMax.maxArea = value;
        this.setData({minAndMax:this.data.minAndMax});
        break;
      case 'minPrice':
        this.data.minAndMax.minPrice = value;
        this.setData({minAndMax:this.data.minAndMax});
        break;
      case 'maxPrice':
        this.data.minAndMax.maxPrice = value;
        this.setData({minAndMax:this.data.minAndMax});
        break;
    }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var obj = util.getStorage('searchObj');
    var filterText = util.getStorage('filterText');
    if(obj || filterText){
      this.setData({
        page_num:1
      });
      this.getCondition();
      if(filterText){
        filterText.showFilterText = filterText.filterText ? true : false;
        this.setData(filterText);
        util.removeStorage('filterText');
      }
      if(obj){
        obj.pageNo = 1;
        obj.cityName = app.globalData.serverCity;
        this.get_house_list(obj,true);
        util.removeStorage('searchObj');
      }else{
        this.get_house_list({pageNo:1},true);
      }
    }
  },
  onUnload:function(){
    // 页面关闭
  },
  onReachBottom: function() {
    // Do something when page reach bottom.
    if(this.data.page_num <= 1 || this.data.fetchAll){
      return
    }
    if(this.data.areaOrFilter == 'area'){
      let obj = {
        pageNo:this.data.page_num
      }
      this.data.areaType == 'metro'? obj.subway = this.data.resultAreaId : obj.region = this.data.resultAreaId;
      this.get_house_list(obj);

    }else if(this.data.areaOrFilter == 'filter'){

      if(!this.objectEmpty()(this.data.selectConditionId)){
        let obj = Object.assign({},this.data.selectConditionId);
        this.data.areaType == 'metro'? obj.subway = this.data.resultAreaId : obj.region = this.data.resultAreaId;
        this.get_house_list(obj);
      }

    }else{
      let obj = {pageNo:this.data.page_num};
      this.get_house_list(obj);
    }
  },
  focus(e){
    var type = e.currentTarget.dataset.type;
    if(type == 'minArea' || type == 'maxArea'){
      this.data.selectConditionId.area = -1;
      this.setData({selectConditionId:this.data.selectConditionId})
    }
    if(type == 'minPrice' || type == 'maxPrice'){
      this.data.selectConditionId.price = -1;
      this.setData({selectConditionId:this.data.selectConditionId});
    }
  },
  onHide(){
    // this.setData({
    //   areaText:'',
    //   filterText:'',
    //   showFilterText:false,
    // })
  }
})