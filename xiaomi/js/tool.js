//工具函数

/**
 * 
 * @param {String} key 地址参数
 * @returns 
 */
function getsearch(key) {
    var obj = {}
    //链式编程
    window
        .decodeURI(location.search)
        .slice(1, location.search.length)
        .split('&').
        forEach(function (ele) {
            var keyvalue = ele.split('=')
            obj[keyvalue[0]] = keyvalue[1]
        })
    return obj[key]
}