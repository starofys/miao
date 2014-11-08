/**
 * Created by micrxd on 2014/11/5.
 */
var stateInfo;
var tixing=5;
function show() {
    var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
    var hour = time[1] % 12 || 12;               // The prettyprinted hour.
    var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
    new Notification(hour + time[2] + ' ' + period, {
        icon: 'icon.png',
        body: 'Time to make the toast.'
    });
}
var cha;
function getNewTime() {
    console.log('开始校时');
    var stime = new Date().getTime();
    var end;
    var aj=$.get('http://a.tbcdn.cn/p/fp/2011a/assets/space.gif?_t='+stime,null,function(){
        var d = new Date(aj.getResponseHeader("Date"));
        end = new Date().getTime();
        cha = d.getTime() - (stime + ~~((end - stime) / 2));
        var now=new Date(end+cha);
        new Notification('现在时间：'+now.toTimeString().substring(0,8), {
            icon: '128x128.ico',
            body: '时间校准成功\n网络延迟：'+ ((end - stime) / 2)+'\n本地时差：'+cha
        });
    });
}
//setInterval(shows,3000);
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        switch(request.action) {
            case 'getcha':
                sendResponse({cha:cha,sub:localStorage['enterSubmit']});
                break;
        }
    });

//setInterval(show,2000);
/*
 // Conditionally initialize the options.
 if(!localStorage.isInitialized) {
 localStorage.isActivated = true;   // The display activation.
 localStorage.frequency = 1;        // The display frequency, in minutes.
 localStorage.isInitialized = true; // The option initialization.
 }
 // Test for notification support.
 if(window.Notification) {
 // While activated, show notifications at the display frequency.
 if(JSON.parse(localStorage.isActivated)) {
 show();
 }
 var interval = 0; // The display interval, in minutes.
 setInterval(function() {
 interval++;
 if(
 JSON.parse(localStorage.isActivated) &&
 localStorage.frequency <= interval
 ) {
 show();
 interval = 0;
 }
 }, 60000);
 }*/
var shopData;
getNewTime();

function showShops(shops){
    //console.log(shops);
    if(shops.length>0){
        var notes=document.createDocumentFragment();
        shops.forEach(function(shop){
            var li=document.createElement('li');
            var div=document.createElement('div');
            var img=document.createElement('img');
            img.src=shop.img;
            img.width=80;
            img.height=80;
            div.appendChild(img);
            div.className='shop_img';
            li.appendChild(div);
            var div2=document.createElement('div');
            var div3=document.createElement('div');
            var a=document.createElement('a');
            a.href=shop.link;
            a.innerText=shop.name;
            a.target='_blank';
            div3.appendChild(a);
            var p=document.createElement('p');
            p.className='decfont';
            p.innerText='来自：'+shop.from+'----商品价格：'+shop.costPrice+'----秒杀价格：'+shop.price;
            div3.appendChild(p);
            div2.appendChild(div3);
            li.appendChild(div2);
            notes.appendChild(li);
        });
        return notes;
    }
}
var shophtml=$('#shopsdiv');
var times=[];
function initShopHtml(shopdata){
    var shopsdiv=document.createDocumentFragment();
    var li=document.createElement('li');
    li.className='mian_time';
    li.innerText='时间区间：'+shopdata.startTimeStr+'--->'+shopdata.endTimeStr;
    shopsdiv.appendChild(li);
    var goods=shopdata.goods;
    times=[];
    goods.forEach(function(good){
        var sli=document.createElement('li');
        sli.className='stime';
        sli.innerText='秒杀开始时间：'+good.timeStr;
        times.push(good.time);
        shopsdiv.appendChild(sli);
        shopsdiv.appendChild(showShops(good.data));
    });
    shophtml.html(shopsdiv);

}
var goods;
function deleteShop(){
    goods.shift();
    if(goods.length==0){
        getShopData(stateInfo.startTime+1);
    }else{
        //重新初始化html
        initShopHtml(shopData);
    }
}
function regTixing(){
    var d=new Date().getTime();
    console.log(tixing+'分钟前提醒')
    times.forEach(function(t){
        var tx= (t-d)-60000*tixing;
        if(tx>0){
            console.log(tx/60000+'分钟后提醒');
            setTimeout(showTixing,tx);
        }
        var delt=t-d+60000;
        if(delt>0){
            console.log(delt/60000+'分钟后清除秒杀信息');
            setTimeout(deleteShop, delt);
        }else{
            deleteShop();
        }
    });
}
function showTixing(){
    new Notification(tixing+ '分钟后秒杀即将开始', {
        icon: '128x128.ico',
        body: '即将秒杀的商品名'+goods[0].data[0].name
    });
}
function getShopHtml(){
    if(shopData&&shopData.goods.length>0){
        return shophtml.html();
    }else{
        getShopData(new Date().getHours());
        return "<h3>正在获取商品。。<h3>";
    }

}

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//循环此处 防止无限循环
var count=0;
function getShopData(hour){
    //修复24小时获取消息造成无线循环
    if(hour>23){
        hour=0;
        var dt=new Date();
        dt.setDate(dt.getDate()+1);
        stateInfo.day=dt.Format('yyyyMMdd');
    }
    //执行次数大于24直接返回，防止无限循环
    if(++count>24){
        return;
    }
    console.log('正在获取'+hour+'点的商品信息');
    $.get('http://miaosha.taobao.com/index_data.htm?cb=%20&d='+stateInfo.day+'&h='+hour,null,function(data){
        var d=/{([\s\S]*)}/.exec(data);
        if(d!=null&&d.length>0){
            var ttemp=JSON.parse(d[0]);
            if(ttemp.goods.length==0){
                getShopData(++hour);
            }else{
                shopData=ttemp;
                goods=shopData.goods;
                initShopHtml(shopData);
                //获取成功，重置次数
                count=0;
                //注册提醒
                regTixing();
                //保存商品
                localStorage['shopData']=JSON.stringify(shopData);
                stateInfo.date=new Date().getDate();
                stateInfo.startTime=hour;
                //保存配置项
                localStorage['stateInfo']=JSON.stringify(stateInfo);
            }
        }
    },'text');


}

//初始化配置
function initConfig(){
    var dhour=new Date();
    stateInfo=localStorage['stateInfo'];
    var t=localStorage['tixing']||5;
    tixing=Number(t);
    if(stateInfo){
        console.log('解析配置');
        //解析配置
        stateInfo=JSON.parse(localStorage['stateInfo']);
        //如果当前时间小于或者等于状态开始时间，说明数据有效直接从本地获取数据并且初始化html,否则重新获取商品并保存配置
        //console.log(stateInfo.startTime);
        if(dhour.getHours()<=stateInfo.startTime||stateInfo.date>dhour.getDate()){
            var tmp=localStorage['shopData'];
            console.log('从本地获取数据');
            if(tmp){
                shopData=JSON.parse(tmp);
                goods=shopData.goods;
                initShopHtml(shopData);
                //注册提醒
                regTixing();
                return;
            }
        }
    }
    stateInfo={};
    stateInfo.day=new Date().Format('yyyyMMdd');
    getShopData(dhour.getHours());
}
initConfig();
