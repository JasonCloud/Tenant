const app = getApp();
const http = require('../../utils/http');
Page({
    data:{
        btnDisabled:true,
        name:'',
        mobile:'',
        estate:'',
        size:'',
        rent:'',
        province:'',
        city:'',
        county:''
    },
    onShow(){
        app.getCondition(res=>{
            console.log(res);
        })
    },
    submit(event){
        var name = event.detail.value.name;
        var mobile = event.detail.value.mobile;
        var estateName = event.detail.value.estateName;
        var size = event.detail.value.size;
        var rent = event.detail.value.rent;
        console.log(name,mobile,estateName,size,rent);
        http.post('/api/home/attorney',{
            propertyName:name,
            propertyPhone:mobile,
            buildName:estateName,
            area:size,
            rent:rent,
            province:this.data.province,
            city:this.data.city,
            county:this.data.county
        },true).then(res=>{

        })
    },
    input(e){
        var value = e.detail.value;
        var type = e.currentTarget.dataset.type;
        switch (type){
            case 'name':
                this.setData({name:value});
                break;
            case 'mobile':
                this.setData({mobile:value});
                break;
            case 'estate':
                this.setData({estate:value});
                break;
            case 'size':
                this.setData({size:value});
                break
            case 'rent':
                this.setData({rent:value});
                break;
        }
        if(this.data.name && this.data.mobile && this.data.estate && this.data.size &&this.data.rent){
            this.setData({
                btnDisabled: false
            })
        }else{
            this.setData({
                btnDisabled: true
            })
        }
    }
})