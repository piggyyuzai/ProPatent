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
    // 更新页面中的信息
    // var patentName = "专利名称1";  // 你可以根据实际情况动态赋值
    // var ipcNumber = "IPC分类号2";
    // var ipcExplain = "分类说明3";
    // // 更新页面中的信息
    // document.getElementById("patent-name").textContent = patentName;
    // document.getElementById("ipc-number").textContent = ipcNumber;
    // document.getElementById("ipc-explain").textContent = ipcExplain;
    // console.log(extractContent.innerText);

    // 将 extractContent.innerText 与请求消息拼接
    var messageToSend = extractContent.innerText + " 帮我查询这个专利技术交底书的IPC分类号和分类说明。";
    aiChat(messageToSend);

}

function aiChat(messageToSend) {
    // 发送请求到 API
    fetch("https://api.link-ai.tech/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer Link_v0SpPeJUGHnfcScMDLdHd7HOPRs440zs3qszhBXesO"
        },
        body: JSON.stringify({"app_code": "KoJA0clf", "messages": [{"role": "user", "content": messageToSend}]})
    })
        .then(response => {
            if (!response.ok) {throw new Error(`请求异常, 错误码=${response.status}`);}
            return response.json();
        })
        .then(data => {
            var replyText = data.choices[0].message.content;
            document.getElementById("ipc-content").innerText = replyText;
        })
        .catch(error => {
            console.error('请求失败:', error);
            document.getElementById("ipc-content").innerText = `请求失败: ${error.message}`;
        });
}

