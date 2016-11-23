/**
 * Created by ankang on 2016/10/20.
 */
var tableW = $(".table_container").css("width");
var fontS = $("html").css("font-size").replace("px","")-0;
var screenH = "";
var pageIndex = 1;
var flag1 = true;
$(function(){
    //下滑刷新调用
    k_touch("content", "y");
    if($("body div").hasClass("tabbtn")){
        screenH = $(window).height() - fontS*7.6-5;
    }else{
        screenH = $(window).height() - fontS*3.6;
    }
    var conditionH = $(window).height() - fontS*3.6-$(".foot_btn").height();
    $(".condition").css("min-height",conditionH);
    //FixTable("MyTable", 1, tableW, screenH);

    $(".rank").click(function(){
        var index = $(this).index();
        var type = $(this).attr("datatype");
        var that = $(this).find("i");
        if(that.hasClass("icon_top")){
            that.removeClass("icon_top").addClass("icon_low");
            rank(index,type,0);
        }else{
            that.removeClass("icon_low").addClass("icon_top");
            rank(index,type,1);
        }
    });
    $(".screening").click(function(){
        var flag = $(this).attr("data");
        if(flag==0){
            var height = $(window).height()-3.6*fontS;
            $(".form_screening").show().css("height",height);
            $(".condition").animate({left:'0'},"speed",function(){
                $(".screening").html('收起<i class="icon_screening"></i>');
            });
            $(".foot_btn").animate({left:'10%'},"speed");
            $(this).attr("data","1");
        }else{
            $(".condition").animate({left:'100%'},"speed",function(){
                $(".screening").html('筛选<i class="icon_screening"></i>');
                $(".form_screening").hide();
            });
            $(".foot_btn").animate({left:'100%'},"speed");
            $(this).attr("data","0");
        }
        $(".unit").click(function(){
            $(".unit").removeClass("amountsel");
            $(this).addClass("amountsel");
        });
    });
    $(".form_screening").bind("click",function(e){
        $(".condition").animate({left:'100%'},"speed",function(){
            $(".screening").html('筛选<i class="icon_screening"></i>');
            $(".form_screening").hide();
        });
        $(".foot_btn").animate({left:'100%'},"speed");
        $(".screening").attr("data","0");
    });
    $(".condition").bind("click",function(e){
        e.stopPropagation();
    });
    $(".condition li .form_btn").click(function(){
        var tpye = $(this).parents("li").attr("datatype"); //是否单选
        var index = $(this).parents("li").index();
        /*//选择全部时，清空input
        if($(this).index()==0){
            $(this).siblings(".range").find("input").val("");
        }*/
        //按钮变色
        if(tpye==1){
            $(this).siblings().removeClass("blue_bg");
            $(this).addClass("blue_bg");
        }else{
            if($(this).index()==0){
                $(this).siblings().removeClass("blue_bg");
                $(this).addClass("blue_bg");
            }else{
                if($(this).hasClass("blue_bg")){
                    $(this).removeClass("blue_bg");
                }else{
                    $(this).siblings().eq(0).removeClass("blue_bg");
                    $(this).addClass("blue_bg");
                }
            }
            var mark;
            var flag;
            var length = $(".condition li").eq(index).find(".form_btn").length;
            for(var i=1;i<length;i++){
                //flag = $(this).siblings().eq(i).hasClass("blue_bg");
                flag = $(".condition li").eq(index).find(".form_btn").eq(i).hasClass("blue_bg");
                if(flag){
                    mark = 0;
                }else{
                    mark = 1;
                    break;
                }
            }
            if(mark == 0){//全选
                $(".condition li").eq(index).find(".form_btn").removeClass("blue_bg");
                $(".condition li").eq(index).find(".form_btn").eq(0).addClass("blue_bg");
            }
        }

    });
    if(tag == 3){//线上资金
        pageIndex = 1;
        $("#MyTable tbody").html("");
        moneyOnline(pageIndex,15,"");
    }else if(tag == 4){//线下资金
        pageIndex = 1;
        $("#MyTable tbody").html("");
        moneyOffline(pageIndex,15,"");
    }else if(tag == 5){//理财
        pageIndex = 1;
        $("#MyTable tbody").html("");
        manageMoney(pageIndex,15,"")
    }else if(tag == 6){//票据
        pageIndex = 1;
        $("#MyTable tbody").html("");
        bill(pageIndex,15,"")
    }else if(tag == 7){//非标
        pageIndex = 1;
        $("#MyTable tbody").html("");
        nonstandard(pageIndex,15,"")
    }else if(tag == 2){//现券
        pageIndex = 1;
        $("#MyTable tbody").html("");
        bonds(pageIndex,15,"")
    }else if(tag == 1){//一级发行
        pageIndex = 1;
        var bondType;
        $(".tabbtn a").click(function(){
            $(".tabbtn a").removeClass("select");
            $(this).addClass("select");
            bondType = $(this).attr("data");
            if(bondType==2){
                $(".rankshow").hide();
            }else{
                $(".rankshow").show();
            }
            $("#MyTable tbody").html("");
            newBonds(pageIndex,15,bondType);
        });
        $("#MyTable tbody").html("");
        newBonds(pageIndex,15,0);
    }
    $("#reset").click(function(){
        reset();
    });
    $("#confirm").click(function(){
        pageIndex = 1;
        var n = 0;
        var params = new Array();
        var length1 = $(".condition li").length;
        var length2 = $(".condition li .range").length;
        var key,op,value;
        $("#MyTable tbody").html("");
        params[n] = new Object();
        //params[0].derection = $(".condition li").eq(0).find(".blue_bg").attr("data")-0;
        for(var i=0;i<length1;i++){
            var tpye = $(".condition li").eq(i).attr("datatype");
            if(tpye==1){
                key = $(".condition li").eq(i).attr("data");
                op = "=";
                value = $(".condition li").eq(i).find(".blue_bg").attr("data");
                params[n] = {"key":key,"op":op,"value":value};
                n++;
            }else{
                var sellength = $(".condition li").eq(i).find(".blue_bg").length;
                for(var j=0;j<sellength;j++){
                    key = $(".condition li").eq(i).attr("data");
                    op = "=";
                    value = $(".condition li").eq(i).find(".blue_bg").eq(j).attr("data");
                    params[n] = {"key":key,"op":op,"value":value};
                    n++;
                }
            }
        }
        var range = $(".condition li .range");
        var minVal,maxVal;
        for(var k=0;k<length2;k++){
            minVal = range.eq(k).find("input").eq(0).val();
            maxVal = range.eq(k).find("input").eq(1).val();
            key = range.eq(k).find("input").eq(0).attr("data");
            if(key == "amount"){
                var unit = range.eq(k).find(".amountsel").attr("data")-0;
                if(unit){
                    minVal = minVal*unit;
                    maxVal = maxVal*unit;
                }
            }
            params[n] = {"key":key,"op":"range","from":minVal,"to":maxVal};
            n++;
        }
        var jsonParams = JSON.stringify(params);
        $.cookie("jsonParams",jsonParams);
        if(tag == 3){//线上资金
            moneyOnline(pageIndex,15,jsonParams);
        }else if(tag == 4){//线下资金
            moneyOffline(pageIndex,15,jsonParams);
        }else if(tag == 5){//理财
            manageMoney(pageIndex,15,jsonParams);
        }else if(tag == 6){//票据
            bill(pageIndex,15,jsonParams);
        }else if(tag == 7){//非标
            nonstandard(pageIndex,15,jsonParams);
        }else if(tag == 2){//现券
            bonds(pageIndex,15,jsonParams);
        }else if(tag == 1){//一级发行
            var bondType = $(".tabbtn a.select").attr("data");
            var property = $(".condition li").eq(0).find(".blue_bg");
            var propertydata = "";
            var deadline = $(".condition li").eq(1).find(".blue_bg");
            var deadlinedata = "";
            var rating = $(".condition li").eq(2).find(".blue_bg");
            var ratingdata = "";
            if($(".condition li").eq(0).find(".blue_bg").eq(0).attr("data")!=""){
                for (var m=0;m<property.length;m++){
                    propertydata += property.eq(m).attr("data")+";";
                }
            }
            if($(".condition li").eq(1).find(".blue_bg").eq(0).attr("data")!=""){
                for (var p=0;p<deadline.length;p++){
                    deadlinedata += deadline.eq(p).attr("data")+";";
                }
            }
            if($(".condition li").eq(2).find(".blue_bg").eq(0).attr("data")!="") {
                for (var q = 0; q < rating.length; q++) {
                    ratingdata += rating.eq(q).attr("data") + ";";
                }
            }
            $.cookie("propertydata",propertydata);
            $.cookie("deadlinedata",deadlinedata);
            $.cookie("ratingdata",ratingdata);
            newBonds(pageIndex,15,bondType,propertydata,deadlinedata,ratingdata);
        }
    });
});


function FixTable(TableID, FixColumnNumber, width, height) {
    /// <summary>
    ///     锁定表头和列
    ///     <para> sorex.cnblogs.com </para>
    /// </summary>
    /// <param name="TableID" type="String">
    ///     要锁定的Table的ID
    /// </param>
    /// <param name="FixColumnNumber" type="Number">
    ///     要锁定列的个数
    /// </param>
    /// <param name="width" type="Number">
    ///     显示的宽度
    /// </param>
    /// <param name="height" type="Number">
    ///     显示的高度
    /// </param>
    if ($("#" + TableID + "_tableLayout").length != 0) {
        $("#" + TableID + "_tableLayout").before($("#" + TableID));
        $("#" + TableID + "_tableLayout").empty();
    }
    else {
        $("#" + TableID).after("<div id='" + TableID + "_tableLayout' style='overflow:hidden;height:" + height + "px; width: 100%;'></div>");
    }
    $('<div id="' + TableID + '_tableFix"></div>'
        + '<div id="' + TableID + '_tableHead"></div>'
        + '<div id="' + TableID + '_tableColumn"></div>'
        + '<div id="' + TableID + '_tableData"></div>').appendTo("#" + TableID + "_tableLayout");
    var oldtable = $("#" + TableID);
    var tableFixClone = oldtable.clone(true);
    tableFixClone.attr("id", TableID + "_tableFixClone");
    $("#" + TableID + "_tableFix").append(tableFixClone);
    var tableHeadClone = oldtable.clone(true);
    tableHeadClone.attr("id", TableID + "_tableHeadClone");
    $("#" + TableID + "_tableHead").append(tableHeadClone);
    var tableColumnClone = oldtable.clone(true);
    tableColumnClone.attr("id", TableID + "_tableColumnClone");
    $("#" + TableID + "_tableColumn").append(tableColumnClone);
    $("#" + TableID + "_tableData").append(oldtable);
    $("#" + TableID + "_tableLayout table").each(function () {
        $(this).css("margin", "0");
    });
    var HeadHeight = $("#" + TableID + "_tableHead thead").height();
    HeadHeight += 2;
    $("#" + TableID + "_tableHead").css("height", HeadHeight);
    $("#" + TableID + "_tableFix").css("height", HeadHeight);
    var ColumnsWidth = 0;
    var ColumnsNumber = 0;
    $("#" + TableID + "_tableColumn tr:last td:lt(" + FixColumnNumber + ")").each(function () {
        ColumnsWidth += $(this).outerWidth(true);
        ColumnsNumber++;
    });
    ColumnsWidth += 2;
    /*if ($.browser.msie) {
     switch ($.browser.version) {
     case "7.0":
     if (ColumnsNumber >= 3) ColumnsWidth--;
     break;
     case "8.0":
     if (ColumnsNumber >= 2) ColumnsWidth--;
     break;
     }
     }*/
    $("#" + TableID + "_tableColumn").css("width", ColumnsWidth);
    $("#" + TableID + "_tableFix").css("width", ColumnsWidth);
    $("#" + TableID + "_tableData").scroll(function () {
        $("#" + TableID + "_tableHead").scrollLeft($("#" + TableID + "_tableData").scrollLeft());
        $("#" + TableID + "_tableColumn").scrollTop($("#" + TableID + "_tableData").scrollTop());
    });/*
     $("#" + TableID + "_tableHead").scroll(function () {
     $("#" + TableID + "_tableData").scrollLeft($("#" + TableID + "_tableHead").scrollLeft());
     $("#" + TableID + "_tableData").scrollTop($("#" + TableID + "_tableColumn").scrollTop());
     });
     $("#" + TableID + "_tableColumn").scroll(function () {
     $("#" + TableID + "_tableData").scrollLeft($("#" + TableID + "_tableHead").scrollLeft());
     $("#" + TableID + "_tableData").scrollTop($("#" + TableID + "_tableColumn").scrollTop());
     });*/
    $("#" + TableID + "_tableFix").css({ "overflow": "hidden", "position": "relative", "z-index": "50"});
    $("#" + TableID + "_tableHead").css({ "overflow": "hidden", "min-width": "100%", "width": width, "position": "relative", "z-index": "45"});
    $("#" + TableID + "_tableColumn").css({ "overflow": "hidden", "height": height, "position": "relative", "z-index": "40"});
    $("#" + TableID + "_tableData").css({ "overflow": "scroll", "min-width": "100%", "width": width, "height": height, "position": "relative", "z-index": "35" });
    if ($("#" + TableID + "_tableHead").width() > $("#" + TableID + "_tableFix table").width()) {
        $("#" + TableID + "_tableHead").css("width", $("#" + TableID + "_tableFix table").width());
        $("#" + TableID + "_tableData").css("width", $("#" + TableID + "_tableFix table").width());
    }
    if ($("#" + TableID + "_tableColumn").height() > $("#" + TableID + "_tableColumn table").height()) {
        $("#" + TableID + "_tableColumn").css("height", $("#" + TableID + "_tableColumn table").height());
        $("#" + TableID + "_tableData").css("height", $("#" + TableID + "_tableColumn table").height());
    }
    $("#" + TableID + "_tableFix").offset($("#" + TableID + "_tableLayout").offset());
    $("#" + TableID + "_tableHead").offset($("#" + TableID + "_tableLayout").offset());
    $("#" + TableID + "_tableColumn").offset($("#" + TableID + "_tableLayout").offset());
    $("#" + TableID + "_tableData").offset($("#" + TableID + "_tableLayout").offset());
}



var arrList = new Array();

//list 排序
function rank(index,type,data){
    var list = $("#MyTable tbody tr");
    var length = list.length;
    var arr = [];
    arrList = [];
    var i= 0, j, c, d;
    for(i=0;i<length;i++){
        var arrdata = list.eq(i).find("td").eq(index).html();
        arrList[i] = list.eq(i);
        if(type == 1){  //1：方向 2：金额 3：利率 4：期限 5:规模 6: 发行时间 7:剩余期限
            arr[i] = list.eq(i).find("td").eq(index).attr("data")-0;
        }else if(type == 2){
            arr[i] = list.eq(i).find("td").eq(index).html()-0;
        }else if(type == 3){
            if(arrdata=="--"){
                arr[i] = arrdata;
            }else{
                arr[i] = arrdata-0;
            }
        }else if(type == 4){
            var timeunit = arrdata.substring(arrdata.length-1,arrdata.length);
            var timedata = arrdata.substring(0,arrdata.length-1)-0;
            if(timeunit == "Y"){
                arr[i] = timedata * 360;
            }else if(timeunit == "M"){
                arr[i] = timedata * 30;
            }else if(timeunit == "D"){
                arr[i] = timedata;
            }
            /*if(arrdata.replace(/Y/,"")=="--"){
                arr[i] = arrdata.replace(/Y/,"");
            }else{
                arr[i] = arrdata.replace(/Y/,"")-0;
            }*/
        }else if(type ==5){
            if(arrdata=="--"){
                arr[i] = arrdata;
            }else{
                arr[i] = arrdata-0;
            }
        }else if(type ==7){
            arr[i] = list.eq(i).find("td").eq(index).attr("data")-0;
        }/*else if(type ==6){
            if(arrdata=="--"){
                arr[i] = arrdata;
            }else{
                arr[i] = arrdata-0;
            }
        }*/
    }
    if(data == 1){ //升序
        for(i=0;i<length;i++){
            for(j=0;j<length;j++){
                if(arr[i]<arr[j]){
                    c = arr[j];
                    arr[j] = arr[i];
                    arr[i] = c;
                    d = arrList[j];
                    arrList[j] = arrList[i];
                    arrList[i] = d;
                }else if(arr[i]=="--"){
                    c = arr[j];
                    arr[j] = arr[i];
                    arr[i] = c;
                    d = arrList[j];
                    arrList[j] = arrList[i];
                    arrList[i] = d;
                }
            }
        }
    }else {
        for(i=0;i<length;i++){
            for(j=0;j<length;j++){
                if(arr[i]>arr[j]){
                    c = arr[j];
                    arr[j] = arr[i];
                    arr[i] = c;
                    d = arrList[j];
                    arrList[j] = arrList[i];
                    arrList[i] = d;
                }else if(arr[j]=="--"){
                    c = arr[j];
                    arr[j] = arr[i];
                    arr[i] = c;
                    d = arrList[j];
                    arrList[j] = arrList[i];
                    arrList[i] = d;
                }
            }
        }
    }
    //$("#MyTable_tableColumnClone tbody").html("").append(arrList);
    var left = $("#MyTable_tableData").scrollLeft();
    var top = $("#MyTable_tableData").scrollTop();
    $("#MyTable tbody").html("").append(arrList);
    if(data==1){
        $("#MyTable th").eq(index).find("i").removeClass("icon_low").addClass("icon_top");
    }else{
        $("#MyTable th").eq(index).find("i").removeClass("icon_top").addClass("icon_low");
    }
    FixTable("MyTable", 1, tableW, screenH);
    $("#MyTable_tableData").scrollLeft(left);
    $("#MyTable_tableData").scrollTop(top);

}

 //时间转换
function timeCount(str){
    var arr = str.split("-");
    var length = arr.length;
    var time;
    time = 3600*arr[0]+60*arr[1];
    return time
}


//滚动到底时加载数据
function goNextPage(){
    $("#MyTable_tableData").scroll(function(){
        var o = $("body");
        if(o!=null && o.length !=0){
            //获取网页的完整高度(fix)
            var height= $("#MyTable").height();
            //获取浏览器高度(fix)
            var clientHeight =$("#MyTable_tableData").height();

            //获取网页滚过的高度(dynamic)
            var top= $("#MyTable_tableData").scrollTop();

            //当 top+clientHeight = scrollHeight的时候就说明到底儿了
            if((height > clientHeight)&&(top>=(parseInt(height)-clientHeight))){
//				alert("go to next page");
                var sum = (pageIndex)*15+1;//第loadNum页，每页10条，应该共加载sum条
                var length = $("#MyTable tr").length;

                var args = new getArgs();
                var token = args.token;
                var terminal = args.terminal;
                var version = args.version;
                if(length<sum){

                }else {
                    var jsonParams = $.cookie("jsonParams");
                    pageIndex++;//刷新跳页
                    if(tag == 3){//线上资金
                        moneyOnline(pageIndex,15,jsonParams);
                    }else if(tag == 4){//线下资金
                        moneyOffline(pageIndex,15,jsonParams);
                    }else if(tag == 5){//理财
                        manageMoney(pageIndex,15,jsonParams);
                    }else if(tag == 6){//票据
                        bill(pageIndex,15,jsonParams);
                    }else if(tag == 7){//非标
                        nonstandard(pageIndex,15,jsonParams);
                    }else if(tag == 2){//现券
                        bonds(pageIndex,15,jsonParams);
                    }else if(tag == 1){//一级发行
                        var bondType = $(".tabbtn a.select").attr("data");
                        var propertydata = $.cookie("propertydata");
                        var deadlinedata = $.cookie("deadlinedata");
                        var ratingdata = $.cookie("ratingdata");
                        newBonds(pageIndex,15,bondType,propertydata,deadlinedata,ratingdata);
                    }
                }
            }
        }
    })
}

//第一步：下拉过程
function slideDownStep1(dist) { // dist 下滑的距离，用以拉长背景模拟拉伸效果

    var slideDown1 = document.getElementById("slideDown1"),
        slideDown2 = document.getElementById("slideDown2");
    slideDown2.style.display = "none";
    slideDown1.style.display = "block";
    slideDown1.style.height = ( - dist) + "px";
}
//第二步：下拉，然后松开，
function slideDownStep2() {
    var slideDown1 = document.getElementById("slideDown1"),
        slideDown2 = document.getElementById("slideDown2");
    slideDown1.style.display = "none";
    slideDown1.style.height = "40px";
    slideDown2.style.display = "block";
    //刷新数据
    //location.reload();
}
//第三步：刷新完成，回归之前状态
function slideDownStep3() {
    var slideDown1 = document.getElementById("slideDown1"),
        slideDown2 = document.getElementById("slideDown2");
    slideDown1.style.display = "none";
    slideDown2.style.display = "none";
    flag1 = true;
}

//contentId表示对其进行事件绑定，way==>x表示水平方向的操作，y表示竖直方向的操作
function k_touch(contentId, way) {
    var _start = 0,
        _end = 0,
        _content = document.getElementById(contentId);
    _content.addEventListener("touchstart", touchStart, false);
    _content.addEventListener("touchmove", touchMove, false);
    _content.addEventListener("touchend", touchEnd, false);
    function touchStart(event) {
        //var touch = event.touches[0]; //这种获取也可以，但已不推荐使用
        var touch = event.targetTouches[0];
        if(way == "y") {
            _start = touch.pageY;
        }/* else {
            _start = touch.pageX;
        }*/
    }

    function touchMove(event) {
        event.stopPropagation();
        var scrollT = $("#MyTable_tableData").scrollTop();
        if(scrollT<=0){
            var touch = event.targetTouches[0];
            if(way == "y") {
                _end = (_start - touch.pageY)/3;
                //下滑才执行操作
                if(_end < 0) {
                    slideDownStep1(_end);
                }else{
                    slideDownStep3();
                }

            }/* else {
             _end = (_start - touch.pageX);
             }*/
        }
    }

    function touchEnd(event) {
        var scrollT = $("#MyTable_tableData").scrollTop();
        if(_end > -40) {
            slideDownStep3();
            goNextPage();
        }else if(_end <= -40){
            //if(scrollT<=0){
                slideDownStep2();
                //刷新成功则
                //模拟刷新成功进入第三步
                setTimeout(function() {
                    $("#MyTable tbody").html("");
                    $("#MyTable_tableColumn").remove();
                    pageIndex = 1;
                    if(tag == 3){//线上资金
                        moneyOnline(pageIndex,15,"");
                    }else if(tag == 4){//线下资金
                        moneyOffline(pageIndex,15,"");
                    }else if(tag == 5){//理财
                        manageMoney(pageIndex,15,"");
                    }else if(tag == 6){//票据
                        bill(pageIndex,15,"");
                    }else if(tag == 7){//非标
                        nonstandard(pageIndex,15,"");
                    }else if(tag == 2){//现券
                        bonds(pageIndex,15,"");
                    }else if(tag == 1){//一级发行
                        var bondType = $(".tabbtn a.select").attr("data");
                        $.cookie("propertydata","");
                        $.cookie("deadlinedata","");
                        $.cookie("ratingdata","");
                        newBonds(pageIndex,15,bondType);
                    }
                }, 1000);
            //}
        }
        _end = 0;
    }
}


//线上资金
function moneyOnline(pageIndex,pageSize,params){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'get',
        timeout: 60000,
        url: ajaxUrl() + "moneyOnlines",
        data: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            params: params
        },
        headers : {
            'x-aster-token': token,
            'x-aster-terminal': terminal,
            'x-aster-version': version
        },
        async: 'false',
        dataType: 'json',
        success: function (data) {
            slideDownStep3();
            hideLoading();
            var a = data;
            var tableData = "";
            var direction = "";
            var directionClass = "";
            if(a.totalCount != 0){
                $(a).each(function(i,n){
                    if(n.direction ==0){
                        direction = "出";
                        directionClass = "income";
                    }else if(n.direction ==1){
                        direction = "入";
                        directionClass = "spending";
                    }
                    tableData += '<tr>'
                        +'<td><span class="personname" dataid="'+ n.id+'" datanote="'+ n.note+'">'+ n.userName+'</span><span class="gray">'+ n.companyShortName+'</span></td>'
                        +'<td data="'+ n.direction+'"><span class="'+ directionClass+'">'+ direction+'</span></td>'
                        +'<td>'+ n.tenor+'</td>'
                        +'<td class="blue">'+ n.amount+'</td>'
                        +'<td class="yellow">'+ n.rate+'%</td>'
                        +'<td>'+ n.pledges+'</td>'
                        +'<td class="orange">'+ n.time.substring(11,16)+'</td>'
                        +'</tr>';
                });
                $("#MyTable tbody").append(tableData);
                var left = $("#MyTable_tableData").scrollLeft();
                var top = $("#MyTable_tableData").scrollTop();
                FixTable("MyTable", 1, tableW, screenH);
                $("#MyTable_tableData").scrollLeft(left);
                $("#MyTable_tableData").scrollTop(top);
                $("#MyTable_tableData tr").click(function(){
                    var index = $(this).index();
                    var dataid = $(this).find(".personname").attr("dataid");
                    var datanote = $(this).find(".personname").attr("datanote");
                    $.cookie("dataid",dataid);
                    $.cookie("datanote",datanote);
                    location.href = "offerDetail.html"+locationSearch();
                });
            }
            screenHide();
            reset();
        },
        error: function(data){
            hideLoading();
            var dataobj = JSON.parse(data.responseText);
            errorShowAlert(dataobj.text);
        }
    })
}
//线下资金
function moneyOffline(pageIndex,pageSize,params){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'get',
        timeout: 60000,
        url: ajaxUrl() + "moneyOfflines",
        data: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            params: params
        },
        headers : {
            'x-aster-token': token,
            'x-aster-terminal': terminal,
            'x-aster-version': version
        },
        async: 'false',
        dataType: 'json',
        success: function (data) {
            slideDownStep3();
            hideLoading();
            var a = data;
            var tableData = "";
            var direction = "";
            var directionClass = "";
            if(a.totalCount != 0){
                $(a).each(function (i, n) {
                    if (n.direction == 0) {
                        direction = "出";
                        directionClass = "income";
                    } else if (n.direction == 1) {
                        direction = "入";
                        directionClass = "spending";
                    }
                    tableData += '<tr>'
                        + '<td><span class="personname" dataid="' + n.id + '" datanote="'+ n.note+'">' + n.userName + '</span><span class="gray">' + n.companyShortName + '</span></td>'
                        + '<td data="' + n.direction + '"><span class="' + directionClass + '">' + direction + '</span></td>'
                        + '<td>' + n.moneyType + '</td>'
                        + '<td>' + n.tenor + '</td>'
                        + '<td class="blue">' + n.amount + '</td>'
                        + '<td class="yellow">' + n.rate + '%</td>'
                        + '<td class="orange">' + n.time.substring(11, 16) + '</td>'
                        + '</tr>';
                });
                $("#MyTable tbody").append(tableData);
                var left = $("#MyTable_tableData").scrollLeft();
                var top = $("#MyTable_tableData").scrollTop();
                FixTable("MyTable", 1, tableW, screenH);
                $("#MyTable_tableData").scrollLeft(left);
                $("#MyTable_tableData").scrollTop(top);
                $("#MyTable_tableLayout tr").click(function () {
                    var index = $(this).index();
                    var dataid = $(this).find(".personname").attr("dataid");
                    var datanote = $(this).find(".personname").attr("datanote");
                    $.cookie("dataid", dataid);
                    $.cookie("datanote", datanote);
                    location.href = "offerDetail.html" + locationSearch();
                });
            }
            screenHide();
            reset();
        },
        error: function(data){
            hideLoading();
            var dataobj = JSON.parse(data.responseText);
            errorShowAlert(dataobj.text);
        }
    })
}
//理财
function manageMoney(pageIndex,pageSize,params){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'get',
        timeout: 60000,
        url: ajaxUrl() + "wmps",
        data: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            params: params
        },
        headers : {
            'x-aster-token': token,
            'x-aster-terminal': terminal,
            'x-aster-version': version
        },
        async: 'false',
        dataType: 'json',
        success: function (data) {
            slideDownStep3();
            hideLoading();
            var a = data;
            var tableData = "";
            var direction = "";
            var directionClass = "";
            if(a.totalCount != 0){
                $(a).each(function (i, n) {
                    if (n.direction == 0) {
                        direction = "出";
                        directionClass = "income";
                    } else if (n.direction == 1) {
                        direction = "入";
                        directionClass = "spending";
                    }
                    tableData += '<tr>'
                        + '<td><span class="personname" dataid="' + n.id + '" datanote="'+ n.note+'">' + n.userName + '</span><span class="gray">' + n.companyShortName + '</span></td>'
                        + '<td data="' + n.direction + '"><span class="' + directionClass + '">' + direction + '</span></td>'
                        + '<td>' + n.protection + '</td>'
                        + '<td>' + n.tenor + '</td>'
                        + '<td class="blue">' + n.amount + '</td>'
                        + '<td class="yellow">' + n.rate + '%</td>'
                        + '<td>' + n.rating + '</td>'
                        + '<td>' + n.letterGuarantee + '</td>'
                        + '<td>' + n.investSide + '</td>'
                        + '<td class="orange">' + n.time.substring(11, 16) + '</td>'
                        + '</tr>';
                });
                $("#MyTable tbody").append(tableData);
                var left = $("#MyTable_tableData").scrollLeft();
                var top = $("#MyTable_tableData").scrollTop();
                FixTable("MyTable", 1, tableW, screenH);
                $("#MyTable_tableData").scrollLeft(left);
                $("#MyTable_tableData").scrollTop(top);
                $("#MyTable_tableLayout tr").click(function () {
                    var index = $(this).index();
                    var dataid = $(this).find(".personname").attr("dataid");
                    var datanote = $(this).find(".personname").attr("datanote");
                    $.cookie("dataid", dataid);
                    $.cookie("datanote", datanote);
                    location.href = "offerDetail.html" + locationSearch();
                });
            }
            screenHide();
            reset();
        },
        error: function(data){
            hideLoading();
            var dataobj = JSON.parse(data.responseText);
            errorShowAlert(dataobj.text);
        }
    })
}
//票据
function bill(pageIndex,pageSize,params){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'get',
        timeout: 60000,
        url: ajaxUrl() + "drafts",
        data: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            params: params
        },
        headers : {
            'x-aster-token': token,
            'x-aster-terminal': terminal,
            'x-aster-version': version
        },
        async: 'false',
        dataType: 'json',
        success: function (data) {
            slideDownStep3();
            hideLoading();
            var a = data;
            var tableData = "";
            var direction = "";
            var directionClass = "";
            if(a.totalCount != 0){
                $(a).each(function (i, n) {
                    if (n.direction == 0) {
                        direction = "出";
                        directionClass = "income";
                    } else if (n.direction == 1) {
                        direction = "入";
                        directionClass = "spending";
                    }
                    tableData += '<tr>'
                        + '<td><span class="personname" dataid="' + n.id + '" datanote="'+ n.note+'">' + n.userName + '</span><span class="gray">' + n.companyShortName + '</span></td>'
                        + '<td data="' + n.direction + '"><span class="' + directionClass + '">' + direction + '</span></td>'
                        + '<td>' + n.draftMode + '</td>'
                        + '<td>' + n.draftType + '</td>'
                        + '<td>' + n.electronic + '</td>'
                        + '<td>' + n.expiredType + '</td>'
                        + '<td class="blue">' + n.amount + '</td>'
                        + '<td>' + n.acceptingBank + '</td>'
                        + '<td class="orange">' + n.time.substring(11, 16) + '</td>'
                        + '</tr>';
                });
                $("#MyTable tbody").append(tableData);
                var left = $("#MyTable_tableData").scrollLeft();
                var top = $("#MyTable_tableData").scrollTop();
                FixTable("MyTable", 1, tableW, screenH);
                $("#MyTable_tableData").scrollLeft(left);
                $("#MyTable_tableData").scrollTop(top);
                $("#MyTable_tableLayout tr").click(function () {
                    var index = $(this).index();
                    var dataid = $(this).find(".personname").attr("dataid");
                    var datanote = $(this).find(".personname").attr("datanote");
                    $.cookie("dataid", dataid);
                    $.cookie("datanote", datanote);
                    location.href = "offerDetail.html" + locationSearch();
                });
            }
            screenHide();
            reset();
        },
        error: function(data){
            hideLoading();
            var dataobj = JSON.parse(data.responseText);
            errorShowAlert(dataobj.text);
        }
    })
}
//非标
function nonstandard(pageIndex,pageSize,params){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'get',
        timeout: 60000,
        url: ajaxUrl() + "nonstandards",
        data: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            params: params
        },
        headers : {
            'x-aster-token': token,
            'x-aster-terminal': terminal,
            'x-aster-version': version
        },
        async: 'false',
        dataType: 'json',
        success: function (data) {
            slideDownStep3();
            hideLoading();
            var a = data;
            var tableData = "";
            var direction = "";
            var directionClass = "";
            if(a.totalCount != 0){
                $(a).each(function(i,n){
                    if(n.direction ==0){
                        direction = "出";
                        directionClass = "income";
                    }else if(n.direction ==1){
                        direction = "入";
                        directionClass = "spending";
                    }
                    tableData += '<tr>'
                        +'<td><span class="personname" dataid="'+ n.id+'" datanote="'+ n.content+'">'+ n.userName+'</span><span class="gray">'+ n.companyShortName+'</span></td>'
                        +'<td data="'+ n.direction+'"><span class="'+ directionClass+'">'+ direction+'</span></td>'
                        +'<td>'+ n.type+'</td>'
                        +'<td class="wordbreak">'+ n.content+'</td>'
                        +'<td class="orange">'+ n.time.substring(11,16)+'</td>'
                        +'</tr>';
                });

                $("#MyTable tbody").append(tableData);
                var left = $("#MyTable_tableData").scrollLeft();
                var top = $("#MyTable_tableData").scrollTop();
                FixTable("MyTable", 1, tableW, screenH);
                $("#MyTable_tableData").scrollLeft(left);
                $("#MyTable_tableData").scrollTop(top);
                $("#MyTable_tableLayout tr").click(function(){
                    var index = $(this).index();
                    var dataid = $(this).find(".personname").attr("dataid");
                    var datanote = $(this).find(".personname").attr("datanote");
                    $.cookie("dataid",dataid);
                    $.cookie("datanote",datanote);
                    location.href = "offerDetail.html"+locationSearch();
                });
            }
            screenHide();
            reset();
        },
        error: function(data){
            hideLoading();
            var dataobj = JSON.parse(data.responseText);
            errorShowAlert(dataobj.text);
        }
    })
}
//一级债券
function newBonds(pageIndex,pageSize,bondType,propertydata,deadlinedata,ratingdata){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'get',
        timeout: 60000,
        url: ajaxUrl() + "newBonds",
        data: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            bondType: bondType,
            enterpriseNature: propertydata,
            bondTerm: deadlinedata,
            bondRating: ratingdata
        },
        headers : {
            'x-aster-token': token,
            'x-aster-terminal': terminal,
            'x-aster-version': version
        },
        async: 'false',
        dataType: 'json',
        success: function (data) {
            slideDownStep3();
            hideLoading();
            var a = data.listData;
            var tableData = "";
            var direction = "";
            var piaomianlilu = "";
            var directionClass = "";
            if(a.totalCount != 0){
                $(a).each(function (i, n) {
                    if (n.direction == 0) {
                        direction = "出";
                        directionClass = "income";
                    } else if (n.direction == 1) {
                        direction = "入";
                        directionClass = "spending";
                    }
                    tableData += '<tr>'
                        + '<td><span class="personname blue" dataid="' + n.id + '" datanote="'+ n.note+'">' + n.issued + '</span></td>'
                        + '<td data="1" class="orange">' + n.state + '</td>'
                        + '<td>' + n.zhaiquanjiancheng + '</td>'
                        + '<td class="blue">' + n.faxingshijian + '</td>'
                        + '<td>' + n.jiaokuanri + '</td>'
                        + '<td>' + n.shangshididian + '</td>'
                        + '<td>' + n.faxingrenjiancheng + '</td>'
                        + '<td>' + n.faxingrenqiyexingzhi + '</td>'
                        + '<td>' + n.zhutipingji + '/' + n.zhaiquanpingji + '</td>'
                        + '<td>' + n.piaomianlilu + '</td>'
                        + '<td>' + n.faxingqixiannian + '</td>'
                        + '<td>' + n.faxingguimoyi + '</td>'
                        + '<td class="wordbreak">' + n.zhuchengxiaoshang + '</td>'
                        + '<td class="orange">9:15</td>'
                        + '</tr>';
                });
                $("#MyTable tbody").append(tableData);
                var left = $("#MyTable_tableData").scrollLeft();
                var top = $("#MyTable_tableData").scrollTop();
                FixTable("MyTable", 1, tableW, screenH);
                $("#MyTable_tableData").scrollLeft(left);
                $("#MyTable_tableData").scrollTop(top);

            }else{
                FixTable("MyTable", 1, tableW, screenH);
                $("#MyTable_tableData").scrollLeft(left);
                $("#MyTable_tableData").scrollTop(top);
            }
            screenHide();
            reset();
        },
        error: function(data){
            hideLoading();
            var dataobj = JSON.parse(data.responseText);
            errorShowAlert(dataobj.text);
        }
    })
}

//现券
function bonds(pageIndex,pageSize,params){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'get',
        timeout: 60000,
        url: ajaxUrl() + "bonds",
        data: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            params: params
        },
        headers : {
            'x-aster-token': token,
            'x-aster-terminal': terminal,
            'x-aster-version': version
        },
        async: 'false',
        dataType: 'json',
        success: function (data) {
            slideDownStep3();
            hideLoading();
            var a = data;
            var tableData = "";
            var direction = "";
            var directionClass = "";
            if(a.totalCount != 0){
                $(a).each(function(i,n){
                    if(n.direction ==0){
                        direction = "出";
                        directionClass = "income";
                    }else if(n.direction ==1){
                        direction = "入";
                        directionClass = "spending";
                    }
                    tableData += '<tr>'
                        +'<td><span class="personname" dataid="' + n.id + '" datanote="'+ n.note+'">'+ n.userName+'</span><span class="gray">'+ n.companyShortName+'</span></td>'
                        +'<td data="'+ n.direction+'"><span class="'+ directionClass+'">'+ direction+'</span></td>'
                        +'<td>'+ n.bondCode+'</td>'
                        +'<td>'+ n.bondType+'/'+ n.bondName+'</td>'
                        +'<td class="blue">'+ n.amount+'</td>'
                        +'<td>'+ n.rate+'</td>'
                        +'<td data="'+ n.durationEnd+'">'+ n.tenor+'</td>'
                        +'<td>'+ n.rating+'/'+ n.issuerRating+'</td>'
                        +'<td>'+ n.range+'</td>'
                        +'<td class="orange">'+ n.time.substring(11,16)+'</td>'
                        +'</tr>';
                });

                $("#MyTable tbody").append(tableData);
                var left = $("#MyTable_tableData").scrollLeft();
                var top = $("#MyTable_tableData").scrollTop();
                FixTable("MyTable", 1, tableW, screenH);
                $("#MyTable_tableData").scrollLeft(left);
                $("#MyTable_tableData").scrollTop(top);
                $("#MyTable_tableLayout tr").click(function(){
                    var index = $(this).index();
                    var dataid = $(this).find(".personname").attr("dataid");
                    var datanote = $(this).find(".personname").attr("datanote");
                    $.cookie("dataid",dataid);
                    $.cookie("datanote",datanote);
                    location.href = "offerDetail.html"+locationSearch();
                });
            }
            screenHide();
            reset();
        },
        error: function(data){
            hideLoading();
            var dataobj = JSON.parse(data.responseText);
            errorShowAlert(dataobj.text);
        }
    })
}

//清空筛选条件
function reset(){
    $(".condition .form_btn").removeClass("blue_bg");
    var length = $(".condition li").length;
    for(var i=0;i<length;i++){
        $(".condition li").eq(i).find(".form_btn").eq(0).addClass("blue_bg");
    }
    $(".unit").removeClass("amountsel").eq(0).addClass("amountsel");
    $(".condition input").val("");
}
//筛选隐藏
function screenHide(){
    $(".condition").animate({left: '100%'}, "speed", function () {
        $(".form_screening").hide();
    });
    $(".foot_btn").animate({left: '100%'}, "speed");
    $(".screening").attr("data", "0");
    $(".screening").html('筛选<i class="icon_screening"></i>');
}