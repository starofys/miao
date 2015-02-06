
function _(id){
    return document.getElementById(id);
}
function ExecScriptInPage(str){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = str.toString();
    document.head.appendChild(script);
}
//时间差
var cha=0;
//显示时间的节点
var t;
function showtime(){
    //获取时间差
    var stime=new Date(new Date().getTime()+cha);
    t.innerHTML=stime.toTimeString().substring(0,8);

}


//图片监听器，用来获取图片节点
var imgcl;
//查找图片监听计数
var fimgcount=0;
function imglistener(){
    var imgs=document.getElementsByClassName('question-img');
    console.log('寻找图片'+fimgcount);
    if(++fimgcount>10){
        clearInterval(imgcl);
    }
    if(imgs.length>0){
        clearInterval(imgcl);
        clearInterval(btnlisten);
        //var input = document.getElementsByClassName("answer-input")[0];
        console.log('找到图片');
        ExecScriptInPage("document.body.setAttribute('data-fp',JSON.stringify(window.Snapup.data));");
        setTimeout(FindQuestionInfo,100);
        //注册回车事件
        regsubmit();
    }

}
function Miao(){

}
//是否找到秒杀按钮
var isFind=false;
//按钮监听
var btnlisten;
//按钮计数
var btncount=0;

var miaowork;
function btnlistener(){
    //console.log('寻找按钮');
    var sk = document.getElementsByClassName('sk-button');
    if(sk.length>0){
        //console.log('找到按钮');
        //sk[0].click();

        var miaowork;

        var rs=/(\d.*).htm/.exec(location.href);

        if(rs&&rs.length==2){
            var shopId=rs[1];
            var url = "http://ax.m.taobao.com/qst.htm?f=w&id="+shopId;
            var kucun=document.body.getAttribute('kucun');
            var stime=document.body.getAttribute("stime");
            if(stime){
                var s=stime-new Date().getTime()+cha-2000;
                setTimeout(function(){
                    miaowork=setInterval(function(){
                        $.get(url,function(data){
                            if(data&&data.stock&&data.stock!=kucun){
                                sk[0].click();
                                clearInterval(miaowork);
                                imgcl=setInterval(imglistener,200);
                            }else{
                                console.log('时间未到');
                            }

                        },'json');
                    },300);
                },s);
                console.log(s/1000+'s 后开始刷新库存');
            }

        }
        isFind=true;
        clearInterval(imgcl);
        clearInterval(btnlisten);
    }else{
        console.log('没有找到按钮');
        /*if(isFind){
            clearInterval(btnlisten);
            regsubmit();
            //寻找图片和获取答案
            //imgcl=setInterval(imglistener,200);
            return;
        }*/
        if(++btncount>5){
            clearInterval(btnlisten);
        }

    }
}
//提交表单按钮监听计数
//var tijiaocount=0;
//提交监听
var tijiaolisten=0;
function submitlistener(){
    var jsubmits = document.getElementsByClassName('J_Submit');
    if(jsubmits.length>0){
        console.log('正在提交表单');
        jsubmits[0].click();
    }else{
        console.log('按钮消失取消提交');
        clearInterval(tijiaolisten);
    }
}
function FindInFo(key){
    var v=null;
    try{
        v=JSON.parse(document.body.getAttribute(key));
    }catch (e){
        console.log(e);
    }
    return v;
}
function FindQuestionInfo(){
    var questionInfo=FindInFo('data-fp');
    console.log('问题详情');
    console.log(questionInfo);
    if(/^[A-Za-z]+$/.exec(questionInfo.tip)==null){
        console.log('正在获取答案');
        getAnswer(questionInfo);
    }else{
        console.log('为字母 无法获取答案');
    }

}
function getAnswer(qu){

}
//是否注册表单提交
var sub=true;
//注册提交
function regsubmit(){
    var inputs = document.getElementsByClassName("answer-input");
    if(inputs.length>0){
        //添加监听
        if(sub){
            console.log('注册监听');
            inputs[0].onkeydown = function(event) {
                if (event.keyCode == 13 || event.keyCode == 32) {
                    //修改按键监听后提交表单
                    if(tijiaolisten==0){
                        tijiaolisten=setInterval(submitlistener,300);
                    }
                }
            }

        }
    }else{
        console.log('没有找到输入框');
    }
}

//初始化程序入口
(function(){
    var html='<div style="z-index: 2000;background: rgb(152, 152, 152);font-size: 40px;font-family: Arial;line-height: 34px;position: fixed;top: 60px;left: 7px;">' +
        '<div id="stb_time" style="font-size: 40px;font-family: Arial;line-height: 34px;"></div>' +
        '<button id="stb_getStr" style="display:none">获取</button>'+
        '</div>';
    var node=document.createElement('div');
    node.innerHTML=html;
    document.body.appendChild(node);
    chrome.extension.sendRequest({action: "getcha"}, function(response) {
        cha=response.cha;
        if(response.sub=='true'){
            sub=true;
        }
        console.log('是否回车监听：'+sub);
    });
    if(location.host.indexOf('miao.item')!=-1){


        /*ExecScriptInPage(
        'if(Snapup_config.seckill_platform!=1){Snapup_config.api.question="http://ax.m.taobao.com/qst.htm?f=w&id="+g_config.itemId+"&uid="+g_config.vdata.viewer.id;' +
        'Snapup_config.api.stock="http://m.ajax.taobao.com/stock2.htm?f=w&id="+g_config.itemId+"&uid="+g_config.vdata.viewer.id;}else{console.log("不支持手机秒杀");};' +
        'var uurl=Snapup_config.api.question;setInterval(function(){Snapup_config.api.question=uurl+"&r="+(new Date().getTime())},100);'
        );*/
        //ExecScriptInPage('');
        //ExecScriptInPage('Snapup_config.api.question="http://m.ajax.taobao.com/qst.htm?f=w&id="+g_config.itemId');

        //ExecScriptInPage('Snapup_config.api.question="http://ax.m.taobao.com/qst.htm?id="+g_config.itemId;');
        //ExecScriptInPage('Snapup_config.api.question="http://ax.m.taobao.com/qst.htm?id="+g_config.itemId;');

        //imgcl=setInterval(imglistener,200);
        btnlisten=setInterval(btnlistener,250);//检测秒杀按钮的监听器，执行5次
        ExecScriptInPage('document.body.setAttribute("kucun",g_config.idata.item.virtQuantity);' +
        'document.body.setAttribute("stime",g_config.idata.item.dbst)');

    }
    t=_('stb_time');
    //执行时间显示
    setInterval(showtime,1000);
})();
