/**
 * Created by ankang on 2016/10/20.
 */
var tableW = $(".table_container").css("width");
var fontS = $("html").css("font-size").replace("px","")-0;
var screenH = $(window).height() - fontS*3.6;
$(function(){

    FixTable("MyTable", 1, tableW, screenH);
    $(".rank").click(function(){
        var type = $(this).index();
        var that = $(this).find("i");
        console.log(type);
        if(that.hasClass("icon_top")){
            that.removeClass("icon_top").addClass("icon_low");
            rank(type,0);
        }else{
            that.removeClass("icon_low").addClass("icon_top");
            rank(type,1);
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
    $("#" + TableID + "_tableHead").css({ "overflow": "hidden", "width": width, "position": "relative", "z-index": "45"});
    $("#" + TableID + "_tableColumn").css({ "overflow": "hidden", "height": height, "position": "relative", "z-index": "40"});
    $("#" + TableID + "_tableData").css({ "overflow": "scroll", "width": width, "height": height, "position": "relative", "z-index": "35" });
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
function rank(type,data){
    var list = $("#MyTable tbody tr");
    var length = list.length;
    var arr = [];
    arrList = [];
    var i= 0, j, c, d;
    for(i=0;i<length;i++){
        arrList[i] = list.eq(i);
        if(type == 1){  //1：方向 2：金额 3：利率 4：发布时间
            arr[i] = list.eq(i).find("td").eq(type).attr("data")-0;
        }else if(type == 3){
            arr[i] = list.eq(i).find("td").eq(type).html()-0;
        }else if(type == 4){
            arr[i] = list.eq(i).find("td").eq(type).html().replace(/%/,"")-0;
        }else if(type == 6){
            arr[i] = timeCount(list.eq(i).find("td").eq(type).html());
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
        $("#MyTable th").eq(type).find("i").removeClass("icon_low").addClass("icon_top");
    }else{
        $("#MyTable th").eq(type).find("i").removeClass("icon_top").addClass("icon_low");
    }
    FixTable("MyTable", 1, tableW, screenH);
    $("#MyTable_tableData").scrollLeft(left);
    $(MyTable_tableData).scrollTop(top);

}

function timeCount(str){
    var arr = str.split(":");
    var length = arr.length;
    var time;
    time = 3600*arr[0]+60*arr[1];
    return time
}