/**
 * Created by suzan on 2017/2/23.
 */
const _Promise = require('./bluebird');
const  util = require('./util');
const src = 'http://zua.51feijin.com';
const ignoreUrl = /(login)|(weixinUserInfo)$/g;
let userInfo = {};
function wxlogin(url,resolve,reject,param,model){
    console.log(url)
    wx.login({
        success:function(res){
            post('/Card/User/login',{code:res.code}).then((data)=>{
                var openid = data.data.openid;
                var unionid = data.data.unionid;
                var token = data.data.token;
                if(!unionid || !token){
                    wx.getUserInfo({
                        success:function(res){
                            var data = JSON.parse(res.rawData);
                            var obj = {
                                headimgurl:data.avatarUrl,
                                nickname:data.nickName,
                                wanted_count:0,
                                help_count:0
                            };
                            // that.data.wxInfo = obj;
                            post('/Card/User/weixinUserInfo',{
                                openid:openid,
                                signature:res.signature,
                                rawData:res.rawData,
                                encryptedData:res.encryptedData,
                                iv:res.iv
                            }).then((res)=>{
                                userInfo.unionId = res.data.unionid;
                                userInfo.openId = openid;
                                userInfo.token = res.data.token;
                                util.setStorage('userInfo',userInfo);
                                requireHttp(url,resolve,reject,param,model)
                            })
                        }
                    })
                }else{
                    userInfo.unionId = unionid;
                    userInfo.openId = openid;
                    userInfo.token = token;
                    util.setStorage('userInfo',userInfo);
                    requireHttp(url,resolve,reject,param,model)
                }
            });
        },
        fail:function(error){
            console.log('====傻了吧，失败了！==')
        }
    });
}
function requireHttp(url,resolve,reject,data,model){
    // var unionid = util.getStorage('userInfo').unionId;
    // var token = util.getStorage('userInfo').token;
    // data.token = token;
    // data.unionid = unionid;
    wx.request({
        url:src + url,
        data:data,
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method:model,
        success:function(res){
            if(res.errMsg=='request:ok'){
                if(res.data.status == 0){
                    resolve(res.data);
                }else{
                    reject(res);
                }
            }else{
                reject(res);
            }
        },
        fail:function(err){
            reject(err);
        }
    });
}
function get(url,obj){
    var data = obj||{};
    // var unionid = util.getStorage('userInfo').unionId;
    // var token = util.getStorage('userInfo').token;
    // if(unionid){
    //     data.unionid = unionid;
    // };
    // if(token){
    //     data.token = token;
    // }
    return new _Promise((resolve,reject)=>{
        requireHttp(url,resolve,reject,data,'GET')
        // if(!!!unionid && !!!token && !!!ignoreUrl.test(url)){
        //     wxlogin(url,resolve,reject,data,'GET');
        // }else {
        //     requireHttp(url,resolve,reject,data,'GET')
        // }
    });
};

function post(url,obj){
    var data = obj||{};
    requireHttp(url,resolve,reject,data,'POST')
    // var unionid = util.getStorage('userInfo').unionId;
    // var token = util.getStorage('userInfo').token;
    // if(unionid){
    //     data.unionid = unionid;
    // };
    // if(token){
    //     data.token = token;
    // }
    // return new _Promise((resolve,reject)=>{
    //     if(!!!unionid && !!!token && !!!ignoreUrl.test(url)){
    //         wxlogin(url,resolve,reject,data,'POST');
    //     }else {
    //         requireHttp(url,resolve,reject,data,'POST')
    //     }
    // });
};

module.exports = {
    src:src,
    get:get,
    post:post
};
