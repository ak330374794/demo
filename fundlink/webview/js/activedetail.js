/**
 * Created by ankang on 2016/10/12.
 */
var pageIndex=1;
var commentSize;
$(function(){
    var circleId = args.circleId;//圈子ID
    $("#words_list ul").html("");
    var blackbg = '<div class="blackbg" style="position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:99"></div>';
    if(token){
        circleDetail(circleId,token,terminal,version);
        commentList(circleId,1,10,token,terminal,version);
        goNextPage();
    }else{
        $(".download").show();
        $(".comment").hide();
        $(".apply").hide();
        $(".icon").css("width","50%");
        $(".foot_box").css("background-position","50%");
        circleDetail(circleId,token,terminal,version);
    }
});

//圈子详情
function circleDetail(circleId,token,terminal,version){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'get',
        timeout: 60000,
        url: ajaxUrl() + "circleInfo",
        data: {
            circleId:circleId
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
            var container_bg;
            var images = "";
            $(".head_container").html("");
            if(a.images){
                container_bg = a.images.split(";");
                var imgLength = container_bg.length-1;
                if(imgLength>0){
                    for(var j=0;j<imgLength;j++){
                        images += '<img class="container_bg" src="'+container_bg[j]+'" alt="">';
                    }
                }
                $(".head_container").append(images)
            }else {
                images = "";
                $(".head_container").hide();
            }
            $(".acttitle").html(a.title);
            if(/^\d+(\.\d+)?$/.test(a.expenses)){
                $(".expenses").html(a.expenses+"元");
            }else {
                $(".expenses").html(a.expenses);
            }

            $(".note").html(a.state);
            $(".acttime").html(a.startTime.substring(5,16)+" 至 "+a.endTime.substring(5,16));
            $(".address").html(a.address);
            $(".organizers").html(a.organizers);
            if(a.involvementLimit == "不限"){
                $(".ceiling").html("已报名"+ a.involvementSize+"人/不限人数");
            }else{
                $(".ceiling").html("已报名"+ a.involvementSize+"人/限报名"+ a.involvementLimit+"人");
            }
            var lableS;
            var lable="";
            if(a.lable != ""){
                lableS = a.lable.split(";");
                var lableLength = lableS.length-1;
                if(lableLength>0){
                    for(var j=0;j<lableLength;j++){
                        lable += '<span>'+ lableS[j]+'</span>';
                    }
                }
            }else {
                lable = "";
            }
            $(".lable").html("").append(lable);
            $(".context").html(a.context);
            $(".commentSize").html("评论("+ a.commentSize+")");
            commentSize = a.commentSize;
            $(".likeSize").html("赞("+ a.likeSize+")");
            if(a.state == "已结束"){
                $("#apply").html("已结束").attr("data","1").css("background","#868a90");
            }else if(a.state == "审核中"){
                if(token){
                    $("#apply").click(function(){
                        errorShowAlert("正在审核中");
                    });
                    $(".icon_reply").click(function(){
                        errorShowAlert("正在审核中");
                    });
                    $(".icon_zan").click(function(){
                        errorShowAlert("正在审核中");
                    });
                }
            }else if(a.state == "审核未通过"){
                if(token){
                    $("#apply").click(function(){
                        errorShowAlert("审核未通过");
                    });
                    $(".icon_reply").click(function(){
                        errorShowAlert("审核未通过");
                    });
                    $(".icon_zan").click(function(){
                        errorShowAlert("审核未通过");
                    });
                }
            }else{
                if(token){
                    $(".icon_reply").click(function(){
                        $.cookie("replyUserId","");
                        $.cookie("historypage","0");// // 0 活动详情 1话题详情 2文章详情
                        location.href = "message.html"+locationSearch();
                    });
                    $(".icon_zan").click(function(){
                        var flag = $(this).attr("data");
                        if(flag == 0){
                            likesActivity(circleId,token,terminal,version);
                        }
                    });
                    $("#apply").click(function(){
                        var flag = $(this).attr("data");
                        if(flag == 0){
                            showAlert(involvementActivity,circleId,token,terminal,version);
                        }
                    })
                }
            }
            if(a.userInvolvement == true){
                $("#apply").attr("data","1").html("已报名").css("background","#868a90");
            }
            if(a.userLikes == true){
                $(".icon_zan").attr("data","1");
                $(".zan_img").attr("src","images/icon_yizan.png");
            }
        },
        error: function(data){
            hideLoading();
            var dataobj = JSON.parse(data.responseText);
            errorShowAlert(dataobj.text);
        }
    })
}
//评论列表
function commentList(circleId,pageIndex,pageSize,token,terminal,version){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'get',
        timeout: 60000,
        url: ajaxUrl() + "comment",
        data: {
            articleId: circleId,
            pageIndex: pageIndex,
            pageSize: pageSize
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
            var commentList = "";
            var wordImg;
            var images = "";
            var username = "";
            var del = "";
            $(a.listData).each(function(i,n){
                if(n.images){
                    wordImg = n.images.split(";");
                    var imgLength = wordImg.length-1;
                    if(imgLength>0){
                        for(var j=0;j<imgLength;j++){
                            images += '<img src="'+wordImg[j]+'" alt="" >';
                        }
                    }
                }else {
                    images = "";
                }
                if(n.userPortraitUrl){
                    userPortraitUrl = n.userPortraitUrl;
                }else{
                    userPortraitUrl = "images/defaulthead.png";
                }
                if(n.replyUserId){
                    username = n.userName + "<span style='color: #000;'> 回复 </span>" + n.replyUserName;
                }else{
                    username = n.userName;
                }
                if(n.oneself){
                    del = '<a class="delete" commentId="'+ n.commentId+'">删除</a>';
                }else{
                    del = '';
                }
                commentList += '<li>'
                            +'<div class="head_img">'
                            +'<img src="'+ userPortraitUrl+'" alt="" >'
                            +'</div>'
                            +'<div class="list_right">'
                            +'<div class="blue username">'+ username+'</div>'
                            +'<div class="words">'+ n.reply+'</div>'
                            +'<div class="wordimg">'+images+'</div>'
                            +'<div class="gray"><span>'+ n.createTime.substring(0,16)+' · </span><a class="reply1" commentId="'+ n.commentId+'" userId="'+ n.userId+'">回复</a>'+del+'</div>'
                            +'</div>'
                            +'</li>';
            });
            if(a.totalCount == 0){
                $("#words_list ul").append('<span style="display:block;margin:1rem auto;color:#9b9b9b;text-align:center;line-height: 2rem">暂无评论</span>');
            }else{
                $("#words_list ul").append(commentList);
            }
            $(".reply1").click(function(){
                var replyId = $(this).attr("userid");
                $.cookie("replyUserId",replyId);
                $.cookie("historypage","0");// 0 活动列表
                location.href = "message.html"+locationSearch();
            });
            $(".delete").click(function(){
                var commentId = $(this).attr("commentId");
                var index = $(this).parents("li").index();
                delShowAlert(commentActivity,commentId,index,token,terminal,version);
            })
        },
        error: function(data){
            hideLoading();
            var dataobj = JSON.parse(data.responseText);
            errorShowAlert(dataobj.text);
        }
    })
}


//查询用户信息
function userInfo(findUserId){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'get',
        timeout: 60000,
        url: ajaxUrl() + "userInfo",
        data: {
            findUserId: findUserId
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
            $(".realName").html(a.realName);
            $(".guesthead").attr("src", a.portraitUrl);
        },
        error: function(data){
            hideLoading();
            var dataobj = JSON.parse(data.responseText);
            errorShowAlert(dataobj.text);
        }
    })
}

//删除评论
function commentActivity(commentId,index,token,terminal,version){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'delete',
        timeout: 60000,
        url: ajaxUrl() + "commentActivity?commentId=" + commentId,
        /*data: {
            commentId: commentId
        },*/
        headers : {
            'x-aster-token': token,
            'x-aster-terminal': terminal,
            'x-aster-version': version
        },
        async: 'false',
        dataType: 'json',
        success: function (data) {
            hideLoading();
        },
        error: function(data){
            hideLoading();
            commentSize--;
            if(data.status == "200"){
                $(".commentSize").html("评论("+ commentSize+")");
                $("#words_list ul li").eq(index).remove();
            }else{
                var dataobj = JSON.parse(data.responseText);
                errorShowAlert(dataobj.text);
            }
        }
    })
}



//活动点赞
function likesActivity(circleId,token,terminal,version){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "likesActivity",
        data: {
            articleId: circleId
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
            var zannum = $(".likeSize").html().substring(2,$(".likeSize").html().length-1)-0+1;
            $(".icon_zan").attr("data","1");
            $(".zan_img").attr("src","images/icon_yizan.png");
            $(".add1").show().animate({top:"-2rem"},function(){
                $(this).hide();
                $(".likeSize").html("赞("+zannum+")");
            });
        },
        error: function(data){
            hideLoading();
            if(data.status == "200"){
                var zannum = $(".likeSize").html().substring(2,$(".likeSize").html().length-1)-0+1;
                $(".icon_zan").attr("data","1");
                $(".zan_img").attr("src","images/icon_yizan.png");
                $(".add1").show().animate({top:"-2rem"},function(){
                    $(this).hide();
                    $(".likeSize").html("赞("+zannum+")");
                });
            }else{
                var dataobj = JSON.parse(data.responseText);
                errorShowAlert(dataobj.text);
            }
        }
    })
}

//报名活动
function involvementActivity(circleId,token,terminal,version,changeNameCard){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "involvementActivity",
        data: {
            articleId: circleId,
            changeNameCard: changeNameCard
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
            errorShowAlert("报名成功");
            $("#apply").attr("data","1").html("已报名").css("background","#868a90");
        },
        error: function(data){
            hideLoading();
            if(data.status == "200"){
                errorShowAlert("报名成功");
                $("#apply").attr("data","1").html("已报名").css("background","#868a90");
            }else{
                var dataobj = JSON.parse(data.responseText);
                errorShowAlert(dataobj.text);
            }
        }
    })
}

//滚动到底时加载数据
function goNextPage(){
    $(window).scroll(function(){
        var o = $("body");
        if(o!=null && o.length !=0){
            //获取网页的完整高度(fix)
            var height= $(document).height();
            //获取浏览器高度(fix)
            var clientHeight =$(window).height();

            //获取网页滚过的高度(dynamic)
            var top= window.pageYOffset || (document.compatMode == 'CSS1Compat' ? document.documentElement.scrollTop :	document.body.scrollTop);

            //当 top+clientHeight = scrollHeight的时候就说明到底儿了
            if((height > clientHeight)&&(top>=(parseInt(height)-clientHeight))){
//				alert("go to next page");
                var sum = (pageIndex)*10;//第loadNum页，每页10条，应该共加载sum条
                var length = $("#words_list ul li").length;
                var args = new getArgs();
                var circleId = args.circleId;
                var token = args.token;
                var terminal = args.terminal;
                var version = args.version;
                if(length<sum){

                }else {
                    pageIndex++;//刷新跳页
                    commentList(circleId,pageIndex,10,token,terminal,version);
                }
            }
        }
    })
}

//确认提示框
function showAlert(callback1,circleId,token,terminal,version){
    var showBox;
    var showBox_h='';
    showBox_h +='<div class="showBox">';
    showBox_h +='<div id="showAlert" class="showAlert">';
    showBox_h +='<div class="showContent">';
    showBox_h +='<div class="alert_title">签到换名片</div>';
    showBox_h +='<div class="alert_info"><span class="prompt">交换，可自动与其他选择交换的人加为好友</span></div>';
    showBox_h +='</div>';
    showBox_h +='<div class="subButton"><a class="cancle">不交换</a><a class="confirm">交换</a></div>';
    showBox_h +='</div>';
    showBox_h +='</div>';
    showBox = $(showBox_h);
    $("body").append(showBox);
    var scrollHeight = window.screen.availHeight;
    $(".showBox").css("height",scrollHeight);
    var bookHeight = $(".showAlert").height();
    $("#showAlert").css("top","10rem");
    var changeNameCard = "";
    $(".subButton .confirm").click(function () {
        hideAlert();
        changeNameCard = "yes";
        callback1(circleId,token,terminal,version,changeNameCard);
    });
    $(".subButton .cancle").click(function () {
        hideAlert();
        changeNameCard = "no";
        callback1(circleId,token,terminal,version,changeNameCard);
    });
}