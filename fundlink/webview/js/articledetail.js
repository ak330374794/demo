/**
 * Created by ankang on 2016/10/12.
 */
var pageIndex=1;
var commentSize;
$(function(){
    var circleId = args.circleId;
    $("#words_list ul").html("");
    if(token){
        viewInfo(circleId,token,terminal,version);
        commentList(circleId,1,10,token,terminal,version);
        goNextPage();
    }else{
        $(".download").show();
        $(".comment").hide();
        viewInfo(circleId,token,terminal,version);
    }
});



//文章详情
function viewInfo(circleId,token,terminal,version){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'get',
        timeout: 60000,
        url: ajaxUrl() + "viewInfo",
        data: {
            viewId: circleId
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
            if(a.authorPortraitUrl){
                authorPortraitUrl = n.authorPortraitUrl;
            }else{
                authorPortraitUrl = "images/defaulthead.png";
            }
            if(a.images){
                $(".container_bg").attr("src",a.images.split(";")[0]);
            }else{

            }
            $(".cus_info .head_img").attr("src",authorPortraitUrl);
            $(".content h2").html(a.title);
            $("#username").html(a.authorUserName);
            $(".time").html(a.createTime.substring(0,16));
            $(".commentSize").html("评论("+ a.commentSize+")");
            commentSize = a.commentSize;
            $(".likeSize").html("赞("+ a.likeSize+")");
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
            $(".content_text").html(a.context);
            if(a.userLikes == true){
                $(".icon_zan").attr("data","1");
                $(".zan_img").attr("src","images/icon_yizan.png");
            }
            if(token){
                $(".icon_reply").click(function(){
                    $.cookie("replyUserId","");
                    $.cookie("historypage","2");// 0 活动详情 1话题详情 2文章详情
                    location.href = "message.html"+locationSearch();
                });
                $(".icon_zan").click(function(){
                    var flag = $(this).attr("data");
                    if(flag == 0){
                        likesNews(circleId,token,terminal,version);
                    }
                });
            }
        },
        error: function(data){
            hideLoading();
            var dataobj = JSON.parse(data.responseText);
            errorShowAlert(dataobj.text);
        }
    })
}

//文章点赞
function likesNews(circleId,token,terminal,version){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "likesNews",
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
            var del="";
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
            //评论文字长度
            var fontS = $(".words").css("font-size").substring(0,$(".words").css("font-size").length-2)-0;
            var wordsW = $(".words").width();
            var spillL = Math.round(wordsW/fontS)*4;
            var whole = '<div class="whole"><a href="javascript:void(0)" data="0">全文</a></div>';
            var wordsL;
            for(var i=0;i<$("#words_list li").length;i++){
                wordsL = $("#words_list li").eq(i).find(".words").text().length;
                if(wordsL>=spillL){
                    $("#words_list li").eq(i).find(".words").after(whole);
                }
            }
            $(".whole a").click(function(){
                var flag = $(this).attr("data");
                if(flag == 0){
                    $(this).parent().siblings(".words").css("-webkit-line-clamp","100");
                    $(this).html("收起");
                    $(this).attr("data","1");
                }else{
                    $(this).parent().siblings(".words").css("-webkit-line-clamp","4");
                    $(this).html("全文");
                    $(this).attr("data","0");
                }
            });
            $(".reply1").click(function(){
                var replyId = $(this).attr("userid");
                $.cookie("replyUserId",replyId);
                $.cookie("historypage","2");// 0 活动列表
                location.href = "message.html"+locationSearch();
            });
            $(".delete").click(function(){
                var commentId = $(this).attr("commentId");
                var index = $(this).parents("li").index();
                delShowAlert(commentNews,commentId,index,token,terminal,version);
            })
        },
        error: function(data){
            hideLoading();
            var dataobj = JSON.parse(data.responseText);
            errorShowAlert(dataobj.text);
        }
    })
}

//删除评论
function commentNews(commentId,index,token,terminal,version){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'delete',
        timeout: 60000,
        url: ajaxUrl() + "commentNews?commentId=" + commentId,
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


