// 切换步骤
function nextStep(currentId, nextId) {
    // 隐藏当前步骤
    document.getElementById(currentId).style.display = 'none';
    // 显示下一步骤
    document.getElementById(nextId).style.display = 'flex';
}
function prevStep(currentId, prevId) {
    document.getElementById(currentId).style.display = 'none';
    document.getElementById(prevId).style.display = 'flex';
}
// 晃动提醒
function shake(element) {
    element.classList.add("shake"); // 添加晃动类
    setTimeout(() => {
        element.classList.remove("shake"); // 移除晃动类
    }, 900); // 900毫秒后移除
}
// 切换微信客服码显示
function toggleCodeBox() {
    var codeBox = document.getElementById('code-box');
    codeBox.style.display = codeBox.style.display=== 'flex' ? 'none' : 'flex';
}
document.addEventListener('click',function (event) {
    var codeBox = document.getElementById('code-box');
    var serviceBox = document.getElementById('service-box');
    if (codeBox.style.display === 'flex' && !serviceBox.contains(event.target) && !codeBox.contains(event.target)) {
        codeBox.style.display = 'none';
    }
});



// 上传文件
async function inputFile() {
    const fileInputTitile = document.getElementById("file-input-title");
    const fileInput = document.getElementById("file-input");
    const extractContent = document.getElementById("extract-content");
    const checkbox = document.getElementById("checkbox");
    const userAgreement = document.getElementById("user-agreement");

    if (!checkbox.checked || !fileInput.files.length) {
        if (!checkbox.checked) shake(userAgreement);
        if (!fileInput.files.length) {
            shake(fileInputTitile);
            shake(fileInput);
        }
        return;
    }
    // 读取文件内容
    var content = "";
    const file = fileInput.files[0];
    const fileHandlers = {
        "application/pdf": async () => {
            content = await readPdf(file);
            displayTextContent(content, extractContent);
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": async () => {
            await readDocx(file, extractContent);
        },
        "text/plain": async () => {
            content = await readTxt(file);
            displayTextContent(content, extractContent);
        }
    };
    const handler = fileHandlers[file.type];
    if (handler) {
        nextStep('base-input', 'extract-input');
        await handler();
    } else {
        alert("不支持的文件格式！");
    }
    // fileInput.value = ""; // 清空文件选择框
}

// 显示提取的纯文本内容
function displayTextContent(textContent, extractContent) {
    extractContent.innerHTML = ""; // 清空提取内容
    if (textContent.trim() !== "") {
        var fileDiv = document.createElement("div");
        fileDiv.textContent = textContent;
        extractContent.appendChild(fileDiv);
    }
}

// 读取pdf文件内容
async function readPdf(file) {
    const fileReader = new FileReader();
    return new Promise((resolve) => {
        fileReader.onload = async function () {
            const pdfData = new Uint8Array(fileReader.result);
            const pdf = await pdfjsLib.getDocument(pdfData).promise;
            let textContent = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const text = await page.getTextContent();
                textContent += text.items.map(item => item.str).join(" ") + "\n";
            }
            resolve(textContent);
        };
        fileReader.readAsArrayBuffer(file);
    });
}

// 读取txt文件内容
async function readTxt(file) {
    return new Promise((resolve) => {
        var reader = new FileReader();
        reader.onload = function (event) {
            resolve(event.target.result);
        };
        reader.readAsText(file);
    });
}

// 读取docx文件内容并显示为HTML格式
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

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

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

// 检查内容并shake
function checkAndShake(elementTitle, elementContent, message) {
    if (elementContent.innerText.trim() === "" || elementContent.innerText.trim() === message) {
        shake(elementTitle);
        shake(elementContent);
        return false;
    }
    return true;
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
        nextStep('extract-input', 'ipc-search');
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
        nextStep('ipc-search', 'output');
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

// 用户协议
function userAgreement() {
    alert('ProPatent用户协议\n' +
        '\n' +
        '最后更新日期： 2024-10-4\n' +
        '\n' +
        '欢迎使用 ProPatent—AI专利撰写助手（以下简称“本产品”）。在使用本产品之前，请您仔细阅读以下用户协议（以下简称“本协议”）。使用本产品即表示您同意遵守本协议的所有条款和条件。如果您不同意本协议的任何条款，请您立即停止使用本产品。\n' +
        '\n' +
        '1. 服务内容\n' +
        '\n' +
        '本产品是一个基于人工智能技术的专利撰写辅助工具，旨在为用户提供专利撰写的支持与指导。用户可以通过本产品生成专利申请文档、获取撰写建议和修改意见等。\n' +
        '\n' +
        '2. 用户资格\n' +
        '\n' +
        '使用本产品的用户必须年满18岁，或已获得监护人的同意。使用本产品即表示您确认您符合上述资格。\n' +
        '\n' +
        '3. 用户责任\n' +
        '\n' +
        '用户需自行负责其使用本产品的行为，包括但不限于提供准确、真实的信息。\n' +
        '用户不得利用本产品从事任何非法活动或侵犯他人权利的行为。\n' +
        '用户需对其在本产品中生成的内容承担全部责任。\n' +
        '4. 知识产权\n' +
        '\n' +
        '本产品及其内容，包括但不限于软件、文本、图形、图像和商标，均为 ProPatent 或相关权利人所有，受版权法和其他知识产权法律保护。未经授权，用户不得复制、修改、传播或以其他方式使用本产品的任何内容。\n' +
        '\n' +
        '5. 隐私政策\n' +
        '\n' +
        '用户在使用本产品时，可能需要提供个人信息。我们将根据《隐私政策》的规定收集、使用和保护用户的信息。请您务必仔细阅读《隐私政策》，以了解我们如何处理您的信息。\n' +
        '\n' +
        '6. 免责声明\n' +
        '\n' +
        '本产品提供的所有内容仅供参考，不能替代专业法律意见。用户在使用本产品生成的文档时，建议咨询专业法律人士。\n' +
        'ProPatent 对因使用本产品而导致的任何直接、间接、偶然、特殊或后果性损害不承担责任。\n' +
        '7. 变更与终止\n' +
        '\n' +
        '我们保留随时修改或更新本协议的权利。修改后的协议将发布在本产品中，用户继续使用本产品即表示接受修改后的协议。如果您不同意修改后的协议，可以选择停止使用本产品。\n' +
        '\n' +
        '8. 法律适用与争议解决\n' +
        '\n' +
        '本协议适用中华人民共和国法律。因本协议引起的任何争议，双方应友好协商解决；如协商不成，任一方可向本产品所在地人民法院提起诉讼。\n' +
        '\n' +
        '9. 其他条款\n' +
        '\n' +
        '本协议构成您与 ProPatent 之间关于使用本产品的完整协议，替代之前的任何口头或书面协议。\n' +
        '若本协议中的某一条款被认定为无效或不可执行，该条款的无效或不可执行不影响本协议其他条款的有效性。\n' +
        '如您对本协议有任何疑问或建议，请联系我们：[联系邮箱或电话]\n' +
        '\n' +
        '感谢您选择 ProPatent—AI专利撰写助手！\n' +
        '\n')
}

