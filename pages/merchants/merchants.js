const http = require('../../utils/http');
const util = require('../../utils/util');
let loadingTimer = null;
Page({
    data:{
        showBasic: true, //true显示基本信息,false显示身份证上传
        province:[], //省份
        city:{}, //所有城市
        cityArr:[], //当前城市
        area:{}, //所有区域
        areaArr:[], //当前区域
        showAddressSelect:false, //是否显示地址选择器
        provinceName:'', //选中的省份名
        cityName:'', //选中的城市名
        areaName:'', //选中的区名
        serverCityName:'',
        name:'',
        mobile:'',
        basicDisable:true,
        resume:'',
        positive:'',//正面身份证
        negative:'',//反面身份证
        handHeld:'',//手持
        IdCarDisabled: true,
        chooseImage: false,
        imageType:'positive',
        showSubmitSuccess:false,
        textareaInput:false
    },
    onLoad(options){
        this.setData({
            province:util.province,
            city:util.city,
            area:util.area,
            cityArr:util.city[util.province[0].id],
            areaArr:util.area[util.city[util.province[0].id][0].id]
        })
    },
    //检测是否可以进行下一步
    judgment(){
        var data = this.data;
        if(data.name && data.mobile && data.resume && data.provinceName){
            this.setData({
                basicDisable:false
            })
        }else{
            this.setData({
                basicDisable:true
            })
        }
    },
    //下一步
    next(){
        this.setData({
            showBasic: false
        })
    },
    focusAndBlur(e){
        if(e.type == 'focus'){
            this.setData({textareaInput:true});
        }else if(e.type == 'blur'){
            this.setData({textareaInput:false});
        }
    },
    //提交成功
    submitSuccess(){
        this.setData({
            showSubmitSuccess: false
        })
    },
    //所有输入框输入保存
    inputEnter(e){
        var type = e.currentTarget.dataset.type;
        var value = e.detail.value;
        switch (type){
            case 'name':
                this.setData({
                    name:value
                })
                break;
            case 'mobile':
                this.setData({
                    mobile:value
                })
                break;
            case 'resume':
                this.setData({
                    resume:value
                })
                break;
        }
        this.judgment();
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
    //显示选择图片
    showChooseImage(e){
        var type = e.currentTarget.dataset.type;
        this.setData({
            chooseImage: true,
            imageType: type
        })
    },
    hiddenChooseImage(){
        this.setData({
            chooseImage: false,
        })
    },
    //拍照
    camera(){
        var that = this;
        this.hiddenChooseImage();
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                var type = that.data.imageType;
                console.log(tempFilePaths);
                if(type == 'positive'){
                    that.setData({
                        positive:tempFilePaths[0]
                    })
                }else if(type == 'negative'){
                    that.setData({
                        negative:tempFilePaths[0]
                    })
                }else if(type == 'handHeld'){
                    that.setData({
                        handHeld:tempFilePaths[0]
                    })
                }
                that.judgmentSubmit();
            }
        });

    },
    //相册
    album(){
        var that = this;
        this.hiddenChooseImage();
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                var type = that.data.imageType;
                if(type == 'positive'){
                    that.setData({
                        positive:tempFilePaths[0]
                    })
                }else if(type == 'negative'){
                    that.setData({
                        negative:tempFilePaths[0]
                    })
                }else if(type == 'handHeld'){
                    that.setData({
                        handHeld:tempFilePaths[0]
                    })
                }
                that.judgmentSubmit();
            },
        });
    },
    uploadImage(cb){
        var that = this;
        var positiveServerName = null,
            negativeServerName = null,
            handHeldServerName = null;
        wx.uploadFile({
            url: http.src + '/api/upload/image', //仅为示例，非真实的接口地址
            filePath: that.data.positive,
            name: 'file',
            header:{'content-type':'multipart/form-data'},
            success: function(res){
                var data = JSON.parse(res.data).data;
                positiveServerName = data.name
            },
            fail: function(err){
                console.log(err)
            }
        });
        wx.uploadFile({
            url: http.src + '/api/upload/image', //仅为示例，非真实的接口地址
            filePath: that.data.negative,
            name: 'file',
            success: function(res){
                var data = JSON.parse(res.data).data;
                negativeServerName = data.name
            },
            fail: function(err){
                console.log(err)
            }
        });
        wx.uploadFile({
            url: http.src + '/api/upload/image', //仅为示例，非真实的接口地址
            filePath: that.data.negative,
            name: 'file',
            success: function(res){
                var data = JSON.parse(res.data).data;
                handHeldServerName = data.name
            },
            fail: function(err){
                console.log(err)
            }
        });
        var timer = setInterval(()=>{
            if(positiveServerName && negativeServerName && handHeldServerName){
                var obj = {
                    faceIdcard:positiveServerName,
                    conIdcard: negativeServerName,
                    allIdcard: handHeldServerName
                };
                cb && typeof cb == 'function'&&cb(obj);
                clearInterval(timer);
            }
        },500)
    },
    //检查是否可以提交
    judgmentSubmit(){
        var data = this.data;
        if(data.positive && data.negative && data.handHeld){
            this.setData({
                IdCarDisabled:false
            })
        }else{
            this.setData({
                IdCarDisabled:true
            })
        }
    },
    //提交
    submit(){
        loadingTimer = util.showLoading('正在提交');
        var data = this.data;
        var obj = {
            propertyName:data.name,
            propertyPhone:data.mobile,
            province:data.provinceName,
            city:data.cityName,
            county:data.areaName,
            resume:data.resume
        };
        this.uploadImage(res=>{
            util.hiddenLoading(loadingTimer);
            Object.assign(obj,res);
            http.post('/api/home/merchants',obj,true).then(res=>{
                util.alert({content:'提交成功，我们将以最快速度联系您，请耐心等待~'}).then(res=>{
                    if(res.confirm){
                        wx.navigateBack({
                            delta: 5
                        })
                    }
                })
            })
        });
    },
    //辅助函数
    auxiliary(){

    }
})