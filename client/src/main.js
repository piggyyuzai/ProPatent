import { createApp } from 'vue';
import App from './App.vue';
import router from './router';


router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'ProPatent——AI专利撰写助手';
    next();
});
const changeFavicon = () => {
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
        link.href = "../public/favicon.ico"; // Update to the correct path
    }
};

createApp(App).use(router).mount('#app');



