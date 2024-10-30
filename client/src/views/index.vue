<template>
    <div id="ProPatent">
        <!--菜单栏-->
        <SideBar/>

        <!--流程栏-->
        <div class="flow-container">
            <div class="flow-title">智能撰写流程</div>
            <div class="flow-title2">(示例仅供参考)</div>
            <!-- 每个流程步骤 -->
            <div class="flow-item" v-for="(step, index) in steps" :key="index">
                <div class="step">
                    <div class="step-number">{{ step.number }}</div>
                    <div class="step-title">{{ step.title }}</div>
                </div>
                <div class="step-line" v-if="step.description">
                    <div class="step-description" v-html="step.description"></div>
                </div>
            </div>
            <div class="step" style="display:none;"><div class="step-number">5</div><div class="step-title"></div></div>
            <div class="step-line" style="display:none;"><div class="step-description"></div></div>
        </div>

        <!-- 右侧对话窗口 -->
        <div class="chat-container">
            <div id="chat-box">
                <!-- 初始 -->
                <div id="base-input">
                    <div class="ai-title">
                        <img src="../assets/logo.png" class="ai-logo">
                        AI一键生成，为您节省撰写时间！
                    </div>
                    <div class="title">技术交底书</div>
                    <div style="font-size:12px;margin-top:-10px;margin-bottom:20px;">提供技术交底书，统一技术交底书格式标准</div>
                    <div class="row" style="border-left:4px solid #4d70ff;padding-left:10px;">请输入专利名称：</div>
                    <div class="row" style="margin-top:0;">
                        <input type="text" id="file-title" placeholder="请输入专利名称" autocomplete="off">
                    </div>
                    <div id="file-input-title" class="row" style="border-left:4px solid #4d70ff;padding-left:10px;">上传技术交底书.docx文件</div>
                    <div style="margin-top:8px;width:100%;text-align:left;">
                        <input type="file" id="file-input" accept=".docx,.txt">
                    </div>
                    <div class="row" style="font-size:10px;margin-top:5px;">* 如有错误只需重新上传文件即可</div>
                    <div class="row" style="border-left:4px solid #4d70ff;padding-left:10px;">上传技术交底书附图</div>
                    <div style="margin-top:8px;width:100%;text-align:left;">
                        <input type="file" id="tech-image-upload" accept="image/*" multiple @change="handleImageUpload">
                    </div>
                    <div class="row" style="font-size:10px;margin-top:5px;">* 注意：请单独上传附图，并且上传的附图序号需要与技术交底书中文本内容对应；为了提高生成质量，请在附图中标明部件或流程编号。</div>
                    <div id="image-preview" style="margin-top:10px;display:flex;flex-wrap:wrap;">
                        <div v-for="(image, index) in imagePreviews" :key="index" style="display:flex;flex-direction:column;align-items:center;margin:0 4px 4px;">
                            <img :src="image" style="max-height:50px;display:block;">
                            <div style="font-size:12px;">图{{ index + 1 }}</div>
                        </div>
                    </div>
                    <div class="row" id="user-agreement" style="margin-bottom:30px;">
                        <input type="checkbox" id="checkbox" v-model="isChecked" @change="isChecked && userAgreement()" style="margin-right:5px;cursor:pointer;">
                        <span style="font-size:14px;">
                            我已阅读并同意
                            <span style="color:#4d70ff;font-weight:bold;cursor:pointer;" @click="userAgreement()">用户使用协议</span>
                            和
                            <span style="color:#4d70ff;font-weight:bold;cursor:pointer;" @click="">隐私政策</span>
                            并同意：生成内容仅供参考，不作为正式递交申请使用
                        </span>
                    </div>
                    <button id="input-file-button" class="send-button" @click="inputFile()">提交生成</button>
                </div>

                <!--提取内容-->
                <div id="extract-input">
                    <div class="title">技术交底书标准化</div>
                    <div id="extract-title" class="row" style="margin-bottom:10px;font-weight:bold;">
                        <img src="../assets/check.png" style="width:30px;height:30px;margin-right:10px;">
                        核对修改交底书
                    </div>
                    <div id="extract-content" class="border-box" contenteditable='true'>
                        <div>正在读取中，请稍后...</div>
                    </div>
                    <div id="tech-title" class="row" style="margin-bottom:10px;font-weight:bold;">
                        <img src="../assets/tech.png" style="width:30px;height:30px;margin-right:10px;">
                        请输入核心技术特征
                    </div>
                    <div id="tech-content" class="border-box" contenteditable='true' onclick="if(this.innerText.trim()==='请输入核心技术特征...')this.innerText='';">
                        <div>请输入核心技术特征...</div>
                    </div>
                    <div class="button-container">
                        <button class="back-button" @click="nextStep('extract-input','base-input', 5, 1)">上一步</button>
                        <button id="ipc-search-button" class="send-button" @click="ipcSearch();">生成权利要求1</button>
                    </div>
                </div>

                <!--IPC分类号查询-->
                <div id="ipc-search">
                    <div class="title">权利要求1</div>
                    <div id="ipc-title" class="row" style="margin-bottom:10px;font-weight:bold;">
                        <img src="../assets/check.png" style="width:30px;height:30px;margin-right:10px;">
                        核对修改权利要求1
                    </div>
                    <div id="ipc-content" class="border-box" contenteditable='true'>
                        <div>生成中，请稍后...</div>
                    </div>
                    <!--            <div class="row">-->
                    <!--                <a href="./file/IPC分类号表单.pdf">查看IPC分类号表单</a>-->
                    <!--            </div>-->
                    <div class="button-container">
                        <button class="back-button" @click="nextStep('ipc-search','extract-input', 5, 2)">上一步</button>
                        <button id="ipc-confirm-button" class="send-button" @click="output();">确认</button>
                    </div>
                </div>

                <!--生成专利申请书-->
                <div id="output">
                    <div class="title">导出专利申请书</div>
                    <div class="row" style="margin:0 auto 10px;font-weight:bold;">
                        核对修改专利申请书
                    </div>
                    <div id="output-content" class="border-box" contenteditable='true'>
                        <div>生成中，请稍后...</div>
                    </div>
                    <div class="button-container">
                        <button class="back-button" @click="nextStep('output','ipc-search', 5, 3)">上一步</button>
                        <button id="output-button" class="send-button" @click="copyToClipboard('output-content')">一键复制</button>
                    </div>
                </div>

                <!--客服-->
                <div id="service">
                    <div id="service-box" @click="toggleCodeBox()">
                        <img src="../assets/service.png" class="service-logo">
                        微信客服
                    </div>
                    <div id="code-box">
                        微信客服
                        <img src="../assets/code.png" class="qr-code">
                        服务时间：9:00-18:00
                    </div>
                </div>
            </div>
            <small> © 2024 ProPatent —— 坤晟智能. All Rights Reserved. </small>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import SideBar from '../components/Sidebar.vue';

// 流程步骤
const steps = ref([
    { number: 1, title: '输入技术交底书', description: `<div style="font-weight:bold;">技术领域：</div><div>本课题研究“多段带鳍薄壁曲线壳体分段成形工艺方法”以及成形过程中使用的装置“多段曲线薄壁壳体自定心装焊组合装置”、“带鳍薄壁曲线壳体的鳍板预焊装置及工艺”的设计...</div>` },
    { number: 2, title: '技术交底书标准化', description: `<div>1. 现有技术及存在的技术问题...</div><div>2. 本申请的技术方案以及达到的技术效果...</div><div>3. 具体实施例...</div><div>4. 其它（比如流程图、结构图的描述）...</div>` },
    { number: 3, title: '生成权利要求1', description: `<div>一种壳体定位装置，其特征在于，包括：</div><div>固定模，于所述固定模的顶端设置有用于将待加工壳体轴向的一侧夹持固定的第一U型体...</div>` },
    { number: 4, title: '生成专利申请书', description: `<div style="font-weight:bold;">说明书摘要</div><div>本发明公开一种壳体定位装置及壳体成形方法。其中，该装置包括：固定模和移动模...</div><div style="font-weight:bold;">权利要求书</div><div>一种壳体定位装置，其特征在于，包括：</div><div>固定模，于所述固定模的顶端设置有用于将待加工壳体轴向的一侧夹持固定的第一U型体...</div><div style="font-weight:bold;">说明书</div><div>一种壳体定位装置及壳体成形方法</div><div style="font-weight:bold;">技术领域</div><div>本发明涉及壳体加工技术领域，具体而言，涉及一种壳体定位装置及壳体成形方法...</div>` },
    // { number: 5, title: '', description: `<div></div>` },
]);

// 上传文件
async function inputFile() {
    const fileInputTitle = document.getElementById("file-input-title");
    const fileInput = document.getElementById("file-input");
    const extractContent = document.getElementById("extract-content");
    const checkbox = document.getElementById("checkbox");
    const userAgreement = document.getElementById("user-agreement");

    if (!checkbox.checked || !fileInput.files.length) {
        if (!checkbox.checked) shake(userAgreement);
        if (!fileInput.files.length) {
            shake(fileInputTitle);
            shake(fileInput);
        }
        return;
    }
    // 处理文件读取
    const file = fileInput.files[0];
    const fileTypeHandlers = {
        "application/pdf": async () => {
            const content = await readPdf(file);
            displayTextContent(content, extractContent);
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": async () => {
            await readDocx(file, extractContent);
        },
        "text/plain": async () => {
            const content = await readTxt(file);
            displayTextContent(content, extractContent);
        }
    };
    const handler = fileTypeHandlers[file.type];
    if (handler) {
        nextStep('base-input', 'extract-input', 1, 5);
        await handler();
    } else {
        alert("不支持的文件格式！");
    }
    // fileInput.value = ""; // 清空文件选择框
}
// 显示文本内容到指定区域
function displayTextContent(textContent, extractContent) {
    extractContent.innerHTML = ""; // 清空提取内容
    if (textContent.trim()) {
        var fileDiv = document.createElement("div");
        fileDiv.textContent = textContent;
        extractContent.appendChild(fileDiv);
    }
}
// 读取 DOCX 文件内容
import mammoth from 'mammoth';
async function readDocx(file, extractContent) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = function (event) {
            const arrayBuffer = event.target.result;

            // 将 DOCX 转换为纯文本
            // mammoth.extractRawText({ arrayBuffer: arrayBuffer }).then(function (result) {
            //     var textContent = result.value;
            //     console.log("DOCX 文件提取的纯文本: ", textContent);
            // }).catch(function (err) {
            //     console.error("DOCX 转换为纯文本出错: ", err);
            // });

            // 将 DOCX 转换为 HTML 格式并显示在页面上
            mammoth.convertToHtml({ arrayBuffer: arrayBuffer }).then(function (result) {
                let htmlContent = result.value;
                // 设置图片格式     display:block;
                htmlContent = htmlContent.replace(/<img /g, '<img style="display:none;max-width:40%;max-height:40vh;margin:0 auto;" ');
                // 创建一个可编辑的 div，并将 HTML 内容插入其中
                extractContent.innerHTML = htmlContent + '<br><br><div>附图：</div><br>';
                // 获取附图和编号，添加到内容框中
                const images = document.querySelectorAll('#image-preview img');
                images.forEach((img, index) => {
                    const imageElement = document.createElement('img');
                    imageElement.src = img.src;
                    imageElement.style.cssText = 'display:block;max-width:40%;max-height:40vh;margin:0 auto;';
                    const caption = document.createElement('div');
                    caption.innerText = `图${index + 1}`; // 编号从1开始
                    caption.style.cssText = 'font-size:12px;text-align:center;'
                    // 将附图及其编号插入到 extractContent 中
                    extractContent.appendChild(imageElement);
                    extractContent.appendChild(caption);
                });
                resolve(); // 解析 Promise
            }).catch(function (err) {
                console.error("DOCX 转换为 HTML 出错: ", err);
                reject(err);
            });
        };
        reader.onerror = function (error) {
            console.error("文件读取错误: ", error);
            reject(error);
        };
        reader.readAsArrayBuffer(file);
    });
}
// 读取 TXT 文件内容
async function readTxt(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.readAsText(file);
    });
}
// 读取 PDF 文件内容
// async function readPdf(file) {
//     const pdfjsLib = await import('../scripts/pdf.min.js');
//     const fileReader = new FileReader();
//     return new Promise((resolve) => {
//         fileReader.onload = async function () {
//             const pdfData = new Uint8Array(fileReader.result);
//             const pdf = await pdfjsLib.getDocument(pdfData).promise;
//             let textContent = "";
//             for (let i = 1; i <= pdf.numPages; i++) {
//                 const page = await pdf.getPage(i);
//                 const text = await page.getTextContent();
//                 textContent += text.items.map(item => item.str).join(" ") + "\n";
//             }
//             resolve(textContent);
//         };
//         fileReader.readAsArrayBuffer(file);
//     });
// }

// 上传图片与预览
const imagePreviews = ref([]);
const handleImageUpload = (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreviews.value.push(e.target.result); // 将图片结果添加到数组
        };
        reader.readAsDataURL(file);
    }
};

// AI对话回复
async function aiChat(messageToSend,contentAreaId) {
    var contentArea = document.getElementById(contentAreaId);
    const url = "https://api.link-ai.tech/v1/chat/completions";
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer Link_v0SpPeJUGHnfcScMDLdHd7HOPRs440zs3qszhBXesO"
    };
    const body = JSON.stringify({
        "app_code": "KoJA0clf",
        "messages": [{"role": "user", "content": messageToSend}],
        "stream": true
    });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: body
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let result = '';

        while (true) {
            const { done, value } = await reader.read(); // 从流中读取一个数据块
            if (done) break; // 如果流结束，则退出循环

            const chunk = decoder.decode(value, { stream: true }); // 解码数据块为字符串
            const lines = chunk.split('\n'); //将解码的字符串按行分割
            // 解析每一行数据
            for (const line of lines) {
                if (line.startsWith("data: ")) { // 检查是否是数据块的开头
                    const jsonString = line.replace("data: ", ""); // 移出开头的 "data: "
                    if (jsonString === "[DONE]") {
                        break; // 流结束退出
                    }
                    // 解析 JSON 数据块
                    try {
                        const chunkMessage = JSON.parse(jsonString);
                        if (chunkMessage.choices && chunkMessage.choices.length > 0) {
                            const content = chunkMessage.choices[0].delta.content; // 获取内容
                            if (content) {
                                result += content; // 将内容追加到结果字符串中
                                // 更新页面显示
                                contentArea.innerText = result;
                            }
                        }
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// IPC信息
function ipcSearch() {
    const techTitle = document.getElementById("tech-title");
    const techContent = document.getElementById("tech-content");
    const extractTitle = document.getElementById("extract-title");
    const extractContent = document.getElementById("extract-content");
    let valid = true;
    valid = checkAndShake(extractTitle, extractContent, "正在读取中，请稍后...") && valid;
    valid = checkAndShake(techTitle, techContent, "请输入核心技术特征...") && valid;
    if (valid) {
        nextStep('extract-input', 'ipc-search', 2, 5);
        // 将 extractContent.innerText 与请求消息拼接
        const messageToSend = `${extractContent.innerText}${techContent.innerText} 帮我生成权力要求 `;
        // var messageToSend = `${extractContent.innerText}${techContent.innerText} 帮我查询这个专利技术交底书的IPC分类号和分类说明。';
        aiChat(messageToSend, 'ipc-content');
    }
}

// 最终稿输出
function output() {
    const extractContent = document.getElementById("extract-content");
    const techContent = document.getElementById("tech-content");
    const ipcTitle = document.getElementById("ipc-title");
    const ipcContent = document.getElementById("ipc-content");
    let valid = true;
    valid = checkAndShake(ipcTitle, ipcContent, "生成中，请稍后...") && valid;
    if (valid) {
        nextStep('ipc-search', 'output', 3, 5);
        const messageToSend = `${extractContent.innerText}${techContent.innerText}${ipcContent.innerText}
        将我给你的这些内容重构，按照说明书摘要、说明书附图、权力要求书、说明书（包括标题、技术领域、背景技术、发明内容、附图说明、具体实施方式、说明书附图）几个部分详细说明,
        要求每个部分的内容尽可能地详细、专业`;
        aiChat(messageToSend, 'output-content');
    }
}
// 复制内容到剪贴板
function copyToClipboard(areaId) {
    var copyContent = document.getElementById(areaId);
    if (navigator.clipboard) {
        navigator.clipboard.writeText(copyContent.innerText).then(function() {
            console.log("复制成功: " + copyContent.innerText);
        }, function(err) {
            console.log("复制失败: ", err);
        });
    } else {
        // 兼容处理，使用传统的选择和复制方式
        copyContent.select();
        document.execCommand("copy");
        console.log("复制成功: " + copyContent.innerText);
    }
}

// 切换步骤
function nextStep(currentId, nextId, step1, step2) {
    document.getElementById(currentId).style.display = 'none';
    document.getElementById(nextId).style.display = 'flex';

    const stepNumber1 = document.querySelectorAll('.step-number')[step1-1];
    stepNumber1.textContent = '✓';
    stepNumber1.style.backgroundColor = 'gray';
    const stepLine1 = document.querySelectorAll('.step-line')[step1-1];
    stepLine1.style.borderLeft = '2px dashed #a6a6a6';
    const stepDescription1 = document.querySelectorAll('.step-description')[step1-1];
    stepDescription1.style.background = 'radial-gradient(#d5d5d5 60%, #a6a6a6 100%)';
    stepDescription1.style.border = '1px solid #a6a6a6';

    const stepNumber2 = document.querySelectorAll('.step-number')[step2-1];
    stepNumber2.textContent = step2;
    stepNumber2.style.backgroundColor = '#4d70ff';
    const stepLine2 = document.querySelectorAll('.step-line')[step2-1];
    stepLine2.style.borderLeft = '2px dashed #4d70ff';
    const stepDescription2 = document.querySelectorAll('.step-description')[step2-1];
    stepDescription2.style.background = 'radial-gradient(#dfebff 60%,#8cb7ff 100%)';
    stepDescription2.style.border = '1px solid #4d70ff';
}

// 晃动效果
function shake(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 900);
}
// 检查内容并shake
function checkAndShake(elementTitle, elementContent, message) {
    if (elementContent.innerText.trim() === "" || elementContent.innerText.trim() === message) {
        shake(elementTitle);
        shake(elementContent);
        return false;
    }
    return true;
}

// 切换微信客服二维码显示
function toggleCodeBox() {
    const codeBox = document.getElementById('code-box');
    codeBox.style.display = codeBox.style.display=== 'flex' ? 'none' : 'flex';
}
// 点击页面其他地方关闭微信客服码显示
document.addEventListener('click',function (event) {
    const codeBox = document.getElementById('code-box');
    const serviceBox = document.getElementById('service-box');
    if (codeBox.style.display === 'flex' && !serviceBox.contains(event.target) && !codeBox.contains(event.target)) {
        codeBox.style.display = 'none';
    }
});

// 用户协议
const isChecked = ref(false);
function userAgreement() {
    alert('ProPatent用户协议\n\n' + '最后更新日期： 2024-10-4\n\n' +
        '欢迎使用 ProPatent—AI专利撰写助手（以下简称“本产品”）。在使用本产品之前，请您仔细阅读以下用户协议（以下简称“本协议”）。使用本产品即表示您同意遵守本协议的所有条款和条件。如果您不同意本协议的任何条款，请您立即停止使用本产品。\n' +
        '\n1. 服务内容\n' +
        '本产品是一个基于人工智能技术的专利撰写辅助工具，旨在为用户提供专利撰写的支持与指导。用户可以通过本产品生成专利申请文档、获取撰写建议和修改意见等。\n' +
        '\n2. 用户资格\n' +
        '使用本产品的用户必须年满18岁，或已获得监护人的同意。使用本产品即表示您确认您符合上述资格。\n' +
        '\n3. 用户责任\n' +
        '用户需自行负责其使用本产品的行为，包括但不限于提供准确、真实的信息。\n用户不得利用本产品从事任何非法活动或侵犯他人权利的行为。\n用户需对其在本产品中生成的内容承担全部责任。\n' +
        '\n4. 知识产权\n' +
        '本产品及其内容，包括但不限于软件、文本、图形、图像和商标，均为 ProPatent 或相关权利人所有，受版权法和其他知识产权法律保护。未经授权，用户不得复制、修改、传播或以其他方式使用本产品的任何内容。\n' +
        '\n5. 隐私政策\n' +
        '用户在使用本产品时，可能需要提供个人信息。我们将根据《隐私政策》的规定收集、使用和保护用户的信息。请您务必仔细阅读《隐私政策》，以了解我们如何处理您的信息。\n' +
        '\n6. 免责声明\n' +
        '本产品提供的所有内容仅供参考，不能替代专业法律意见。用户在使用本产品生成的文档时，建议咨询专业法律人士。\nProPatent 对因使用本产品而导致的任何直接、间接、偶然、特殊或后果性损害不承担责任。\n' +
        '\n7. 变更与终止\n' +
        '我们保留随时修改或更新本协议的权利。修改后的协议将发布在本产品中，用户继续使用本产品即表示接受修改后的协议。如果您不同意修改后的协议，可以选择停止使用本产品。\n' +
        '\n8. 法律适用与争议解决\n' +
        '本协议适用中华人民共和国法律。因本协议引起的任何争议，双方应友好协商解决；如协商不成，任一方可向本产品所在地人民法院提起诉讼。\n' +
        '\n9. 其他条款\n' +
        '本协议构成您与 ProPatent 之间关于使用本产品的完整协议，替代之前的任何口头或书面协议。\n若本协议中的某一条款被认定为无效或不可执行，该条款的无效或不可执行不影响本协议其他条款的有效性。\n如您对本协议有任何疑问或建议，请联系我们：[联系邮箱或电话]\n感谢您选择 ProPatent—AI专利撰写助手！\n'
    )
}
</script>

<style scoped>
#ProPatent {
    display:flex;
    margin:0;
    height:100vh;
}

/*流程图*/
.flow-container {
    flex-shrink:0;
    display:flex;
    flex-direction:column;
    align-items:center;
    width:250px;
    padding:20px 10px;
    background-color:#f6f6f6;
    border-right:1px solid #e0e0e0;
    overflow-y:auto;
}
.flow-title {
    font-size:18px;
    font-weight:bold;
    color:#4d70ff;
}
.flow-title2 {
    font-size:10px;
    color:black;
    margin-bottom:10px;
}
.flow-item {
    display:flex;
    flex-direction:column;
    width:100%;
    align-items:center;
}
.step {
    display:flex;
    flex-direction:row;
    width:100%;
    align-items:center;
}
.step-number {
    width:20px;
    height:20px;
    background-color:#4d70ff;
    color:white;
    border-radius:50%;
    display:flex;
    justify-content:center;
    align-items:center;
    font-weight:bold;
    font-size:12px;
}
.step-title {
    margin-left:5px;
    color:black;
    font-size:14px;
    font-weight:bold;
}
.step-line {
    flex-grow:1;
    width:220px;
    border-left:2px dashed #4d70ff;
    margin:0;
    padding:2px 0 2px 8px;
    font-size:10px;
}
.step-description {
    background:radial-gradient(#dfebff 60%,#8cb7ff 100%);
    border-radius:10px;
    padding:5px 10px;
    margin:5px 0;
    border:1px solid #4d70ff;
}

/*聊天窗口*/
.chat-container {
    flex-grow:1;
    display:flex;
    flex-direction:column;
    background:linear-gradient(to bottom left,#e3eeff,#ffffff);
    padding:0 20px;
    overflow-y:auto;
    min-width:400px;
}
#base-input,#extract-input,#ipc-search,#output {
    display:flex;
    flex-direction:column;
    align-items:center;
    width:80%;
    min-width:400px;
    min-height:100vh;
    /*min-height:calc(100vh - 20px);*/
    justify-content:center;
    margin:0 auto;
}
#base-input {
    min-height:calc(100vh - 20px);
}
.ai-title {
    display:flex;
    justify-content:center;
    align-items:center;
    width:80%;
    /*height:40px;*/
    padding:5px 20px;
    border-radius: 20px;
    color:#fff;
    background-color:#4d70ff;
    font-weight:bold;
    font-size:20px;
    margin-top:50px;
    margin-bottom:40px;
}
.ai-logo {
    width:30px;
    height:30px;
    margin-right:10px;
    filter: brightness(10.0);/*亮度*/
}
.title {
    text-align:center;
    font-size:26px;
    color:#4d70ff;
    font-weight:bold;
    margin:50px 10px 10px;
}
#file-title {
    margin-top:4px;
    width:100%;
    /*width: calc(100% - 20px);*/
    height: 30px;
    padding:2px 10px;
    border-radius: 10px;
    border:2px solid #4d70ff;
    font-size: 16px;
}
.row {
    margin-top:20px;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:flex-start;
    width:100%;
    font-size:16px;
}
#extract-input {
    display:none;
}
.border-box {
    width:100%;
    margin:0 auto;
    border:4px solid;
    border-image:linear-gradient(to bottom left,#4d70ff,#4dfff9) 1;
    padding:20px;
}
#ipc-search {
    display:none;
}
#output {
    display:none;
}
#service {
}
#service-box,#code-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: fixed;
    right: 20px;
    bottom: 80px;
    width: 60px;
    height: 60px;
    border-radius: 10px;
    color: #4d70ff;
    background-color: #fff;
    box-shadow: #4d70ff 0 0 10px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
}
.service-logo {
    width: 30px;
    height: 30px;
}
#code-box {
    display: none;
    width: 200px;
    height: 250px;
    right: 90px;
    color: #8a9eb9;
    background-color: #fff;
    box-shadow: #8a9eb9 0 0 20px;
}
.qr-code {
    width: 130px;
    height: 130px;
    margin: 20px auto;
}
.chat-container small {
    color:gray;
    display:flex;
    justify-content:center;
    align-items:center;
    height:20px;
    font-size:12px;
}


input[type="file"] {
    width:200px;
}
input[type="file"]::file-selector-button {
    font-weight: 500;
    color: #fff;
    background-color: #4d70ff;
    border-color: #4d70ff;
}

.button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.send-button,.back-button {
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
.back-button {
    background: #8a9eb9;
    margin-right:20px;
}
</style>
