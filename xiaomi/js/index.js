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

/**
 * 注册函数
 * 用来校验input的输入值，未通过则提示至输入框下方
 */
function handRegsiter() {
    var usernameVal = validFrom(".register-dialog input[name='username']", {
        //必须输入的参数
        required: true,
        msg: '请输入账号',
        reg: /^[a-zA-Z]{1}[a-zA-Z0-9_]{4,15}$/,
        resMsg: '字母开头,长度5-16之间,允许字母数字下划线'
    })

    var passwordVal = validFrom(".register-dialog input[name='password']", {
        //必须输入的参数
        required: true,
        msg: '请输入密码',
        reg: /^[a-zA-Z]{1}[a-zA-Z0-9_]{5,17}$/,
        resMsg: '字母开头,长度6-18之间,允许字母数字下划线'
    })

    var rePasswordVal = validFrom(".register-dialog input[name='re-password']", {
        //必须输入的参数
        required: true,
        msg: '请再次输入密码',
        reg: /^[a-zA-Z]{1}[a-zA-Z0-9_]{5,17}$/,
        resMsg: '字母开头,长度6-18之间,允许字母数字下划线',
        //自定义校验
        validator: function (inputText) {
            if ($(".register-dialog input[name='password']").val() != inputText) {
                return '两次输入的密码不一致'
            } else {
                return ''
            }
        }

    })

    //所有input都存在且通过校验，发送ajax请求，注册这个账号
    if (usernameVal && passwordVal && rePasswordVal) {

        userRegister({
            password: $(".register-dialog input[name='password']").val(),
            username: $(".register-dialog input[name='username']").val()
        }, function (res) {
            console.log(res);
            alert(res.msg);
            dialogVisible( false,'.register-dialog');
            $('.input-row input').val('');
            $('.err-msg').text('');
        })
    }
}

/**
 * 登录函数
 * 用来校验input的输入值，未通过则提示至输入框下方
 */
function handLogin() {
    var usernameVal = validFrom(".login-dialog input[name='username']", {
        //必须输入的参数
        required: true,
        msg: '请输入账号',
        reg: /^[a-zA-Z]{1}[a-zA-Z0-9_]{4,15}$/,
        resMsg: '字母开头,长度5-16之间,允许字母数字下划线'
    })

    var passwordVal = validFrom(".login-dialog input[name='password']", {
        //必须输入的参数
        required: true,
        msg: '请输入密码',
        reg: /^[a-zA-Z]{1}[a-zA-Z0-9_]{5,17}$/,
        resMsg: '字母开头,长度6-18之间,允许字母数字下划线'
    })


    //账号密码都存在且通过校验，发送ajax请求，登录这个账号
    if (usernameVal && passwordVal) {

        userLogin({
            password: $(".login-dialog input[name='password']").val(),
            username: $(".login-dialog input[name='username']").val()
        }, function (res) {
            console.log(res);
            //登录成功，保存token
            $.cookie('xiaomi-token', res.data)

            alert(res.msg);
            dialogVisible( false,'.login-dialog');
            $('.input-row input').val('');
            $('.err-msg').text('');
        })
    }
}

/**
 * 校验
 */
function validFrom(inputSelect, rule) {
    //获取输入的值
    var inputText = $(inputSelect).val();
    //获取提示框
    var errMsg = $(inputSelect).parent().siblings('.err-msg');

    //校验用户是否输入空值
    if (rule.required && inputText.length == 0) {
        errMsg.text(rule.msg);
        return false;
    }

    //正则表达式校验不通过
    if (!rule.reg.test(inputText)) {
        errMsg.text(rule.resMsg)
        return false;
    }

    //自定义校验
    if (typeof rule.validator == 'function') {
        var result = rule.validator(inputText)
        if (result.length > 0) {
            //校验失败，显示提示
            errMsg.text(result)
            return false
        }
    }
    //校验通过，将提示置空
    errMsg.text('');

    return true;
}
/**
 * 初始化轮播图
 */
function initBanner() {
    var curIndex = 0;

    listBanner({}, function (res) {
        res.data.forEach(function (ele, index) {
            $('.slider').append(`<img src="${BASE_URL}/${ele.url}" alt=""/>`)
            $('.slider-control').append(`<sapn><span/>`)
        })
        $('.slider-control span').eq(0).addClass('btn-ative')
        //定时器
        var timer = setInterval(autoBanner, 3000, res.data.length);
        console.log(timer);
        buildBannerChange(res.data.length, timer);
    })
    /**
     * banner自动移动
     * @param {*} total 
     */
    function autoBanner(total) {
        curIndex = curIndex == total - 1 ? 0 : curIndex + 1

        $('.slider').css('transform', `translatex(${-curIndex * 1280}px)`)
        $('.slider-control span').removeClass('btn-ative')
        $('.slider-control span').eq(curIndex).addClass('btn-ative')
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
            $('.slider').css('transform', `translatex(${-curIndex * 1280}px)`)
            /* 更改下标按钮样式 */
            $('.slider-control span').removeClass('btn-ative')
            $('.slider-control span').eq(curIndex).addClass('btn-ative')
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
            $('.slider').css('transform', `translatex(${-curIndex * 1280}px)`)
            /* 更改下标按钮样式 */
            $('.slider-control span').removeClass('btn-ative')
            $('.slider-control span').eq(curIndex).addClass('btn-ative')
            /* 激活定时器 */
            timer = setInterval(autoBanner, 3000, total);
            return curIndex
        })
        $('.slider-control span').each(function (index, ele) {
            $(ele).on('click', function () {
                /* 取消定时器 */
                clearInterval(timer);
                /* 移动banner */
                $('.slider').css('transform', `translatex(${-index * 1280}px)`)
                /* 更改下标按钮样式 */
                $('.slider-control span').removeClass('btn-ative')
                $('.slider-control span').eq(index).addClass('btn-ative')
                curIndex = index
                /* 激活定时器 */
                timer = setInterval(autoBanner, 3000, total);
                return curIndex
            })
        })

    }
}
//初始化商品卡片
function initProduct() {
    hotProduct({}, function (res) {
        console.log(res);
        buildPhoneProduct(res.rows[0]);
        buildApplianceProduct(res.rows[1])
        buildAccessoryProduct(res.rows[2])
    })
    /**
     * 处理手机模块
     * @param {+} data 
     */
    function buildPhoneProduct(data) {
        //标题
        $('#phone p').text(data.categoryName);
        //左边海报
        var categoryPicture1 = data.categoryPicture1;
        $('.content-item-max').append(
            `<img src="${BASE_URL}/${categoryPicture1}" alt="">`
        )
        //右边卡片
        var productList = data.products
        productList.forEach(function (ele) {
            var productCarNode = $(
                `<li class="min-item">
            <img src="${BASE_URL}/${ele.productPicture}" alt="">
            <span class="item-name">${ele.productName}</span>
            <span class="item-intro">${ele.productTitle}</span>
            <span class="item-price">
                <span>${ele.productPrice}元</span>
                <span>${ele.productSellingPrice}元</span>
            </span>
        </li>`
            )
            //缓存商品ID
            productCarNode.data('productId', ele.productId)
            $('#phone .content-item-min>ul').append(productCarNode);
        })

        //补上一张更多卡片
        $('#phone .content-item-min>ul').append(
            `<li class="min-item more">
            <span>浏览更多 >></span>
        </li>`
        )
        $('.content-item-min').on('click', '.min-item', function () {
            location.href=`./details.html?productId=${$(this).data('productId')}`
        })
    }
    /**
     * 处理家电模块
     * @param {+} data 
     */
    function buildApplianceProduct(data) {
        //标题
        $('#appliance p').text(data.categoryName);
        //左边海报
        var categoryPicture1 = data.categoryPicture1;
        var categoryPicture2=data.categoryPicture2;
        $('#appliance .content-item-min-left').append(
            `<img src="${BASE_URL}/${categoryPicture1}" alt="">
            <img src="${BASE_URL}/${categoryPicture2}" alt="">`
        )
        //右边卡片
        var productList = data.products
        productList.forEach(function (ele) {
            var productCarNode = $(
                `<li class="min-item">
            <img src="${BASE_URL}/${ele.productPicture}" alt="">
            <span class="item-name">${ele.productName}</span>
            <span class="item-intro">${ele.productTitle}</span>
            <span class="item-price">
                <span>${ele.productPrice}元</span>
                <span>${ele.productSellingPrice}元</span>
            </span>
        </li>`
            )
            //缓存商品ID
            productCarNode.data('productId', ele.productId)
            $('#appliance .content-item-min>ul').append(productCarNode);
        })

        //补上一张更多卡片
        $('#appliance .content-item-min>ul').append(
            `<li class="min-item more">
            <span>浏览更多 >></span>
        </li>`
        )
        $('.content-item-min').on('click', '.min-item', function () {
            location.href=`./details.html?productId=${$(this).data('productId')}`
        })
    }
    /**
     * 处理配件模块
     * @param {+} data 
     */
    function buildAccessoryProduct(data) {
        //标题
        $('#accessoryp').text(data.categoryName);
        //左边海报
        var categoryPicture1 = data.categoryPicture1;
        var categoryPicture2=data.categoryPicture2;
        $('#accessory .content-item-min-left').append(
            `<img src="${BASE_URL}/${categoryPicture1}" alt="">
            <img src="${BASE_URL}/${categoryPicture2}" alt="">`
        )
        //右边卡片
        var productList = data.products
        productList.forEach(function (ele) {
            var productCarNode = $(
                `<li class="min-item">
            <img src="${BASE_URL}/${ele.productPicture}" alt="">
            <span class="item-name">${ele.productName}</span>
            <span class="item-intro">${ele.productTitle}</span>
            <span class="item-price">
                <span>${ele.productPrice}元</span>
                <span>${ele.productSellingPrice}元</span>
            </span>
        </li>`
            )
            //缓存商品ID
            productCarNode.data('productId', ele.productId)
            console.log(productCarNode.data('productId'));
            $('#accessory .content-item-min>ul').append(productCarNode);
        })

        //补上一张更多卡片
        $('#accessory .content-item-min>ul').append(
            `<li class="min-item more">
            <span>浏览更多 >></span>
        </li>`
        )
        $('.content-item-min').on('click', '.min-item', function () {
            location.href=`./details.html?productId=${$(this).data('productId')}`
        })
    }
}

//入口函数
$(function () {
    // userInfo({}, function (res) {
    //     console.log(res);
    // })
    initBanner()
    initProduct()
})