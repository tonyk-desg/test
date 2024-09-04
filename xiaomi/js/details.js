/**
 * 商品详情页构建
 */
function bulidDetailInfo() {
    var productId = getsearch('productId');
    productDetail({
        productId: productId,
    }, function (res) {
        initProductDetail(res.data)
    })
}

/**
 * 商品详情页初始化
 * @param {*} data 
 */
function initProductDetail(data) {
    //商品名称
    $('.shopping-name').text(data.productName);
    //商品轮播图图片初始化
    initBanner(data);
    //商品详情
    $('.shopping-detalis').text(data.productIntro);
    //商品价格
    $('.shopping-price span').eq(0).text(data.productPrice+'元');
    $('.shopping-price span').eq(1).text(data.productSellingPrice+'元');
    
    $('.box-line-frist-price span').eq(0).text(data.productPrice+'元');
    $('.box-line-frist-price span').eq(1).text(data.productSellingPrice+'元');

    $('.price-total').text('总计：'+data.productPrice+'元')
}

/**
 * 初始化轮播图
 */
function initBanner(data) {
    var curIndex = 0;

    listBanner({}, function (res) {
        data.pictures.forEach(function (ele, index) {
            $('.banner').append( `<li><img src="${BASE_URL}/${ele.productPicture}" alt=""></li>`)
            $('.slider-control').append(`<li></li>`)
        })
        $('.slider-control li').eq(0).addClass('btn-ative')
        //定时器
        var timer = setInterval(autoBanner, 3000, data.pictures.length);
        buildBannerChange(data.pictures.length, timer);
    })
    /**
     * banner自动移动
     * @param {*} total 
     */
    function autoBanner(total) {
        curIndex = curIndex == total - 1 ? 0 : curIndex + 1

        $('.banner').css('transform', `translatex(${-curIndex * 520}px)`)
        $('.slider-control li').removeClass('btn-ative')
        $('.slider-control li').eq(curIndex).addClass('btn-ative')
        return curIndex
    }
    /**
     * 构建轮播图按钮功能
     * @param {*} total 
     * @param {*} timer 
     */
    function buildBannerChange(total, timer) {
        //点击上一张
        $('.prev-btn').on('click', function () {
            /* 取消定时器 */
            clearInterval(timer);
            curIndex = curIndex == 0 ? total - 1 : curIndex - 1
            /* 移动banner */
            $('.banner').css('transform', `translatex(${-curIndex * 520}px)`)
            /* 更改下标按钮样式 */
            $('.slider-control li').removeClass('btn-ative')
            $('.slider-control li').eq(curIndex).addClass('btn-ative')
            /* 激活定时器 */
            timer = setInterval(autoBanner, 3000, total);
            return curIndex
        })
        //点击下一张
        $('.next-btn').on('click', function () {
            /* 取消定时器 */
            clearInterval(timer);
            curIndex = curIndex == total - 1 ? 0 : curIndex + 1
            /* 移动banner */
            $('.banner').css('transform', `translatex(${-curIndex * 520}px)`)
            /* 更改下标按钮样式 */
            $('.slider-control li').removeClass('btn-ative')
            $('.slider-control li').eq(curIndex).addClass('btn-ative')
            /* 激活定时器 */
            timer = setInterval(autoBanner, 3000, total);
            return curIndex
        })
        $('.slider-control li').each(function (index, ele) {
            $(ele).on('click', function () {
                /* 取消定时器 */
                clearInterval(timer);
                /* 移动banner */
                $('.banner').css('transform', `translatex(${-index * 520}px)`)
                /* 更改下标按钮样式 */
                $('.slider-control li').removeClass('btn-ative')
                $('.slider-control li').eq(index).addClass('btn-ative')
                curIndex = index
                /* 激活定时器 */
                timer = setInterval(autoBanner, 3000, total);
                return curIndex
            })
        })

    }
}

//购买按钮事件
function buyproduct(){

    if(!$.cookie('xiaomi-token'))return alert('请先登录')

    buyProduct({productId:Number(getsearch('productId'))},function(res){
        alert(res.msg)
    })
}

/**
 * 用来控制窗口的显示与隐藏
 * @param {Boolean} visible 显示或隐藏
 * @param {String} selected css选择器
 */
function dialogVisible(visible, selected) {
    $(selected).css('display', visible ? 'block' : 'none')
    $('.input-row input').val('');
    $('.err-msg').text('');
}


//入口函数
$(function () {
    bulidDetailInfo();
})