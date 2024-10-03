// 切换步骤
function nextStep(currentId, nextId) {
    // 隐藏当前步骤
    document.getElementById(currentId).style.display = 'none';
    // 显示下一步骤
    document.getElementById(nextId).style.display = 'flex';
}
function prevStep(currentId, prevId) {
    // 隐藏当前步骤
    document.getElementById(currentId).style.display = 'none';
    // 显示上一步的步骤
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
    var chatBox = document.getElementById("chat-box");
    var fileInput = document.getElementById("file-input");
    var extractContent = document.getElementById("extract-content");
    var checkbox = document.getElementById("checkbox");
    var userAgreement = document.getElementById("user-agreement");

    if (!checkbox.checked || !fileInput.files.length) {
        if (!checkbox.checked) shake(userAgreement);
        if (!fileInput.files.length) shake(fileInput);
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
                // 设置图片格式
                htmlContent = htmlContent.replace(/<img /g, '<img style="max-width:40%;max-height:40vh;display:block;margin:0 auto;" ');
                // 创建一个可编辑的 div，并将 HTML 内容插入其中
                extractContent.innerHTML = htmlContent;
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





// IPC信息
function ipcSearch() {
    // 在执行查询时，将 extract-content 内的文字内容输出到控制台
    var extractContent = document.getElementById("extract-content");

    nextStep('extract-input', 'ipc-search');

    // 将 extractContent.innerText 与请求消息拼接
    var messageToSend = extractContent.innerText + " 帮我查询这个专利技术交底书的IPC分类号和分类说明。";
    aiChat(messageToSend);

}

async function aiChat(messageToSend) {
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
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const jsonString = line.replace("data: ", "");
                    if (jsonString === "[DONE]") {
                        break; // End of stream
                    }

                    try {
                        const chunkMessage = JSON.parse(jsonString);
                        if (chunkMessage.choices && chunkMessage.choices.length > 0) {
                            const content = chunkMessage.choices[0].delta.content;
                            if (content) {
                                result += content; // Append content to the result
                                // Update the UI with the new content
                                document.getElementById('ipc-content').innerText = result; // Assume there's an element with id 'output'
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

