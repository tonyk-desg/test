//全局配置前缀
var BASE_URL = 'http://www.codeedu.com.cn';

/**
 * 封装AJAX
 * @param {String} type 请求类型
 * @param {String} url 接口地址
 * @param {Object} data 参数
 * @param {Function} callback 回调函数
 */
function getAjacx(type, url, data, callback,isToken) {
 var contentType = type == 'POST' ? 'application/json' : 'application/x-www-form-urlencoded'   
    //判断是否为true添加token
    var headers =isToken ? { Authorization : $.cookie('xiaomi-token')} : ''
    
    if (Object.values(data).length >0){
        data = JSON.stringify(data)
    }

    $.ajax({
        type: type,
        url: BASE_URL + url,
        // 请求数据类型
        contentType,
        headers,
        data: data,
        success: function (res) {
            //请求成功，调用传入的会掉函数
            if(typeof callback =='function')
            callback(res)
        },
        error: function (err) {
            console.log(err)
        }
    })
}

/**
 * 用户注册
 * @param {Object} data 
 * @param {Function} callback 
 */
function userRegister(data,callback) {
    getAjacx('POST','/xiaomi/v1/ms/user/register',data,callback);
   
}

/**
 * 用户登录
 * @param {Object} data 
 * @param {Function} callback 
 */
function userLogin(data,callback) {
    getAjacx('POST','/xiaomi/v1/ms/user/login',data,callback);
   
}

/**
 * 个人信息
 * @param {Object} data 
 * @param {Function} callback 
 */
function userInfo(data,callback) {
    getAjacx('GET','/xiaomi/v1/ms/user/info',data,callback,true);
   
}


/**
 * 查询轮播图列表
 * @param {Object} data 
 * @param {Function} callback 
 */
function listBanner(data,callback) {
    getAjacx('GET','/xiaomi/v1/carousel',data,callback);
   
}

/**
 * 查询商品列表
 * @param {Object} data 
 * @param {Function} callback 
 */
function hotProduct(data,callback) {
    getAjacx('GET','/xiaomi/v1/product/hot',data,callback);
   
}

/**
 * 查询商品详情
 * @param {Object} data 
 * @param {Function} callback 
 */
function productDetail(data,callback) {

    var productId= data.productId
    //删除对象属性  
    delete data.productId
    getAjacx('GET',`/xiaomi/v1/product/${productId}`,data,callback);
   
}

/**
 * 购买商品
 * @param {Object} data 
 * @param {Function} callback 
 */
function buyProduct(data,callback) {
    getAjacx('POST',`/xiaomi/v1/product/buy`,data,callback,true);
   
}