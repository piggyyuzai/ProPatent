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
    addMessage('reply',
        '<div style="font-size:20px;font-weight:bold;">您好！我是ProPatent知识产权助手，请问有什么可以帮助你的吗？</div>' +
        '<div style="margin-top:4px;">我拥有强大的AI引擎，可以为进入中国、美国、欧洲、日本、英国和澳大利亚市场提供知识产权咨询。</div>' +
        '<div style="margin-top:10px;">您可以问我：</div>' +
        // '<div style="cursor:pointer;margin-top:4px;" onclick="document.getElementById(\'user-input\').value=\'如何在中国注册商标？\';sendMessage();"><li><u>如何在中国注册商标？</u></li></div>' +
        // '<div style="cursor:pointer;margin-top:4px;" onclick="document.getElementById(\'user-input\').value=\'你能否解释一下中国的专利申请程序？\';sendMessage();"><li><u>你能否解释一下中国的专利申请程序？</u></li></div>' +
        // '<div style="cursor:pointer;margin-top:4px;" onclick="document.getElementById(\'user-input\').value=\'你能否解释一下美国的版权程序？\';sendMessage();"><li><u>你能否解释一下美国的版权程序？</u></li></div>' +
        // '<div style="cursor:pointer;margin-top:4px;" onclick="document.getElementById(\'user-input\').value=\'如何在美国申请发明专利？\';sendMessage();"><li><u>如何在美国申请发明专利？</u></li></div>' +
        questionElements);
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


// 在发送消息时保存消息列表到本地存储
function saveMessagesToLocalStorage() {
    localStorage.setItem('msgList', JSON.stringify(msgList));
}

function addMessage(role, content) {
    const chatContainer = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');

    if (role === '') {
        messageDiv.classList.add('message-divider');
        messageDiv.textContent = content;
        chatContainer.appendChild(messageDiv);
    } else {
        messageDiv.classList.add('message', role);
        messageDiv.innerHTML = `<img src="${role === 'me' ? 'https://piggyyuzai.github.io/KleeWeb/img/welcome.gif' : './asset/logo.png'}">
                                ${content}`;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // 设置唯一标识符
        const messageId = 'message-' + Date.now() + '-' + Math.random();
        messageDiv.dataset.messageId = messageId;
        return messageId;
    }
}

function sendMessage() {
    const messageInput = document.getElementById('user-input');
    const messageContent = messageInput.value.trim();
    if (messageContent !== '') {
        const newMsg = { role: 'me', content: messageContent };
        msgList.push(newMsg);
        addMessage('me', messageContent);
        messageInput.value = '';
        saveMessagesToLocalStorage();

        const thinking = addMessage('reply', '小猪雨崽在思考哦，请稍等...');

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer Link_v0SpPeJUGHnfcScMDLdHd7HOPRs440zs3qszhBXesO'
            },
            body: JSON.stringify({ app_code: 'KoJA0clf', messages: [{ role: 'user', content: messageContent }] })
        };
        fetch('https://api.link-ai.chat/v1/chat/completions', options)
            .then(response => response.json())
            .then(response => {
                const replyContent = response.choices[0].message.content;
                const replyMsg = { role: 'reply', content: replyContent };
                hideMessage(thinking);
                msgList.push(replyMsg);
                addMessage('reply', replyContent);
                saveMessagesToLocalStorage();
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
    }
}

function hideMessage(messageId) {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
        messageElement.style.display = 'none';
    }
}
// Display initial messages
msgList.forEach(msg => {
    addMessage(msg.role, msg.content);
});
