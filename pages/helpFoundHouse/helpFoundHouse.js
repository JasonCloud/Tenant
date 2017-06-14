const app = getApp();
const http = require('../../utils/http');
const util = require('../../utils/util');
let loadingTimer = null;
Page({
    data:{
        btnDisabled:true,
        name:'',
        mobile:'',
        estate:'',
        size:'',
        rent:'',
        remarks:'',
        provinceName:'',
        cityName:'',
        areaName:'',
        province:[], //省份
        city:{}, //所有城市
        cityArr:[], //当前城市
        area:{}, //所有区域
        areaArr:[], //当前区域
        showAddressSelect:false, //是否显示地址选择器
        serverCityName:'',
        showSubmitSuccess:false
    },
    onLoad(){
        this.setData({
            province:util.province,
            city:util.city,
            area:util.area,
            cityArr:util.city[util.province[0].id],
            areaArr:util.area[util.city[util.province[0].id][0].id]
        })
    },
    submit(){
        loadingTimer = util.showLoading('正在提交');
        var data = this.data;
        var obj = {
            propertyName: data.name,
            propertyPhone: data.mobile,
            area: data.size,
            rent: data.rent,
            province: data.provinceName,
            city: data.cityName,
            county: data.areaName,
            remarks: data.remarks
        };
        console.log(obj);
        http.post('/api/home/findHouse',obj,true).then(res=>{
            util.hiddenLoading(loadingTimer);
            // this.setData({showSubmitSuccess:true})
            util.alert({content:'提交成功，我们将以最快速度联系您，请耐心等待~'}).then(res=>{
                if(res.confirm){
                    wx.navigateBack({
                        delta: 5
                    })
                }
            })
        }).catch(err=>{
            util.alert({content:JSON.stringify(err)})
        })
    },
    //提交成功
    submitSuccess(){
        this.setData({
            showSubmitSuccess: false
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
            case 'remarks':
                this.setData({remarks:value});
                break
        }
        this.judgment();
    },
    //检测是否可以提交
    judgment(){
        var data = this.data;
        if(data.name && data.mobile && data.size && data.rent && data.remarks && data.provinceName){
            this.setData({
                btnDisabled: false
            })
        }else{
            this.setData({
                btnDisabled: true
            })
        }
    },
    //选择地址
    addressChange(e){
        var value = e.detail.value;
        var data = this.data;
        this.setData({
            cityArr: data.city[data.province[value[0]].id],
        });
        this.setData({
            areaArr: data.area[data.cityArr[value[1]].id],
        });
        this.setData({
            serverCityName: data.province[value[0]].name + ' ' + data.cityArr[value[1]].name + ' ' + data.areaArr[value[2]].name,
            provinceName: data.province[value[0]].name,
            cityName: data.cityArr[value[1]].name,
            areaName: data.areaArr[value[2]].name
        })
        this.judgment();
    },
    //隐藏地址选择器
    hiddenAddressSelect(){
        this.setData({
            showAddressSelect: false
        });
    },
    //显示隐藏地址选择器
    showAndHiddenAddressSelect(e){
        var data = this.data;
        var type = e.currentTarget.dataset.type;
        this.setData({
            showAddressSelect: !this.data.showAddressSelect
        });
        if(type == 'confirm' && !data.provinceName && !data.cityName && !data.areaName){
            this.setData({
                serverCityName: data.province[0].name + ' ' + data.cityArr[0].name + ' ' + data.areaArr[0].name,
                provinceName: data.province[0].name,
                cityName: data.cityArr[0].name,
                areaName: data.areaArr[0].name
            })
        }
        if(type == 'cancel'){
            this.setData({
                serverCityName: '请选择服务城市',
                provinceName: '',
                cityName: '',
                areaName: ''
            })
        }
        this.setData({
            cityArr:util.city[util.province[0].id],
            areaArr:util.area[util.city[util.province[0].id][0].id]
        })
        this.judgment();
    },
    //辅助函数
    auxiliary(){

    },
    focus(){
        this.setData({
            showAddressSelect:false
        })
    }
})