/**
 * Created by ankang on 2016/10/14.
 */

(function(){
    var circleId = args.circleId;//圈子ID
    var photoW = parseInt($(".add_photo ul").width()*0.23);
    $(".add_photo li").height(photoW);
    $("#send").click(function(){
        var historypage = $.cookie("historypage");//判断返回页 // 0 活动详情 1话题详情 2文章详情
        var replyUserId = $.cookie("replyUserId");
        var reply = $("#reply").val();
        var images = "";
        var length = $(".add_photo li").length-1;
        if(length>0){
            for(var i=0;i<length;i++){
                images += $(".add_photo li img").eq(i).attr("src")+";";
            }
        }
        if(historypage==0){
            commentActivity(circleId,replyUserId,reply,images);
        }else if(historypage==1){
            commentTopic(circleId,replyUserId,reply,images);
        }else if(historypage==2) {
            commentNews(circleId, replyUserId, reply, images);
        }
    });
    $("#pic").click(function(){
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
                var length = $(".add_photo li").length-1;
                /* Initialize your app here */
                //所有与iOS交互的JS代码放这里！
                bridge.callHandler('photoLength', {'length': length});
                bridge.registerHandler('photoAddress', function(data) {
                    var imgLength = data.length;
                    var photoUrl="";
                    if(imgLength>0){
                        for(var i=0;i<imgLength;i++){
                            photoUrl += '<li><i class="icon_del"></i><img src="data:image/jpeg;base64,'+ data[i]+'" alt="" ></li>';
                        }
                    }
                    $(".add_photo ul").prepend(photoUrl);
                    var photoW = parseInt($(".add_photo ul").width()*0.23);
                    $(".add_photo li").height(photoW);
                    $(".icon_del").on("click",function(){
                        $(this).parents("li").remove();
                    });
                });
            });
        }else{
            var length = $(".add_photo li").length-1;
            window.demo.clickOnAndroid(length);
        }
    });
}());
//活动评论
function commentActivity(circleId,replyUserId,reply,images){
    var historypage = $.cookie("historypage");//判断返回页 0 活动详情
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "commentActivity",
        data: {
            articleId:circleId,
            replyUserId:replyUserId,
            reply:reply,
            imagesString:images
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
        },
        error: function(data){
            hideLoading();
            if(data.status == "200"){
                if(historypage==0){
                    location.href = "activeDetail.html"+locationSearch();
                }else if(historypage==1){
                    location.href = "topicDetail.html"+locationSearch();
                }else if(historypage==2){
                    location.href = "articleDetail.html"+locationSearch();
                }
            }else{
                var dataobj = JSON.parse(data.responseText);
                errorShowAlert(dataobj.text);
            }
        }
    })
}
//话题评论
function commentTopic(circleId,replyUserId,reply,images){
    var historypage = $.cookie("historypage");//判断返回页 1 话题详情
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "commentTopic",
        data: {
            articleId:circleId,
            replyUserId:replyUserId,
            reply:reply,
            imagesString:images
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
        },
        error: function(data){
            hideLoading();
            if(data.status == "200"){
                if(historypage==0){
                    location.href = "activeDetail.html"+locationSearch();
                }else if(historypage==1){
                    location.href = "topicDetail.html"+locationSearch();
                }else if(historypage==2){
                    location.href = "articleDetail.html"+locationSearch();
                }
            }else{
                var dataobj = JSON.parse(data.responseText);
                errorShowAlert(dataobj.text);
            }
        }
    })
}
//文章评论
function commentNews(circleId,replyUserId,reply,images){
    var historypage = $.cookie("historypage");//判断返回页 2 文章详情
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "commentNews",
        data: {
            articleId:circleId,
            replyUserId:replyUserId,
            reply:reply,
            imagesString:images
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
        },
        error: function(data){
            hideLoading();
            if(data.status == "200"){
                if(historypage==0){
                    location.href = "activeDetail.html"+locationSearch();
                }else if(historypage==1){
                    location.href = "topicDetail.html"+locationSearch();
                }else if(historypage==2){
                    location.href = "articleDetail.html"+locationSearch();
                }
            }else{
                var dataobj = JSON.parse(data.responseText);
                errorShowAlert(dataobj.text);
            }
        }
    })
}


function getPhoto(str){
    if(str!=""){
        var photoUrl="";
        var imgUrl = str.split(";");
        var imgLength = imgUrl.length-1;
        if(imgLength>0){
            for(var i=0;i<imgLength;i++){
                photoUrl += '<li><i class="icon_del"></i><img src="data:image/jpeg;base64,'+ imgUrl[i]+'" alt="" ></li>';
            }
        }
        $(".add_photo ul").prepend(photoUrl);
        var photoW = parseInt($(".add_photo ul").width()*0.23);
        $(".add_photo li").height(photoW);
    }
    $(".icon_del").on("click",function(){
        $(this).parents("li").remove();
    });
}


/*
function uploadFile(images, callback) {
    var client = new OSS.Wrapper({
        region: 'http://oss-cn-shanghai.aliyuncs.com',
        accessKeyId: 'LTAIloDah3QvBWhn',
        accessKeySecret: 'x6iDjy18zGhOAa8n1BMqd3SrJ712K4',
        bucket: 'aster-sde-11e6-a5fe-e4b318815632'
    });

    var length = images.length;
    client.put('object', '/tmp/file').then(function (r1) {
        console.log('put success: %j', r1);
        return client.get('object');
    }).then(function (r2) {
        console.log('get success: %j', r2);
    }).catch(function (err) {
        console.error('error: %j', err);
    });
}*/
