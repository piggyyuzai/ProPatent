import { createRouter, createWebHashHistory } from 'vue-router';

const router = new createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "index",
            component: () => import("../views/index.vue"),
            meta: { title: "ProPatent——AI专利撰写助手" },
        },
        ...["ipchat", "ipcsearch"].map(route => ({
            path: `/${route}`,
            component: () => import(`../views/${route}.vue`),
            meta: { title: "ProPatent——AI专利撰写助手" },
        })),
        {
            path: "/test",
            component: () => import("../views/test.vue"),
            meta: { title: "测试页" },
        },
        {
            path: "/login",
            component: () => import("../views/login.vue"),
            meta: { title: "登录" },
        },
    ]
})
export default router