/**
 * Created by ankang on 2016/11/10.
 */
(function(){
    var ajaxurl;
    if(tag==3){//线上
        ajaxurl = "moneyOnline";
    }else if(tag==4){//线下
        ajaxurl = "moneyOffline";
    }else if(tag==5){//理财
        ajaxurl = "wmp";
    }else if(tag==6){//票据
        ajaxurl = "draft";
    }else if(tag==7){//非标
        ajaxurl = "nonstandard";
    }else if(tag==2){//现券
        ajaxurl = "bond";
    }
    var dataid = $.cookie("dataid");
    var datanote = $.cookie("datanote");
    offerdetail(ajaxurl,dataid,datanote);
    $("#goim").click(function(){
        var userid = $(this).attr("userid");
        var username = $(this).attr("username");
        if (/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())) {
            /*这段代码是固定的，必须要放到js中*/
            function setupWebViewJavascriptBridge(callback) {
                if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
                if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
                window.WVJBCallbacks = [callback];
                var WVJBIframe = document.createElement('iframe');
                WVJBIframe.style.display = 'none';
                WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
                document.documentElement.appendChild(WVJBIframe);
                setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
            }
            setupWebViewJavascriptBridge(function (bridge) {
                /* Initialize your app here */
                //所有与iOS交互的JS代码放这里！
                var im = {
                    "userid" : userid,
                    "username" : username
                };
                bridge.callHandler('goim', im);
            });
        }else{
            window.demo.goim(userid,username);
        }
    });
}());

function offerdetail(ajaxurl,dataid,datanote){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'get',
        timeout: 60000,
        url: ajaxUrl() + ajaxurl,
        data: {
            id: dataid
        },
        headers : {
            'x-aster-token': token,
            'x-aster-terminal': terminal,
            'x-aster-version': version
        },
        async: 'false',
        dataType: 'json',
        success: function (data) {
            hideLoading();
            var a = data;
            $(".username").html(a.userName+" "+ a.companyShortName);
            $(".note").html(datanote);
            $(".qq").html(a.qq);
            var ua = navigator.userAgent.toLowerCase();
            if(a.telephone){
                if (/iphone|ipad|ipod/.test(ua)) {
                    $(".icon_call").attr("href",'tel:'+a.telephone);
                } else if (/android/.test(ua)) {
                    $(".icon_call").attr("href",'javascript:void(0)').click(function(){
                        call(a.telephone);
                    });
                }
            }else{
                $(".icon_call").attr("href",'javascript:void(0)');
            }
            if(a.mobilePhone){
                if (/iphone|ipad|ipod/.test(ua)) {
                    $(".icon_phone").attr("href",'tel:'+a.mobilePhone);
                } else if (/android/.test(ua)) {
                    $(".icon_phone").attr("href",'javascript:void(0)').click(function(){
                        call(a.mobilePhone);
                    });
                }
            }else{
                $(".icon_phone").attr("href",'javascript:void(0)');
            }
            $(".call").html(a.telephone);
            $(".phone").html(a.mobilePhone);
            $(".time").html(a.time.substring(0,10));
            $("#goim").attr("userid",a.userId).attr("username",a.userName);
        },
        error: function(data){
            hideLoading();
            var dataobj = JSON.parse(data.responseText);
            errorShowAlert(dataobj.text);
        }
    })
}

function call(callnum){
    alert(callnum);
    window.demo.call(callnum);
}
