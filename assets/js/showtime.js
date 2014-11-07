
function _(id){
    return document.getElementById(id);
}
var html='<div style="z-index: 2000;background: rgb(152, 152, 152);font-size: 40px;font-family: Arial;line-height: 34px;position: fixed;top: 60px;left: 7px;"><div id="stb_time" style="font-size: 40px;font-family: Arial;line-height: 34px;"></div></div>';
var node=document.createElement('div');
node.innerHTML=html;
document.body.appendChild(node);
var t=_('stb_time');//显示时间的节点
var btnlisten=setInterval(btnlistener,350);//检测秒杀按钮的监听器，执行5次
var cha;
var sub=false;
console.log('cookie'+document.cookie);
chrome.extension.sendRequest({action: "getcha"}, function(response) {
    cha=response.cha;
    if(response.sub=='true'){
        sub=true;
    }
    console.log('是否回车监听：'+sub);
});
/*
$.get('http://ax.m.taobao.com/qst.htm?f=w&id=41327469204&uid=1614962331&r='+new Date().getTime(),null,function(da){
    console.log(da);
},'text');
console.log($);
console.log($.post);
*/


//执行时间显示
setInterval(showtime,1000);

function showtime(){
    //获取时间差
    var stime=new Date(new Date().getTime()+cha);
    t.innerHTML=stime.toTimeString().substring(0,8);

}
//图片监听器，用来获取图片节点
var imgcl;
//计数
var count=0;
//是否找到秒杀按钮
var isFind=false;
function btnlistener(){
    //console.log('寻找按钮');
    var sk = document.getElementsByClassName('sk-button');
    if(sk.length>0){
        //console.log('找到按钮');
        sk[0].click();
        isFind=true;
    }else{
        //console.log('没有找到按钮');
        if(isFind){
            clearInterval(btnlisten);
            submit();
            imgcl=setInterval(imglistener,200);
            return;
        }
        if(++count>10){
            clearInterval(btnlisten);
        }

    }
}
//提交监听
var tijiaolisten;

function submit(){
    var input = document.getElementsByClassName("answer-input");
    if(input.length>0){
        //添加监听
        if(sub){
            console.log('注册监听');
            input[0].onkeydown = function(event) {
                if (event.keyCode == 13 || event.keyCode == 32) {
                    //修改按键监听后提交表单
                    tijiaolisten=setInterval(submitlistener,300);
                }
            }

        }
    }else{
        console.log('没有找到输入框');
    }
}

function submitlistener(){

    var jsubmits = document.getElementsByClassName('J_Submit');
    if(jsubmits.length>0){
        //console.log('正在提交表单');
        jsubmits[0].click();
    }else{
        //console.log('取消提交');
        clearInterval(tijiaolisten);
    }
}

function imglistener(){
    var imgs=document.getElementsByClassName('question-img');
    console.log('寻找图片');
    if(imgs.length>0){
        clearInterval(imgcl);
        //var input = document.getElementsByClassName("answer-input")[0];
        console.log('找到图片');
        //var img=imgs[0];
        /*var img=imgs[0];
        var imgajax=createAjax();
        var st=new Date().getTime();
        imgajax.open('get','http://localhost:8080/miao/miao?key='+img.src,true);
        imgajax.onreadystatechange=function(){
            if(imgajax.readyState==4){
                var result=imgajax.response.toString();
                console.log(result);
                var end=new Date().getTime();

                if(result!='null'){
                    console.log('卧槽、、、、、、、、、、、、找到了');
                    input.value=result.trim();
                }else{
                    console.log('未找到结果');
                }
                console.log('耗时'+(end-st));
            }
        };
        imgajax.send();*/
    }

}
