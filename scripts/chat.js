// 调整输入框高度
function adjustHeight(textarea) {
    // 重置textarea高度
    textarea.style.height = "auto";
    // 计算textarea的新高度
    let newHeight = textarea.scrollHeight;
    // 设置新的高度，但限制最大高度为200px
    if (newHeight > 200) {
        textarea.style.height = "200px";
        textarea.style.overflowY = "scroll"; // 如果超过最大高度，显示滚动条
    } else {
        textarea.style.height = newHeight-40 + "px";
        textarea.style.overflowY = "hidden"; // 如果没有超过最大高度，隐藏滚动条
    }
}

let msgList = [];
msgList.forEach(msg => {
    addMessage(msg.role, msg.content);
});
// 在发送消息时保存消息列表到本地存储
function saveMessagesToLocalStorage() {
    localStorage.setItem('msgList', JSON.stringify(msgList));
}
// 在页面加载时从本地存储加载历史消息
window.onload = function() {
    const savedMsgList = JSON.parse(localStorage.getItem('msgList'));
    if (savedMsgList) {
        msgList = savedMsgList;
        msgList.forEach(msg => {
            addMessage(msg.role, msg.content);
        });
        addMessage('', '以上为历史消息');
    }
    // 如果是第一次发送消息，则显示当前日期和时间
    const currentDate = new Date().toLocaleString();
    addMessage('', currentDate);
    addMessage('assistant',
        '<div style="font-size:20px;font-weight:bold;">您好！我是ProPatent知识产权助手，请问有什么可以帮助你的吗？</div>' +
        '<div style="margin-top:4px;">我拥有强大的AI引擎，可以为进入中国、美国、欧洲、日本、英国和澳大利亚市场提供知识产权咨询。</div>' +
        '<div style="margin-top:10px;">您可以问我：</div>' + questionElements);
    newMsgList = [];
};
const questions = [
    '如何在中国注册商标？',
    '你能否解释一下中国的专利申请程序？',
    '你能否解释一下美国的版权程序？',
    '如何在美国申请发明专利？'
];
const questionElements = questions.map(question =>
    `<div style="cursor:pointer;margin-top:4px;" onclick="document.getElementById('user-input').value='${question}';sendMessage();"><li><u>${question}</u></li></div>`
).join('');


// 向聊天框中添加消息
function addMessage(role, content) {
    const chatContainer = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');

    if (role === '') {
        messageDiv.classList.add('message-divider');
        messageDiv.textContent = content;
        chatContainer.appendChild(messageDiv);
    } else {
        messageDiv.classList.add('message', role);
        messageDiv.innerHTML = `<img src="${role === 'user' ? 'https://piggyyuzai.github.io/KleeWeb/img/welcome.gif' : './asset/logo.png'}">
                                ${content}`;
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

    if (messageContent !== '') {
        const newMsg = { role: 'user', content: messageContent };
        msgList.push(newMsg);
        newMsgList.push(newMsg);
        addMessage('user', messageContent);
        messageInput.value = '';
        saveMessagesToLocalStorage();
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
                messages: newMsgList.slice(-10),// 只发送最近10条消息
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
                                            replyMessageDiv.innerHTML = `<img src="./asset/logo.png"> ${result}`;
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
                msgList.push(replyMsg);
                newMsgList.push(replyMsg);
                saveMessagesToLocalStorage();
            })
            .catch(error => {
                // 捕获错误并显示到消息框中
                console.error('Error fetching message:', error);
                hideMessage(thinking); // 隐藏 "思考中" 的消息占位符
                addMessage('assistant', `抱歉，出错了: ${error.message}`);
                msgList.push({ role: 'assistant', content: error.message });
                saveMessagesToLocalStorage();
            });
    }
}




// 设置面板
function settingBoard() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
    const settingBoard = document.getElementById('setting-board');
    settingBoard.style.display = settingBoard.style.display === 'block' ? 'none' : 'block';
    //每次点击设置时更新历史记录长度
    // 获取浏览器缓存中msgList的长度
    const msgListLength = JSON.parse(localStorage.getItem('msgList')).length;
    // 将msgList的长度直接放置在div中
    document.getElementById('msgListLength').innerHTML = `目前有：${msgListLength} 条历史消息`;

}
function delHistory() {
    var confirmed = confirm('确定要清除历史消息吗？');
    if (confirmed) {
        localStorage.removeItem('msgList');
        localStorage.setItem('msgList', JSON.stringify([])); // 将msgList设置为空数组
        location.reload(); // 刷新页面
    }
}

