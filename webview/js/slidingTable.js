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
    FixTable("MyTable", 1, tableW, screenH);

    $(".rank").click(function(){
        var index = $(this).index();
        var type = $(this).attr("datatype");
        var that = $(this).find("i");
        console.log(type);
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
            $(".form_screening").show();
            $(".condition").animate({left:'0'},"speed",function(){

            });
            $(".foot_btn").animate({left:'10%'},"speed");
            $(this).attr("data","1");
        }else{
            $(".condition").animate({left:'100%'},"speed",function(){
                $(".form_screening").hide();
            });
            $(".foot_btn").animate({left:'100%'},"speed");
            $(this).attr("data","0");
        }

    });
    $(".form_screening").bind("click",function(e){
        e.stopPropagation();
        $(".condition").animate({left:'100%'},"speed",function(){
            $(".form_screening").hide();
        });
        $(".foot_btn").animate({left:'100%'},"speed");
        $(".screening").attr("data","0");
    });
    $(".condition").bind("click",function(e){
        e.stopPropagation();
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
        arrList[i] = list.eq(i);
        if(type == 1){  //1：方向 2：金额 3：利率 4：发布时间
            arr[i] = list.eq(i).find("td").eq(index).attr("data")-0;
        }else if(type == 2){
            arr[i] = list.eq(i).find("td").eq(index).html()-0;
        }else if(type == 3){
            arr[i] = list.eq(i).find("td").eq(index).html().replace(/%/,"")-0;
        }
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
                }
            }
        }
    }
    //console.log(arrList);
    //$("#MyTable_tableColumnClone tbody").html("").append(arrList);
    console.log($("#MyTable_tableColumnClone tbody tr").length);
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

/* //时间转换
function timeCount(str){
    var arr = str.split(":");
    var length = arr.length;
    var time;
    time = 3600*arr[0]+60*arr[1];
    return time
}
*/



//滚动到底时加载数据
function goNextPage(){
    console.log("加载");
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
                console.log(pageIndex);
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
    slideDown1.style.height = (parseInt("50px") - dist) + "px";
}
//第二步：下拉，然后松开，
function slideDownStep2() {
    var slideDown1 = document.getElementById("slideDown1"),
        slideDown2 = document.getElementById("slideDown2");
    slideDown1.style.display = "none";
    slideDown1.style.height = "50px";
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
        var scrollT = $("#MyTable_tableData").scrollTop();
        if(scrollT<=0){
            var touch = event.targetTouches[0];
            if(way == "y") {
                _end = (_start - touch.pageY);
                //下滑才执行操作
                if(_end < 0) {
                    slideDownStep1(_end);
                }

            }/* else {
             _end = (_start - touch.pageX);
             }*/
        }
    }

    function touchEnd(event) {
        if(_end > 23) {
            console.log("左滑或上滑  " + _end);
            goNextPage();
        } else if(_end < 0){
            console.log("右滑或下滑" + _end);
            slideDownStep2();
            //刷新成功则
            //模拟刷新成功进入第三步
            setTimeout(function() {
                slideDownStep3();
            }, 1000);
        }
    }
}