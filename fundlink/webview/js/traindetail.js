/**
 * Created by ankang on 2016/10/12.
 */
$(function(){
    var circleId = args.circleId;
    circleDetail(circleId,token,terminal,version);
    if(!token){
        $(".download").show();
        $(".apply").hide();
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
            if(a.images){
                $(".container_bg").attr("src",a.images.split(";")[0]);
            }else{
                $(".container_bg").hide();
            }
            $(".traintitle").html(a.title);
            $(".expenses").html(a.expenses);
            $(".note").html(a.state);
            $(".traintime").html(a.startTime.substring(5,16)+" 至 "+a.endTime.substring(5,16));
            $(".address").html(a.city+" "+a.address);
            $(".objects").html(a.objects);
            if(a.involvementLimit == "不限"){
                $(".ceiling").html("已报名"+ a.involvementSize+"人/不限人数");
            }else{
                $(".ceiling").html("已报名"+ a.involvementSize+"人/限报名"+ a.involvementLimit+"人");
            }
            $(".guesthead").attr("src", a.guestPortraitUrl);
            $(".realName").html(a.guestRealName+'<i class="icon_v"></i>');
            $(".guestContext").html(a.guestContext);
            $(".schedule").html(a.schedule.replace(/\r\n/g,'<br>'));
            $(".organizers").html(a.organizers);
            $(".organizersContext").html(a.organizersContext);
            $(".context").html(a.context);
            if(a.state == "已结束"){
                $("#apply").html("已结束").attr("data","1").css("background","#868a90");
            }
            if(a.userInvolvement == true){
                $("#apply").attr("data","1").html("已报名").css("background","#868a90");
            }else{
                $("#apply").bind("click",function(){
                    var flag = $(this).attr("data");
                    if(flag == 0){
                        involvementTrain(circleId,token,terminal,version);
                    }
                })
            }
        },
        error: function(data){
            hideLoading();
            var dataobj = JSON.parse(data.responseText);
            errorShowAlert(dataobj.text);
        }
    })
}

//报名活动
function involvementTrain(circleId,token,terminal,version){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "involvementTrain",
        data: {
            articleId: circleId,
            changeNameCard: "yes"
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
