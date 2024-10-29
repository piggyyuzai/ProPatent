<template>
    <div id="ipchat">
        <!--菜单栏-->
        <SideBar />

        <!--历史记录-->
        <div class="history-container">
            <div id="new-message" class="message-item" @click="createNewChat">
                <img src="../assets/add.png">
                <div>创建新对话</div>
            </div>
            <div class="message-list">
                <div class="message-item active">
                    <img src="../assets/message.png">
                    <div>新的对话</div>
                </div>
                <div class="message-item">
                    <img src="../assets/message.png">
                    <div>历史对话</div>
                </div>
                <div class="message-item">
                    <img src="../assets/message.png">
                    <div>历史对话</div>
                </div>
            </div>
            <div id="setting-button" @click="toggleSettingBoard">
                <img src="../assets/setting.png">
                <div>对话设置</div>
            </div>
        </div>

        <!-- 对话设置面板 -->
        <div id="overlay" @click="toggleSettingBoard"></div>
        <div id="setting-board">
            <div class="close" @click="toggleSettingBoard">&times;</div>
            <div class="setting-title">设置</div>
            <div style="display:flex;align-items:center;justify-content:center;">
                <div id="msgListLength">目前有：{{ msgList.length }} 条历史消息</div>
                <button id="delHistory" @click="delHistory" class="setting-button" style="">
                    <svg width="20" height="20" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M595.09 828.83c-13.71 0-24.83-11.12-24.83-24.83V643.51c0-13.71 11.12-24.83 24.83-24.83s24.83 11.12 24.83 24.83V804c0 13.71-11.12 24.83-24.83 24.83z" fill="#448AFF" p-id="5391"></path><path d="M581.75 395.93c-13.71 0-24.83-11.12-24.83-24.83V238.83h-89.83V371.1c0 13.71-11.12 24.83-24.83 24.83s-24.83-11.12-24.83-24.83V224c0-19.2 15.62-34.83 34.83-34.83h119.49c19.21 0 34.83 15.62 34.83 34.83v147.1c0 13.71-11.12 24.83-24.83 24.83z" fill="#020202" p-id="5392"></path><path d="M788.98 544.92H235.02c-24.72 0-44.83-20.11-44.83-44.83V391.6c0-24.72 20.11-44.83 44.83-44.83h207.24c13.71 0 24.83 11.12 24.83 24.83 0 13.71-11.12 24.83-24.83 24.83H239.84v98.83h544.31v-98.83h-202.4c-13.71 0-24.83-11.12-24.83-24.83 0-13.71 11.12-24.83 24.83-24.83h207.24c24.72 0 44.83 20.11 44.83 44.83v108.49c-0.01 24.72-20.12 44.83-44.84 44.83z m0-148.49z" fill="#020202" p-id="5393"></path><path d="M756.74 833.83H267.26c-24.72 0-44.83-20.11-44.83-44.83V540.09c0-24.72 20.11-44.83 44.83-44.83h489.47c24.72 0 44.83 20.11 44.83 44.83V789c0.01 24.72-20.1 44.83-44.82 44.83z m-484.65-49.66H751.9V544.92H272.09v239.25z" fill="#020202" p-id="5394"></path><path d="M408.6 828.83c-13.71 0-24.83-11.12-24.83-24.83V643.51c0-13.71 11.12-24.83 24.83-24.83s24.83 11.12 24.83 24.83V804c0 13.71-11.12 24.83-24.83 24.83z" p-id="5395"></path></svg>
                    清除
                </button>
            </div>
        </div>

        <!-- 右侧对话窗口 -->
        <div class="chat-container">
            <!--消息框-->
            <div class="chat-box" id="chat-box"></div>
<!--            <div class="chat-box" id="chat-box">-->
<!--                <div v-for="(msg, index) in msgList" :key="index" class="message" :class="msg.role">-->
<!--                    <img :src="msg.role === 'user' ? userAvatar : assistantAvatar" />-->
<!--                    <span v-html="msg.content"></span>-->
<!--                </div>-->
<!--            </div>-->
            <div class="input-container">
                <textarea id="user-input" placeholder="请输入文字..." @input="adjustHeight"></textarea>
                <button id="send-button" @click="sendMessage">发 送</button>
            </div>
            <small> © 2024 ProPatent —— 坤晟智能. All Rights Reserved. </small>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SideBar from '../components/Sidebar.vue';

// 调整输入框高度
function adjustHeight(event) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight-40, 200)}px`;
    textarea.style.overflowY = textarea.scrollHeight > 200 ? 'scroll' : 'hidden';
}
// 在发送消息时保存消息列表到本地存储
function saveMessagesToLocalStorage() {
    localStorage.setItem('msgList', JSON.stringify(msgList.value));
}
let msgList = ref([]);
let newMsgList = ref([]);
// 在页面加载时从本地存储加载历史消息
onMounted(() => {
    msgList.value = JSON.parse(localStorage.getItem('msgList')) || [];
    msgList.value.forEach(msg => addMessage(msg.role, msg.content));
    addMessage('', '以上为历史消息');
    addMessage('', new Date().toLocaleString()); // 如果是第一次发送消息，则显示当前日期和时间
    addMessage('assistant',
        '<div style="font-size:20px;font-weight:bold;">您好！我是ProPatent知识产权助手，请问有什么可以帮助你的吗？</div>' +
        '<div style="margin-top:4px;">我拥有强大的AI引擎，可以为进入中国、美国、欧洲、日本、英国和澳大利亚市场提供知识产权咨询。</div>' +
        '<div style="margin-top:10px;">您可以问我：</div>' + questionElements);
});
const questions = [
    '如何在中国注册商标？',
    '你能否解释一下中国的专利申请程序？',
    '你能否解释一下美国的版权程序？',
    '如何在美国申请发明专利？'
];
const questionElements = questions.map(question =>
    `<div style="cursor:pointer;margin-top:4px;" onclick="document.getElementById('user-input').value='${question}';document.getElementById('send-button').click();"><li><u>${question}</u></li></div>`
).join('');


// 向聊天框中添加消息
const userAvatar = 'https://piggyyuzai.github.io/KleeWeb/img/welcome.gif';
const assistantAvatar = './logo.png';
function addMessage(role, content) {
    const chatContainer = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');

    if (role === '') {
        messageDiv.classList.add('message-divider');
        messageDiv.textContent = content;
        chatContainer.appendChild(messageDiv);
    } else {
        messageDiv.classList.add('message', role);
        messageDiv.innerHTML = `<img src="${role === 'user' ? userAvatar : assistantAvatar}">${content}`;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // 设置唯一标识符
        const messageId = 'message-' + Date.now() + '-' + Math.random();
        messageDiv.dataset.messageId = messageId;
        return messageId;
    }
}
// 隐藏指定消息
function hideMessage(messageId) {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
        messageElement.style.display = 'none';
    }
}
// 发送消息
function sendMessage() {
    const messageInput = document.getElementById('user-input');
    const messageContent = messageInput.value.trim();
    const chatBox = document.getElementById('chat-box');

    if (messageContent) {
        const newMsg = { role: 'user', content: messageContent };
        msgList.value.push(newMsg);
        newMsgList.value.push(newMsg);
        saveMessagesToLocalStorage();
        addMessage('user', messageContent);
        messageInput.value = '';
        const thinking = addMessage('assistant', 'ProPatent知识产权助手正在思考，请稍等...');
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer Link_v0SpPeJUGHnfcScMDLdHd7HOPRs440zs3qszhBXesO'
            },
            body: JSON.stringify({
                app_code: 'KoJA0clf',
                // messages: [{ role: 'user', content: messageContent }],
                messages: newMsgList.value.slice(-10),// 只发送最近10条消息
                stream: true
            })
        };
        fetch('https://api.link-ai.tech/v1/chat/completions', options)
            .then(async response => {
                // 检查响应是否正常
                if (!response.ok) throw new Error('Network response was not ok');

                const reader = response.body.getReader(); // 读取流式响应
                const decoder = new TextDecoder('utf-8');
                let result = '';

                while (true) {
                    // 从流中读取数据
                    const { done, value } = await reader.read(); // 从流中读取一个数据块
                    if (done) break; // 流结束，退出循环

                    const chunk = decoder.decode(value, { stream: true }); // 解码数据块为字符串
                    const lines = chunk.split('\n'); //将解码的字符串按行分割

                    // 处理每一行响应数据
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const jsonString = line.replace('data: ', '');
                            if (jsonString === '[DONE]') break; // 流结束标志

                            try {
                                // 解析 JSON 字符串
                                const chunkMessage = JSON.parse(jsonString);

                                if (chunkMessage.choices && chunkMessage.choices.length > 0 && chunkMessage.choices[0].delta) {
                                    let content = chunkMessage.choices[0].delta.content;

                                    // 格式化响应内容
                                    content = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                                    content = content.replace(/\n/g, '<br>');

                                    if (content) {
                                        // 累加响应内容
                                        result += content;
                                        // 更新显示正在思考的消息框
                                        const replyMessageDiv = document.querySelector(`[data-message-id="${thinking}"]`);
                                        if (replyMessageDiv) {
                                            replyMessageDiv.innerHTML = `<img src="${assistantAvatar}"> ${result}`;
                                        }
                                        // 滚动到最新消息位置
                                        chatBox.scrollTop = chatBox.scrollHeight;
                                    }
                                }
                            } catch (error) {
                                console.error('Error parsing JSON:', error);
                            }
                        }
                    }
                }

                // 将最终响应消息存入消息列表
                const replyMsg = { role: 'assistant', content: result };
                msgList.value.push(replyMsg);
                newMsgList.value.push(replyMsg);
                saveMessagesToLocalStorage();
            })
            .catch(error => {
                // 捕获错误并显示到消息框中
                console.error('Error fetching message:', error);
                hideMessage(thinking); // 隐藏 "思考中" 的消息占位符
                addMessage('assistant', `抱歉，出错了: ${error.message}`);
                msgList.value.push({ role: 'assistant', content: error.message });
                saveMessagesToLocalStorage();
            });
    }
}




// 设置面板
function toggleSettingBoard() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
    const settingBoard = document.getElementById('setting-board');
    settingBoard.style.display = settingBoard.style.display === 'block' ? 'none' : 'block';

}
function delHistory() {
    if (confirm('确定要清除历史消息吗？')) {
        localStorage.setItem('msgList', JSON.stringify([])); // 将msgList设置为空数组
        location.reload(); // 刷新页面
    }
}


</script>

<style scoped>
#ipchat {
    display:flex;
    margin:0;
    height:100vh;
}

/*历史记录*/
.history-container {
    flex-shrink:0;
    display:flex;
    flex-direction:column;
    align-items:center;
    width:200px;
    padding:20px 0;
    background-color:#f6f6f6;
    border-right:1px solid #e0e0e0;
    overflow-y:auto;
}
.history-container img {
    width:20px;
    height:20px;
    margin:0 10px;
}
.message-item,#new-message,#setting-button {
    width:140px;
    height:20px;
    display:flex;
    align-items:center;
    /*background-color:#dbe9fe;*/
    color:#4d70ff;
    padding:10px;
    border-radius:10px;
    margin-bottom:10px;
    font-size:14px;
    cursor:pointer;
}
.message-item.active,.message-item:hover {
    background-color:#dbe9fe;
}
#new-message {
    background-color:#4d70ff;
    color:white;
}
#setting-button {
    position:absolute;
    bottom:0;
    background-color:#dbe9fe;
}

/*设置窗口*/
#overlay {
    display:none;
    width:100vw;
    height:100vh;
    position:absolute;
    top:0;
    left:0;
    background-color:rgba(0,0,0,0.3);
    z-index:9998;
}
#setting-board {
    display:none;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    width:70vw;
    height:60vh;
    max-width:800px;
    max-height:600px;
    border-radius:20px;
    background-color: white;
    box-shadow: 0 0 20px #4d70ff;
    z-index:9999;
    padding:20px;
}
.close{
    position:absolute;
    top:8px;
    right:15px;
    cursor:pointer;
    font-size:30px;
}
.setting-title{
    text-align:center;
    color:#4d70ff;
    font-weight:bold;
    font-size:24px;
    margin-bottom:10px;
}
.setting-button{
    height:25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius:4px;
    border: none;
    color:#4d70ff;
    background-color:#dbe9fe;;
    margin:0 10px;
    cursor:pointer;
}

/*聊天窗口*/
.chat-container {
    flex-grow:1;
    display:flex;
    flex-direction:column;
    background:linear-gradient(to bottom left,#e3eeff,#ffffff);
    padding:20px;
    min-width:400px;
}
.chat-container small {
    color:gray;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:12px;
    margin-bottom: -20px;
}
#chat-box {
    flex-grow:1;
    overflow-y:auto;
    padding:0 20px;
    font-size:16px;
}
/*对话框*/
:deep(.message) {
    margin: 5px 50px;
    padding: 10px;
    border-radius: 10px;
    max-width: 70%;
    display: inline-block;
    width: auto;
    clear: both;
    position: relative;
}
:deep(.message img) {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    position: absolute;
    top: 0;
}
:deep(.message.user img) {
    right: -50px;
}
:deep(.message.assistant img) {
    left: -50px;
}
:deep(.message.user) {
    float: right;
    background-color: white;
    top: 0;
}
:deep(.message.assistant) {
    float: left;
    background: linear-gradient(to bottom left,rgba(77,112,255,0.3),rgba(77,255,249,0.3));
}
:deep(.message-divider) {
    text-align: center;
    clear: both;
    margin-top: 10px;
    color: gray;
}
/*输入框*/
.input-container {
    display:flex;
    margin-top:10px;
}
#user-input {
    font-family:Arial,sans-serif;
    flex-grow:1;
    padding:10px;
    font-size:16px;
    border:4px solid #dbe9fe;
    border-radius:10px;
    resize:none;
    height:17px;
    max-height:200px;
    overflow-y:hidden;
}
#send-button {
    margin-left:10px;
    width:120px;
    height:45px;
    border-radius:10px;
    font-size:16px;
    background:linear-gradient(to bottom left,#4d70ff,#4dfff9);
    color:white;
    border:none;
    cursor:pointer;
}




</style>