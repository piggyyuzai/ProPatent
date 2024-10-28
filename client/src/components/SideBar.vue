<template>
    <div class="sidebar">
        <img src="../assets/logo.png" class="sidebar-logo" alt="logo">
        <div class="sidebar-title">ProPatent</div>
        <div class="sidebar-title">AI专利撰写助手</div>
        <div style="margin-top: 20px;">
            <div v-for="(item, index) in pathList" :key="index" class="sidebar-menu" @click="navigate(item.path)" :class="{ active: item.path === activePath }" >
                <div>{{item.name}}</div>
            </div>
        </div>
        <!-- 用户信息区 -->
        <div v-if="isLoggedIn" class="user">
            <img :src="user.avatar" class="user-avatar" alt="用户头像">
            <div class="user-info">
                <div class="user-name">{{ user.phone }}</div>
                <div class="user-vip">会员到期时间：{{ user.membershipExpiry }}</div>
            </div>
        </div>
        <div v-if="isLoggedIn" class="logout" @click="logout">退出登录</div>
        <div v-else class="login" @click="login;navigate('/login')">登录</div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();

// 用户信息
import { userList } from '../mockData.js';
import { userid } from '../App.vue';
const user = ref(userList.find(u => u.id === userid));

const isLoggedIn = ref(true); // 初始设置为已登录状态
function logout() {
    isLoggedIn.value = false; // 设置为未登录状态
}

function login() {
    isLoggedIn.value = true; // 设置为已登录状态
    // 你可以在这里添加其他登录逻辑
}
const pathList = [
    {name:'专利撰写',path:'/',},
    {name:'文书查看',path:'/documentviewer',},
    {name:'知产咨询',path:'/ipchat',},
    {name:'IPC查询',path:'/ipcsearch',},
    {name:'我的订单', path:'/myorders',},
];
const activePath = ref(route.path); // active选项元素路径
function navigate(path) {
    if (path) {
        activePath.value = path; // 更新active的选项
        router.push(path);
    }
}
</script>

<style scoped>
/*菜单栏*/
.sidebar {
    flex-shrink:0;
    width:180px;
    background-color:#ffffff;
    display:flex;
    flex-direction:column;
    align-items:center;
    padding:20px 10px;
}
.sidebar-logo {
    width:30px;
    height:30px;
    margin-bottom:10px;
}
.sidebar-title {
    color:#4d70ff;
    font-weight:bold;
    font-size:16px;
}
.sidebar-menu {
    height:40px;
    width:160px;
    border-radius:10px;
    color:black;
    font-weight:bold;
    font-size:16px;
    text-align:center;
    line-height:40px;
    cursor:pointer;
    margin-bottom:4px;
}
.sidebar-menu.active,.sidebar-menu:hover {
    background-color:#dbe9fe;
    color:#4d70ff;
}

/*用户信息*/
.user {
    position:absolute;
    bottom:60px;
    display:flex;
    align-items:center;
    padding:0 20px;
}
.user-avatar {
    width:30px;height:30px;
    border-radius:5px;
}
.user-info {
    display:flex;
    flex-direction:column;
    justify-content:center;
    margin-left:5px;
}
.user-name {
    color:#4d70ff;
    font-weight:bold;
    font-size:16px;
}
.user-vip {
    color:#999999;
    font-size:10px;
}
.logout,.login {
    font-weight:bold;
    height:40px;
    width:160px;
    border-radius:10px;
    background-color: #eeeeee;
    color:black;
    font-size:16px;
    text-align:center;
    line-height:40px;
    cursor:pointer;
    position:absolute;
    bottom:10px;
}
.login {
    color:#4d70ff;
    background-color:#dbe9fe;
}
</style>
