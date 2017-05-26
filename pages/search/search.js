const http = require('../../utils/http');
Page({
    data:{
        list:[],
        page_num:1,
        searchFlag:false,
        pageSize:10
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
        http.get('/api/mansion/list',{pageNo:this.data.page_num,keyword:keyword,pageSize:this.data.pageSize}).then(res=>{
            let arr = res.data && res.data.result;
            if(!!arr){
                arr.forEach(res => {
                    res.price = res.price.replace(/\D/g,'')
                })
            }
            this.setData({
                list:arr,
                searchFlag:true
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
})