/**
 * Created by micrxd on 2014/11/4.
 */

function _(id){
    return document.getElementById(id);
}
var backgroud=chrome.extension.getBackgroundPage();
var echackbox=document.getElementById('echeckbox');
var tixing=_('tixing');
var saveBtn=_('saveBtn');
echackbox.checked=(localStorage['enterSubmit']=='true');
echackbox.onchange=function(){
  localStorage['enterSubmit'] =this.checked;
};
tixing.value=localStorage['tixing']||5;
saveBtn.onclick=function(){
  var t=tixing.value;
    if(t!='') {
        t=localStorage['tixing'] = Number(t);
        backgroud.tixing=t;
    }
};
