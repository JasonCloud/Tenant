// pages/homeDetail/homeDetail.js
const http = require('../../utils/http');
const util = require('../../utils/util');
Page({
  data:{
    id:null, //保存当前大夏id
    indicatorDots:true,
    autoplay:true, //滚动图是否自动播放
    interval:4000,
    duration:500,
    allList:[], //全部户型数据
    list:[], //当前显示的户型数据
    filterList:[],
    mask:false,
    page_num:1, //接口页码
    detail_obj:{}, //详情数据
    detailObject:{},
    phone_num:'', //咨询电话
    btnType:'prevlook',
    imgUrls:[
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494154720483&di=189fc9c3663d9580aecf139880bf8623&imgtype=0&src=http%3A%2F%2Fimage.tianjimedia.com%2FuploadImages%2F2015%2F028%2F31%2FQ3U828G33506.JPEG',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494154720482&di=ecd977d0df516af5cddcbd392e07c1a3&imgtype=0&src=http%3A%2F%2Fimage.tianjimedia.com%2FuploadImages%2F2015%2F028%2F22%2FP822ETRKJOU0.JPEG',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494154720482&di=cf09b5974e321ce3aa9a580ba95923b9&imgtype=0&src=http%3A%2F%2Fimage.tianjimedia.com%2FuploadImages%2F2015%2F028%2F25%2F6Q1AIE18139Y.JPEG',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494154720482&di=24b13864d742c8e6fcc516eb7bd9dcb9&imgtype=0&src=http%3A%2F%2Fimage.tianjimedia.com%2FuploadImages%2F2015%2F028%2F28%2FIW4C75336797.JPEG'
    ],
    areaState:0,
    showSeeMore:false ,
   },
  //预约看房提交
  formSubmit(e){
     var name = e.detail.value.nickname;
     var phone = e.detail.value.phone;
    http.post('/api/apply/wechat/order',{tenantsName:name,tenantsPhone:phone,mansionId:this.data.id},true).then(res=>{
      this.formReset();
      util.alert({content:'预约成功！我们将安排专业顾问带你看房，请内心等待～'});
    }).catch(err=>{
        util.alert({content:JSON.stringify(err)})
    })
  },
  //取消预约看房
  formReset(e){
    this.setData({
      mask:false
    })
  },
  control_mask(){
    console.log(999);
    this.setData({
      mask:!this.data.mask
    })
  },
  //辅助函数,防止事件冒泡
  prevent(){

  },
  //咨询
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
  //查看户型详情
  houseLook(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:`../houseLook/houseLook?id=${id}`
    })

  },
    //房源面积筛选 state: 0 全部 ,1 0-100平, 2 100-200平,3 200-300平, 4 300-500平
    areaFilter(e){
        let state = e.currentTarget.dataset.state;
        this.setData({areaState:state});
        if(state == 0){
            this.setData({
                showSeeMore: this.data.list.length == this.data.allList.length ? false : true,
            });
        }else if(state == 1){
            let list = this.data.allList.filter(function(item){
                if(item.totalArea > 0 && item.totalArea <= 100){
                    return item;
                }
            });
            this.setData({
                filterList:list.length > 5 ? list.splice(0,5) : list,
                showSeeMore: list.length > 5 ? true : false
            })
        }else if(state == 2){
            let list = this.data.allList.filter(function(item){
                if(item.totalArea > 100 && item.totalArea <= 200){
                    return item;
                }
            });
            this.setData({
                filterList:list.length > 5 ? list.splice(0,5) : list,
                showSeeMore: list.length > 5 ? true : false
            })
        }
        else if(state == 3){
            let list = this.data.allList.filter(function(item){
                if(item.totalArea > 200 && item.totalArea <= 300){
                    return item;
                }
            });
            this.setData({
                filterList:list.length > 5 ? list.splice(0,5) : list,
                showSeeMore: list.length > 5 ? true : false
            })
        }
        else if(state == 4){
            let list = this.data.allList.filter(function(item){
                if(item.totalArea > 300 && item.totalArea <= 500){
                    return item;
                }
            });
            this.setData({
                filterList:list.length > 5 ? list.splice(0,5) : list,
                showSeeMore: list.length > 5 ? true : false
            })
        }else if(state == 5){
            let list = this.data.allList.filter(function(item){
                if(item.totalArea > 500){
                    return item;
                }
            });
            this.setData({
                filterList:list.length > 5 ? list.splice(0,5) : list,
                showSeeMore: list.length > 5 ? true : false
            })
        }
    },
  //查看更多
  seeMore(){
      let state = this.data.areaState;
      if(state == 0){
          this.setData({
              list: this.data.allList.length > this.data.list.length ? this.data.list.concat(this.data.allList.splice(this.data.list.length,5)) : this.data.allList,
          })
          this.setData({
              showSeeMore: this.data.allList.length > this.data.list.length ? false : true
          })
      }else if(state == 1){
          let list = this.data.allList.filter(function(item){
              if(item.totalArea > 0 && item.totalArea <= 100){
                  return item;
              }
          });
          this.setData({
              filterList:this.data.filterList.length < list.length ? this.data.filterList.concat(list.splice(0,5)): list ,
          })
          let showSeeMore = this.data.filterList.length < list.length ? true : false;
          this.setData({
              showSeeMore:showSeeMore
          })
      }else if(state == 2){
          let list = this.data.allList.filter(function(item){
              if(item.totalArea > 100 && item.totalArea <= 200){
                  return item;
              }
          });
          this.setData({
              filterList:this.data.filterList.length < list.length ? this.data.filterList.concat(list.splice(0,5)): list ,
          })
          let showSeeMore = this.data.filterList.length < list.length ? true : false;
          this.setData({
              showSeeMore:showSeeMore
          })
      }
      else if(state == 3){
          let list = this.data.allList.filter(function(item){
              if(item.totalArea > 200 && item.totalArea <= 300){
                  return item;
              }
          });
          this.setData({
              filterList:this.data.filterList.length < list.length ? this.data.filterList.concat(list.splice(0,5)): list ,
          })
          let showSeeMore = this.data.filterList.length < list.length ? true : false;
          this.setData({
              showSeeMore:showSeeMore
          })
      }
      else if(state == 4){
          let list = this.data.allList.filter(function(item){
              if(item.totalArea > 300 && item.totalArea <= 500){
                  return item;
              }
          });
          this.setData({
              filterList:this.data.filterList.length < list.length ? this.data.filterList.concat(list.splice(0,5)): list ,
          })
          let showSeeMore = this.data.filterList.length < list.length ? true : false;
          this.setData({
              showSeeMore:showSeeMore
          })
      }else if(state == 5){
          let list = this.data.allList.filter(function(item){
              if(item.totalArea > 500){
                  return item;
              }
          });
          this.setData({
              filterList:this.data.filterList.length < list.length ? this.data.filterList.concat(list.splice(0,5)): list ,
          })
          let showSeeMore = this.data.filterList.length < list.length ? true : false;
          this.setData({
              showSeeMore:showSeeMore
          })
      }
  },
  get_house_detail(id){
    http.get('/api/mansion/detail',{id:id}).then(res => {
      let obj = this.initDetailData(res.data);
      this.setData({
        detailObject: obj,
        phone_num:obj.telephone,
        list:obj.apartments.length > 5 ? obj.apartments.splice(0,5) : obj.apartments,
        allList: obj.apartments,
        showSeeMore: obj.apartments.length > 5 ? true : false
      })
    }).catch(res =>{

    })
  },
  initDetailData(obj){
    if(!obj) return {};
    obj.price = obj.price.replace(/\D/g,'');
    obj.orders = obj.orders.map(function(item){
      item.price = item .price.replace(/\D/g,'');
      return item;
    });
    return obj;
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.get_house_detail(options.id);
    this.setData({id:options.id});
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