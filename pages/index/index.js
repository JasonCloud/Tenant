//index.js
//获取应用实例
var app = getApp();
const http = require('../../utils/http');
const util = require('../../utils/util');
var onLoadend = false;
var loadingTimer = null;
const city = require('../../utils/city');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    dataObj:{}, //保存首页数据
    interval:4000,//图片自动轮播时间间隔
    duration:500,//单张滑动持续时间
    autoplay:true,//是否自动切换
    circular:true,//是否无缝切换
    current_num:0,
    choice_checked_first:0,
    groupType: 'tradingAreas',

    serverCity:'广州', //服务城市
    show_area_other:false, //是否显示可选服务城市
    regionText:'区域',
    areaText:'面积',
    currentArea:[], //当前搜索面积
    currentRegion:[], //当前搜索区域
    currentAreaValue:0, //当前搜索面积选中的值
    currentRegionValue:0, //当前搜索区域选中的值
    currentRegionId: -1, //当前选择城市ID
    currentAreaId:-1, //当前选择面积ID
    showAreaSelect: false,
    showRegionSelect: false,
    groups:['tradingAreas','teams','office'],
    groupName:{
      tradingAreas:'热门商圈',
      teams:'团队规模',
      office:'办公类型'
    }
  },
  check(e){
    let idx = e.currentTarget.dataset.index;
    this.setData({
      choice_checked_first:idx,
      groupType: this.data.groups[idx]
    })
  },
  change(e){
    this.setData({
      current_num:e.detail.current
    })
  },
  //调转
  routerGo(e){
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url:`../${type}/${type}`
    })
  },
  //显示隐藏可选区域
  showAndHiddenOtherArea(){
    this.setData({
      show_area_other: !this.data.show_area_other
    })
  },
  //隐藏可选区域
  hiddenOtherArea(){
    this.setData({
      show_area_other: false,
      showRegionSelect: false
    })
  },
  changeServerCity(e){
    var city = e.currentTarget.dataset.city;
    loadingTimer = util.showLoading();
    app.setGlobalData('serverCity',city);
    this.setData({
      serverCity:city,
      regionText:'区域',
      areaText: '面积',
      currentRegionId:-1,
      currentAreaId: -1
    });
    this.getCondition();
  },
  //显示隐藏选择器
  showRegionSelectMethod(e){
    this.setData({
      showRegionSelect: !this.data.showRegionSelect,
      showAreaSelect: false
    });
    //按确认
    if(e.currentTarget.dataset.type == 'confirm' && this.data.currentRegionId == -1){
      this.setData({
        regionText:this.data.currentRegion[0].wordName + " " + this.data.currentRegion[0].allChildrenKeyword[0].wordName,
        currentRegionId: this.data.currentRegion[0].allChildrenKeyword[0].id
      })
    }
    //按取消
    if(e.currentTarget.dataset.type == 'cancel'){
      this.setData({
        regionText: '区域',
        currentRegionId: -1,
      })
    }
  },
  showAreaSelectMethod(e){
    this.setData({
      showAreaSelect: !this.data.showAreaSelect,
      showRegionSelect: false
    });
    //按确认
    if(e.currentTarget.dataset.type == 'confirm' && this.data.currentAreaId == -1){
      this.setData({
        areaText: this.data.currentArea[0].wordName,
        currentAreaId: this.data.currentArea[0].id
      })
    }
    //按取消
    if(e.currentTarget.dataset.type == 'cancel'){
      this.setData({
        areaText: '面积',
        currentAreaId: -1
      })
    }
  },
  //选择搜索区域
  regionChange(e){
    this.setData({
      currentRegionValue:e.detail.value[0],
    })
    this.setData({
      currentRegionId:this.data.currentRegion[this.data.currentRegionValue].allChildrenKeyword[e.detail.value[1]].id,
      regionText:this.data.currentRegion[this.data.currentRegionValue].wordName + ' ' + this.data.currentRegion[this.data.currentRegionValue].allChildrenKeyword[e.detail.value[1]].wordName,
    });
  },
  areaChange(e){
    this.setData({
      areaText: this.data.currentArea[e.detail.value[0]].wordName,
      currentAreaId: this.data.currentArea[e.detail.value[0]].id
    })
    console.log(this.data.currentAreaId);
  },
  //搜索
  search(){
    util.setStorage('searchObj',{
      region:this.data.currentRegionId > -1 ? this.data.currentRegionId : '',
      area:this.data.currentAreaId > -1 ? this.data.currentAreaId : '',
    });
    var regionText = this.data.regionText.split(' ');
    var filterText = '';
    if(regionText.length >1 && regionText[1] == '不限'){
      filterText = regionText[0];
    }else if(regionText.length >1 && regionText[0] != '不限' && regionText[1] != '不限'){
      filterText = regionText[1];
    }
    util.setStorage('filterText',{
      areaText: filterText,
      filterText:this.data.areaText != '面积' ? this.data.areaText : '',
    });
    this.setData({
      currentAreaId: -1,
      currentRegionId: -1,
      regionText:'区域',
      areaText:'面积',
    });
    wx.switchTab({
      url: '../homeSource/homeSource'
    });
  },
  searchLot(e){
    var type = e.currentTarget.dataset.type;
    var obj = {};
    var filterText = {
      subwayPerimeter:'地铁周边',
      landmarkBuilding:'5A写字楼',
      office:'创意园',
      creativeGarden:'地标建筑'
    };
    obj[type] = 0;
    util.setStorage('searchObj',obj);
    util.setStorage('filterText',{
      filterText:filterText[type],
    });
    wx.switchTab({
      url: '../homeSource/homeSource'
    });
  },
  searchGroup(e){
    var dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../homeFilterList/homeFilterList?groupId=${dataset.id}&type=${dataset.type}`
    });
  },
  goHomeDetail(e){
    wx.navigateTo({
      url: `../homeDetail/homeDetail?id=${e.currentTarget.dataset.id}`
    })
  },
  //定位
  position(availableCity){
    const that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        util.qqMap.reverseGeocoder({
          location:{latitude:latitude,longitude:longitude},
          success:function(res){
            var city = res.result.address_component.city;
            if(availableCity.indexOf(city) > -1){
              app.setGlobalData('serverCity',city);
              that.setData({
                serverCity:city
              })
            }else{
              app.setGlobalData('serverCity','广州市');
              that.setData({
                serverCity:'广州市'
              })
            }
            that.getCondition();
          },
          fail:function(err){
            util.alert({content:JSON.stringify(err)});
          }
        })
      }
    })
  },
  //获取
  getCondition(){
    var that = this;
    app.getCondition(res=>{
      util.hiddenLoading(loadingTimer);
      that.setData({
        currentArea:res.area.allChildrenKeyword,
        currentRegion:res.region.allChildrenKeyword
      });

    })
  },
  onLoad: function () {
    if(!onLoadend){
      loadingTimer = util.showLoading();
      http.get('/api/home/index').then(res=>{
        onLoadend = true;
        this.position(res.data.citys);
        this.setData({
          dataObj:res.data
        })
      })
    }
  },
  onShow(){
    if(onLoadend){
      http.get('/api/home/index').then(res=>{
        this.setData({
          dataObj:res.data
        })
      })
    };
  },
//辅助函数
  auxiliary(){

  },
  onHide(){
    this.setData({
      showRegionSelect:false,
      showAreaSelect:false,
    })
  }
});
