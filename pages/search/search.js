const http = require('../../utils/http');
const util = require('../../utils/util');
let timer = null;
Page({
    data:{
        list:[],
        page_num:1,
        searchFlag:false,
        pageSize:10,
        keyword:'',
        fetchAll:false,
        searchHistoryList:[]
    },
    onShow(){
        var historyList = util.getStorage('searchHistory');
        this.setData({
            searchHistoryList:historyList
        })
    },
    //取消
    cancel(){
        wx.navigateBack({
            delta: 1
        })
    },
    //搜索
    searchList(e){
        let keyword = e.detail.value;
        clearTimeout(timer);
        if(!keyword.trim()){
            return
        }
        timer = setTimeout(()=>{
            this.setData({
                page_num:1
            });
            http.get('/api/mansion/list',{pageNo:this.data.page_num,keyword:keyword,pageSize:this.data.pageSize}).then(res=>{
                if(res.data.result >= this.data.pageSize){
                    this.setData({
                        page_num:this.data.page_num + 1
                    })
                }else if(res.data.result < this.data.pageSize){
                    this.setData({
                        fetchAll:true
                    })
                }
                let arr = res.data && res.data.result;
                if(!!arr){
                    arr.forEach(res => {
                        var priceArr = res.price.split('-');
                        res.price = priceArr.length > 1 ? priceArr[0]+res.price.replace(/[\d|-]/g,'').replace('以上','')+'起' : res.price.replace('以上','起');
                    })
                }
                var historyList = util.getStorage('searchHistory');
                if(historyList && Array.isArray(historyList)){
                    if(historyList.length < 10){
                        historyList.unshift(keyword)
                    }else{
                        historyList.unshift(keyword);
                        historyList.pop()
                    }
                }else{
                    historyList = [keyword]
                }
                util.setStorage('searchHistory',historyList);
                this.setData({
                    list:arr,
                    searchFlag:true,
                    keyword:keyword,
                })
            })
        },1500)
    },
    //清除搜索历史记录
    clearHistory(){
        util.removeStorage('searchHistory');
        var history = util.getStorage('searchHistory') || [];
        this.setData({
            searchHistoryList:history
        });
        util.alert({content:'清除成功!'});
    },
    //点击搜索记录
    tapHistory(e){
        var keyword = e.currentTarget.dataset.keyword;
        http.get('/api/mansion/list',{pageNo:this.data.page_num,keyword:keyword,pageSize:this.data.pageSize}).then(res=>{
            if(res.data.result >= this.data.pageSize){
                this.setData({
                    page_num:this.data.page_num + 1
                })
            }else if(res.data.result < this.data.pageSize){
                this.setData({
                    fetchAll:true
                })
            }
            let arr = res.data && res.data.result;
            if(!!arr){
                arr.forEach(res => {
                    var priceArr = res.price.split('-');
                    res.price = priceArr.length > 1 ? priceArr[0]+res.price.replace(/[\d|-]/g,'').replace('以上','')+'起' : res.price.replace('以上','起');
                })
            }
            this.setData({
                list:arr,
                searchFlag:true,
                keyword:keyword,
            })
        })
    },
    //跳转到详情
    gotoDetail(e){
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url:"../homeDetail/homeDetail?id="+id
        })
    },
    onReachBottom: function() {
        // Do something when page reach bottom.
        if(this.data.page_num <= 1 || this.data.fetchAll){
            return
        }
        let currPageNum = this.data.page_num;
        http.get('/api/mansion/list',{pageNo:this.data.page_num,keyword:this.data.keyword,pageSize:this.data.pageSize}).then(res=>{
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
                    res.price = res.price.replace(/\D/g,'')
                })
            }
            arr = this.data.list.concat(arr);
            this.setData({
                list:arr
            })
        })
    },
})