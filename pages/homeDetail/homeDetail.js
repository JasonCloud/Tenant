// pages/homeDetail/homeDetail.js
const http = require('../../utils/http');
const util = require('../../utils/util');
let loadingTimer = null; //加载动画
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
    list_page_num:1,
    detail_obj:{}, //详情数据
    detailObject:{},
    phone_num:'', //咨询电话
    btnType:'prevlook',
    areaState:0,
    showSeeMore:false ,
    onLoadend:false, //标记数据是否加载完
    groups:[{"id":30,"name":"七号小镇创意园","image":"https://zua.51feijin.com/store/product/1498138564448.png","area":null,"minArea":0,"maxArea":0,"region":"番禺区-万博/南村","price":"0.0","highlight":1,"addTop":1,"hot":1,"apartmentCount":3,"labels":[{"name":"第五代创意园"}]},{"id":15,"name":"保利洛克维","image":"https://zua.51feijin.com/store/product/1497781487106.png","area":null,"minArea":311,"maxArea":311,"region":"天河区-珠江新城","price":"43540.0","highlight":1,"addTop":1,"hot":1,"apartmentCount":26,"labels":[{"name":"地铁口"},{"name":"方正实用"}]},{"id":129,"name":"中旅商务大厦","image":"https://zua.51feijin.com/store/product/1498617192478.jpg","area":null,"minArea":0,"maxArea":0,"region":"天河区-林和","price":"0.0","highlight":0,"addTop":0,"hot":0,"apartmentCount":0,"labels":[{"name":"甲级写字楼"}]},{"id":81,"name":"中泰北塔大厦","image":"https://zua.51feijin.com/store/product/1498468614718.jpg","area":null,"minArea":0,"maxArea":0,"region":"天河区-林和","price":"0.0","highlight":0,"addTop":0,"hot":0,"apartmentCount":3,"labels":[{"name":"甲级写字楼"}]},{"id":80,"name":"新达成广场","image":"https://zua.51feijin.com/store/product/1498468133697.jpg","area":null,"minArea":0,"maxArea":0,"region":"越秀区-环市东/区庄","price":"0.0","highlight":0,"addTop":0,"hot":0,"apartmentCount":0,"labels":[{"name":"甲级写字楼"}]},{"id":79,"name":"宜安大厦","image":"https://zua.51feijin.com/store/product/1498466761935.jpg","area":null,"minArea":0,"maxArea":0,"region":"越秀区-环市东/区庄","price":"0.0","highlight":0,"addTop":0,"hot":0,"apartmentCount":0,"labels":[{"name":"甲级写字楼"}]},{"id":78,"name":"天伦大厦","image":"https://zua.51feijin.com/store/product/1498466392643.jpg","area":null,"minArea":0,"maxArea":0,"region":"越秀区-环市东/区庄","price":"0.0","highlight":0,"addTop":0,"hot":0,"apartmentCount":3,"labels":[{"name":"甲级写字楼"}]},{"id":77,"name":"创举商务大厦","image":"https://zua.51feijin.com/store/product/1498466080927.jpg","area":null,"minArea":0,"maxArea":0,"region":"越秀区-北京路商圈","price":"0.0","highlight":0,"addTop":0,"hot":0,"apartmentCount":0,"labels":[{"name":"甲级写字楼"}]},{"id":76,"name":"凯华国际中心","image":"https://zua.51feijin.com/store/product/1498466014333.png","area":null,"minArea":0,"maxArea":0,"region":"天河区-珠江新城","price":"0.0","highlight":0,"addTop":0,"hot":0,"apartmentCount":0,"labels":[{"name":"超甲级写字楼"}]},{"id":75,"name":"中侨大厦","image":"https://zua.51feijin.com/store/product/1498465692646.jpg","area":null,"minArea":0,"maxArea":0,"region":"越秀区-环市东/区庄","price":"0.0","highlight":0,"addTop":0,"hot":0,"apartmentCount":0,"labels":[{"name":"甲级写字楼"}]}]
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
      mask:false,
      btnType:'zi_xun'
    });
      this.call();
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
                // showSeeMore: this.data.list.length == this.data.allList.length ? false : true,
            });
        }else if(state == 1){
            let list = this.data.allList.filter(function(item){
                if(item.totalArea > 0 && item.totalArea <= 100){
                    return item;
                }
            });
            this.setData({
                filterList:list
                // filterList:list.length > 5 ? list.splice(0,5) : list,
                // showSeeMore: list.length > 5 ? true : false
            })
        }else if(state == 2){
            let list = this.data.allList.filter(function(item){
                if(item.totalArea > 100 && item.totalArea <= 200){
                    return item;
                }
            });
            this.setData({
                filterList:list
                // filterList:list.length > 5 ? list.splice(0,5) : list,
                // showSeeMore: list.length > 5 ? true : false
            })
        }
        else if(state == 3){
            let list = this.data.allList.filter(function(item){
                if(item.totalArea > 200 && item.totalArea <= 300){
                    return item;
                }
            });
            this.setData({
                filterList:list,
                // filterList:list.length > 5 ? list.splice(0,5) : list,
                // showSeeMore: list.length > 5 ? true : false
            })
        }
        else if(state == 4){
            let list = this.data.allList.filter(function(item){
                if(item.totalArea > 300 && item.totalArea <= 500){
                    return item;
                }
            });
            this.setData({
                filterList:list
                // filterList:list.length > 5 ? list.splice(0,5) : list,
                // showSeeMore: list.length > 5 ? true : false
            })
        }else if(state == 5){
            let list = this.data.allList.filter(function(item){
                if(item.totalArea > 500){
                    return item;
                }
            });
            this.setData({
                // filterList:list.length > 5 ? list.splice(0,5) : list,
                filterList:list
                // showSeeMore: list.length > 5 ? true : false
            })
        }
    },
  //查看更多
  // seeMore(){
  //     let state = this.data.areaState;
  //     if(state == 0){
  //         this.setData({
  //             list: this.data.allList.length > this.data.list.length ? this.data.list.concat(this.data.allList.splice(this.data.list.length,5)) : this.data.allList,
  //         })
  //         this.setData({
  //             showSeeMore: this.data.allList.length > this.data.list.length ? false : true
  //         })
  //     }else if(state == 1){
  //         let list = this.data.allList.filter(function(item){
  //             if(item.totalArea > 0 && item.totalArea <= 100){
  //                 return item;
  //             }
  //         });
  //         this.setData({
  //             filterList:this.data.filterList.length < list.length ? this.data.filterList.concat(list.splice(0,5)): list ,
  //         })
  //         let showSeeMore = this.data.filterList.length < list.length ? true : false;
  //         this.setData({
  //             showSeeMore:showSeeMore
  //         })
  //     }else if(state == 2){
  //         let list = this.data.allList.filter(function(item){
  //             if(item.totalArea > 100 && item.totalArea <= 200){
  //                 return item;
  //             }
  //         });
  //         this.setData({
  //             filterList:this.data.filterList.length < list.length ? this.data.filterList.concat(list.splice(0,5)): list ,
  //         })
  //         let showSeeMore = this.data.filterList.length < list.length ? true : false;
  //         this.setData({
  //             showSeeMore:showSeeMore
  //         })
  //     }
  //     else if(state == 3){
  //         let list = this.data.allList.filter(function(item){
  //             if(item.totalArea > 200 && item.totalArea <= 300){
  //                 return item;
  //             }
  //         });
  //         this.setData({
  //             filterList:this.data.filterList.length < list.length ? this.data.filterList.concat(list.splice(0,5)): list ,
  //         })
  //         let showSeeMore = this.data.filterList.length < list.length ? true : false;
  //         this.setData({
  //             showSeeMore:showSeeMore
  //         })
  //     }
  //     else if(state == 4){
  //         let list = this.data.allList.filter(function(item){
  //             if(item.totalArea > 300 && item.totalArea <= 500){
  //                 return item;
  //             }
  //         });
  //         this.setData({
  //             filterList:this.data.filterList.length < list.length ? this.data.filterList.concat(list.splice(0,5)): list ,
  //         })
  //         let showSeeMore = this.data.filterList.length < list.length ? true : false;
  //         this.setData({
  //             showSeeMore:showSeeMore
  //         })
  //     }else if(state == 5){
  //         let list = this.data.allList.filter(function(item){
  //             if(item.totalArea > 500){
  //                 return item;
  //             }
  //         });
  //         this.setData({
  //             filterList:this.data.filterList.length < list.length ? this.data.filterList.concat(list.splice(0,5)): list ,
  //         })
  //         let showSeeMore = this.data.filterList.length < list.length ? true : false;
  //         this.setData({
  //             showSeeMore:showSeeMore
  //         })
  //     }
  // },
    seeMore(e,reset=false,pageSize=3){
        http.get('/api/apartment/list',{pageNo:this.data.list_page_num,mansionId:this.data.id,pageSize:pageSize}).then(res=>{
            let resList = res.data.result;
            let state = this.data.areaState;
            let list = this.data.list;
            let allList = this.data.allList;
            let filterList = this.data.filterList;
            if(resList.length >= pageSize){
                this.setData({
                    list_page_num: this.data.list_page_num + 1 ,

                })
            }
            console.log(reset);
                if(state == 0){
                    this.setData({
                        list:reset ? resList : list.concat(resList),
                        allList:reset ? resList : allList.concat(resList),
                        showSeeMore:resList.length >= pageSize ? true :false
                    });
                }else if(state == 1){
                    let listIn = resList.filter(function(item){
                        if(item.totalArea > 0 && item.totalArea <= 100){
                            return item;
                        }
                    });
                    this.setData({
                        list:reset ? resList : list.concat(resList),
                        allList:reset ? resList : allList.concat(resList),
                        filterList:filterList.concat(listIn),
                        showSeeMore:resList.length >= pageSize ? true :false
                    });
                }else if(state == 2){
                    let listIn = resList.filter(function(item){
                        if(item.totalArea > 100 && item.totalArea <= 200){
                            return item;
                        }
                    });
                    this.setData({
                        list:reset ? resList : list.concat(resList),
                        allList:reset ? resList : allList.concat(resList),
                        filterList:filterList.concat(listIn),
                        showSeeMore:resList.length >= pageSize ? true :false
                    });
                }
                else if(state == 3){
                    let listIn = resList.filter(function(item){
                        if(item.totalArea > 200 && item.totalArea <= 300){
                            return item;
                        }
                    });
                    this.setData({
                        list:reset ? resList : list.concat(resList),
                        allList:reset ? resList : allList.concat(resList),
                        filterList:filterList.concat(listIn),
                        showSeeMore:resList.length >= pageSize ? true :false
                    });
                }
                else if(state == 4){
                    let listIn = resList.filter(function(item){
                        if(item.totalArea > 300 && item.totalArea <= 500){
                            return item;
                        }
                    });
                    this.setData({
                        list:reset ? resList : list.concat(resList),
                        allList:reset ? resList : allList.concat(resList),
                        filterList:filterList.concat(listIn),
                        showSeeMore:resList.length >= pageSize ? true :false
                    });
                }else if(state == 5){
                    let listIn = resList.filter(function(item){
                        if(item.totalArea > 500){
                            return item;
                        }
                    });
                    this.setData({
                        list:reset ? resList : list.concat(resList),
                        allList:reset ? resList : allList.concat(resList),
                        filterList:filterList.concat(listIn),
                        showSeeMore:resList.length >= pageSize ? true :false
                    });
                }
        })
    },
  get_house_detail(id){
    http.get('/api/mansion/detail',{id:id}).then(res => {
      let obj = this.initDetailData(res.data);
      util.hiddenLoading(loadingTimer);
      this.setData({
        detailObject: obj,
        phone_num:obj.telephone,
        onLoadend:true
        // list:obj.apartments.length > 5 ? obj.apartments.splice(0,5) : obj.apartments,
        // allList: obj.apartments,
        // showSeeMore: obj.apartments.length > 5 ? true : false
      });
    }).catch(res =>{

    })
  },
  initDetailData(obj){
    if(!obj) return {};
    obj.price = obj.price.split('-')[0];
    obj.orders = obj.orders.map(function(item){
      item.price = item .price.replace(/\D/g,'');
      return item;
    });
    return obj;
  },
    //跳转到详情
    gotoDetail(e){
        let id = e.currentTarget.dataset.id;
        let apartmentCount = e.currentTarget.dataset.apartmentcount;
        wx.redirectTo({
            url:`../homeDetail/homeDetail?id=${id}&apartmentCount=${apartmentCount}`
        })
    },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

    this.get_house_detail(options.id);
    this.setData({
        id:options.id,
        apartmentCount:options.apartmentCount
    });
    this.seeMore(undefined,true);
  },
  onReady:function(){
    // 页面渲染完成
      loadingTimer = util.showLoading();
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