import{x as h,y as f,r as l,h as I,o as a,c as o,b as e,F as k,d as S,n as w,t as c,g as b}from"./index-Blb7us2k.js";import{_ as y}from"./_plugin-vue_export-helper-DlAUqK2U.js";const x=""+new URL("logo-DvZ5ep1u.png",import.meta.url).href,C={class:"sidebar"},L={style:{"margin-top":"20px"}},B=["onClick"],P=["title"],E=["src"],N={class:"user-info"},R={class:"user-name"},D={class:"user-vip"},F={__name:"SideBar",setup(V){const m=h(),v=f(),t=l([]),r=l(localStorage.getItem("isLoggedIn"));function g(){r.value=!1,window.localStorage.removeItem("isLoggedIn"),window.localStorage.removeItem("token"),window.localStorage.removeItem("user")}I(()=>{localStorage.getItem("isLoggedIn")==="true"&&(t.value=JSON.parse(window.localStorage.user))});const p=[{name:"专利撰写",path:"/"},{name:"文书查看",path:"/documentviewer"},{name:"知产咨询",path:"/ipchat"},{name:"IPC查询",path:"/ipcsearch"}],u=l(v.path);function d(n){n&&(u.value=n,m.push(n))}return(n,s)=>(a(),o("div",C,[s[1]||(s[1]=e("img",{src:x,class:"sidebar-logo",alt:"logo"},null,-1)),s[2]||(s[2]=e("div",{class:"sidebar-title"},"ProPatent",-1)),s[3]||(s[3]=e("div",{class:"sidebar-title"},"AI专利撰写助手",-1)),e("div",L,[(a(),o(k,null,S(p,(i,_)=>e("div",{key:_,class:w(["sidebar-menu",{active:i.path===u.value}]),onClick:$=>d(i.path)},[e("div",null,c(i.name),1)],10,B)),64))]),r.value?(a(),o("div",{key:0,class:"user",title:t.value.name+`
会员到期时间：`+t.value.membershipExpiry},[e("img",{src:t.value.avatar,class:"user-avatar",alt:"用户头像"},null,8,E),e("div",N,[e("div",R,c(t.value.name),1),e("div",D,"会员到期时间："+c(t.value.membershipExpiry),1)])],8,P)):b("",!0),r.value?(a(),o("div",{key:1,class:"logout",onClick:g},"退出登录")):(a(),o("div",{key:2,class:"login",onClick:s[0]||(s[0]=i=>{d("/login")})},"登录"))]))}},J=y(F,[["__scopeId","data-v-0391737b"]]);export{J as S,x as _};
