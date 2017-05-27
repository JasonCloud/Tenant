const http = require('../../utils/http');
Page({
    data:{
        list:[],
        page_num:1,
        searchFlag:false,
        pageSize:10,
        keyword:'',
        fetchAll:false
    },
    onShow(){

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
                    res.price = res.price.replace(/\D/g,'')
                })
            }
            this.setData({
                list:arr,
                searchFlag:true,
                keyword:keyword
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