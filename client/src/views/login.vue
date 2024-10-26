<template>
    <div class="login-container">
        <h1>登录</h1>
        <form @submit.prevent="handleSubmit">
            <div class="input-group" id="username-input">
                <div class="input-label">用户名</div>
                <input type="text" id="username" v-model="username" placeholder="请输入用户名"/>
                <p v-if="errors.username" class="error">{{ errors.username }}</p>
            </div>
            <div class="input-group" id="password-input">
                <div class="input-label">密码</div>
                <input type="password" id="password" v-model="password" placeholder="请输入密码"/>
                <p v-if="errors.password" class="error">{{ errors.password }}</p>
            </div>
            <div class="input-group" id="captcha-input">
                <div class="input-label">验证码</div>
                <div style="display: flex; align-items: center; justify-content: center;">
                    <input type="text" id="captcha" v-model="captcha" placeholder="请输入验证码" style="width:250px;"/>
                    <canvas ref="captchaCanvas" width="100" height="36" @click="drawCaptcha" style="cursor:pointer;margin-left:10px;border:2px solid #dbe9fe;border-radius:6px;"></canvas>
                </div>
                <p v-if="errors.captcha" class="error">{{ errors.captcha }}</p>
            </div>
            <button type="submit">登录</button>
        </form>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';


// 随机颜色
const getRandomColor = () => {
    return '#' + Array.from({ length: 6 }, () => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]).join('');
}
// 绘制干扰线
const drawNoiseLines = (ctx, width, height) => {
    const maxLength = 40; // 干扰线最大长度
    for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = getRandomColor();
        ctx.lineWidth = Math.random() * 3; // 随机线宽
        ctx.beginPath();
        // 绘制波浪线
        const isWave = Math.random() < 0.5; // 50% 概率选择波浪线
        if (isWave) {
            const startX = Math.random() * width; // 随机起始 x 坐标
            const startY = Math.random() * height; // 随机起始 y 坐标
            // const amplitude = Math.random() * 5; // 随机振幅
            // const frequency = Math.random(); // 随机频率
            for (let x = startX; x < startX + maxLength; x += 5) { // 绘制波浪线
                // const y = startY + amplitude * Math.sin(frequency * (x - startX) + (Math.random() * 10 - 5)); // 计算 y 坐标
                const y = startY + (Math.random() * 10 - 5); // 计算 y 坐标
                ctx.lineTo(x, y); // 连接到下一个点
            }
        } else {
            // 绘制直线
            const startX = Math.random() * width;
            const startY = Math.random() * height;
            const endX = startX + (Math.random() * 2 - 1) * maxLength; // 计算终点 x 坐标
            const endY = startY + (Math.random() * 2 - 1) * maxLength; // 计算终点 y 坐标
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
        }
        ctx.stroke();
    }
};
// 绘制噪点
const drawNoise = (ctx, width, height) => {
    const noiseDensity = 0.03; // 噪点密度，调整此值以改变噪点数量
    const noiseCount = Math.floor(width * height * noiseDensity);
    for (let i = 0; i < noiseCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.fillStyle = '#000000'; // 随机颜色
        ctx.fillRect(x, y, 0.8, 0.8); // 绘制0.8*0.8的矩形，模拟噪点
    }
};
// 绘制验证码
const captchaCanvas = ref(null);
const drawCaptcha = () => {
    const canvas = captchaCanvas.value;
    const ctx = canvas.getContext('2d');
    const captchaLength = 4; // 验证码长度
    correctCaptcha.value = '';
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
    drawNoiseLines(ctx, canvas.width, canvas.height); // 绘制干扰线
    drawNoise(ctx, canvas.width, canvas.height); // 添加噪点
    for (let i = 0; i < captchaLength; i++) {
        const char = Math.random().toString(36).charAt(2); // 随机字符
        correctCaptcha.value += char; // 添加到验证码字符串
        // 随机偏移
        const xOffset = Math.random() * 10 - 5; // 随机左右偏移
        const yOffset = Math.random() * 10 - 5; // 随机上下偏移
        const rotation = (Math.random() - 0.5) * Math.PI / 6; // 随机旋转（±30度）
        ctx.save(); // 保存当前状态
        ctx.translate(10 + i * 20 + xOffset, 30 + yOffset); // 设置字符位置
        ctx.rotate(rotation); // 旋转字符
        ctx.fillStyle = getRandomColor(); // 设置随机颜色
        ctx.font = 'bold 30px Arial'; // 设置字体
        ctx.fillText(char, 0, 0); // 绘制字符
        ctx.restore(); // 恢复到之前的状态
    }
};
// 验证码状态
const correctCaptcha = ref(''); // 用于存储正确的验证码
// 在组件挂载时绘制验证码
onMounted(() => {
    drawCaptcha();
});

// 表单状态
const username = ref('');
const password = ref('');
const captcha = ref('');
const errors = reactive({username: '',password: '',captcha: '',});
// 表单提交处理逻辑
const handleSubmit = () => {
    errors.username = '';errors.password = '';errors.captcha = '';
    if (!username.value) {errors.username = '* 用户名不能为空';shake('username-input');}
    if (!password.value) {errors.password = '* 密码不能为空';shake('password-input');}
    if (!captcha.value) {errors.captcha = '* 验证码不能为空';shake('captcha-input');}
        else if (captcha.value !== correctCaptcha.value) {errors.captcha = '* 验证码错误';shake('captcha-input');}
    if (!errors.username && !errors.password && !errors.captcha) {
        console.log('用户名:', username.value);
        console.log('密码:', password.value);
        console.log('验证码:', captcha.value);
        alert('登录成功！');
    }
};
function shake(event) {
    const element = document.getElementById(event);
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 900);
}
</script>


<style scoped>
.login-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    padding: 40px;
    border: none;
    border-radius: 8px;
    box-shadow: 0 0 20px #4d70ff;
    text-align: center;
    background-color: #fff;
}
.input-group {
    margin-bottom: 10px;
}
.input-label {
    text-align: left;
    margin-left: 10px;
    margin-bottom: 4px;
    padding-left: 10px;
    border-left: 4px solid #4d70ff;
    font-size: 16px;
    color: #4d70ff;
    font-weight: bold;
}
input {
    width: 360px;
    padding: 10px;
    font-size: 14px;
    border: 2px solid #dbe9fe;
    border-radius: 4px;
}
button {
    display:block;
    text-align:center;
    margin:20px auto;
    width:120px;
    height:40px;
    border-radius:10px;
    font-size:16px;
    background:linear-gradient(to bottom left,#4d70ff,#4dfff9);
    color:white;
    border:none;
    cursor:pointer;
}
button:hover {
}
.error {
    color: red;
    font-size: 12px;
    margin-top: 5px;
    margin-bottom: -10px;
}
</style>
