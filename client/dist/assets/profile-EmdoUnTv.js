import{r as v,h as b,c as i,a as k,b as a,w as p,j as m,t as d,g as c,o as n}from"./index-CicKsz4f.js";import{S as h}from"./SideBar-BjhrWKG5.js";import{_ as x}from"./_plugin-vue_export-helper-DlAUqK2U.js";const S={class:"container"},C={class:"user-profile"},E={class:"profile-picture"},U=["src"],N={class:"user-info"},V={class:"info-item"},w={key:1},B={class:"info-item"},I={key:1},D={class:"info-item"},J={class:"actions"},M={__name:"profile",setup(O){const t=v({name:"",mail:"",avatar:"",membershipExpiry:""});b(()=>{const u=localStorage.getItem("user");u&&(t.value=JSON.parse(u),r.value=t.value.avatar||"https://piggyyuzai.github.io/KleeWeb/img/welcome.gif")});const l=v(!1),s=v({...t.value}),r=v(t.value.avatar),f=()=>{l.value=!0,s.value={...t.value}},_=()=>{t.value={...s.value},r.value=s.value.avatar,localStorage.setItem("user",JSON.stringify(t.value)),l.value=!1},g=()=>{l.value=!1},y=u=>{const e=u.target.files[0];if(e){const o=new FileReader;o.onload=()=>{r.value=o.result,s.value.profilePicture=o.result},o.readAsDataURL(e)}};return(u,e)=>(n(),i("div",S,[k(h),a("div",C,[e[5]||(e[5]=a("h2",null,"用户信息",-1)),a("div",E,[a("img",{src:r.value,alt:"用户头像"},null,8,U),a("input",{type:"file",accept:"image/*",onChange:y},null,32)]),a("div",N,[a("div",V,[e[2]||(e[2]=a("label",null,"用户名：",-1)),l.value?p((n(),i("input",{key:0,"onUpdate:modelValue":e[0]||(e[0]=o=>s.value.name=o),type:"text"},null,512)),[[m,s.value.name]]):(n(),i("span",w,d(t.value.name),1))]),a("div",B,[e[3]||(e[3]=a("label",null,"邮箱：",-1)),l.value?p((n(),i("input",{key:0,"onUpdate:modelValue":e[1]||(e[1]=o=>s.value.mail=o),type:"email"},null,512)),[[m,s.value.mail]]):(n(),i("span",I,d(t.value.mail),1))]),a("div",D,[e[4]||(e[4]=a("label",null,"会员到期时间：",-1)),a("span",null,d(t.value.membershipExpiry),1)])]),a("div",J,[l.value?c("",!0):(n(),i("button",{key:0,onClick:f},"编辑")),l.value?(n(),i("button",{key:1,onClick:_},"保存")):c("",!0),l.value?(n(),i("button",{key:2,onClick:g},"取消")):c("",!0)])])]))}},z=x(M,[["__scopeId","data-v-b8d77b3a"]]);export{z as default};
