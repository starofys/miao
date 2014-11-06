var show=document.getElementById('show');
var resetTime=document.getElementById('resetTime');
var backgroud=chrome.extension.getBackgroundPage();
show.onclick=function(){
    backgroud.show();
};
resetTime.onclick=function(){
    backgroud.getNewTime();
};
var $=backgroud.$;
var shopsdiv=document.getElementById('shops');
/*
function showShops(shops){
    console.log(shops);
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
            p.innerText='来自：'+shop.from+'----商品价格：'+shop.costPrice+'----秒杀价格：'+shop.price;
            div3.appendChild(p);
            div2.appendChild(div3);
            li.appendChild(div2);
            notes.appendChild(li);
        });
        return notes;
    }
}
*/

function init(){
    shopsdiv.innerHTML=backgroud.getShopHtml();
    /*var shopdata=backgroud.shopData;
    var notes=document.createDocumentFragment();
    var li=document.createElement('li');
    li.innerText='时间区间：'+shopdata.startTimeStr+'--->'+shopdata.endTimeStr;
    notes.appendChild(li);
    var goods=shopdata.goods;
    goods.forEach(function(good){
        var sli=document.createElement('li');
        sli.innerText='秒杀开始时：'+good.timeStr;
        notes.appendChild(sli);
        notes.appendChild(showShops(good.data));
    });
    shopsdiv.appendChild(notes);*/

}
init();
