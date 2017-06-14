const http = require('../../utils/http');
const util = require('../../utils/util');
const app = getApp();
let loadingTimer = null;
Page({
    data:{
        list:[],
        fetchAll:false,
        page_num:1,
        pageSize: 10,
        filterObj:{},
        loaded:false
    },
    onLoad(options){
        var obj = {
            groupId:options.groupId,
            cityName:app.globalData.serverCity
        };
        this.loadList(obj,true);
        if(options.type == 1){
            wx.setNavigationBarTitle({
                title: '热门商圈'
            })
        }else if(options.type == 2){
            wx.setNavigationBarTitle({
                title: '团队规模'
            })
        }else if(options.type == 3){
            wx.setNavigationBarTitle({
                title: '办公类型'
            })
        }
        this.setData({
            filterObj:obj
        });
    },
    loadList(obj,reset=false){
        loadingTimer = util.showLoading();
        obj.pageSize = this.data.pageSize;
        http.get('/api/mansion/list',obj).then(res=>{
            util.hiddenLoading(loadingTimer);
            if(res.data.result.length < this.data.pageSize){
                this.setData({
                    fetchAll:true
                })
            }else if(res.data.result.length >= this.data.pageSize){
                this.setData({
                    page_num:this.page_num + 1
                })
            }
            let arr = res.data && res.data.result;
            if(!!arr){
                arr.forEach(res => {
                    res.price = res.price.replace(/\D/g,'')
                })
                this.setData({
                    list:reset ? arr : Array.prototype.concat(this.data.list,arr)
                })
            }
            this.setData({
                loaded:true,
            })
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
    onReachBottom: function() {
        // Do something when page reach bottom.
        if(this.page_num <= 1 || this.data.fetchAll){
            return
        }else{
            let obj = this.data.filterObj;
            obj.pageNo = this.data.page_num;
            this.get_house_list(obj);
        }
    }
});