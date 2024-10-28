<template>
    <div id="documentviewer">
        <!--菜单栏-->
        <SideBar />
        <!--历史文档内容-->
        <div class="content">
            <div class="title">文书查看</div>
            <!--搜索栏-->
            <div class="search-bar">
                <img src="../assets/search.png"/>
                <input type="text" v-model="searchQuery" placeholder="搜索标题或内容" @input="currentPage = 1" />
                <input type="date" v-model="startDate" @input="currentPage = 1" />
                <input type="date" v-model="endDate" @input="currentPage = 1" />
            </div>
            <!--表格-->
            <table>
                <thead>
                <tr>
                    <th style="width: 8%;">序号</th>
                    <th style="width: 14%;">时间</th>
                    <th style="width: 18%;">标题</th>
                    <th style="width: 40%;">内容预览</th>
                    <th style="width: 20%;">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="filteredDocuments.length === 0">
                    <td colspan="5" style="text-align: center;">暂无匹配数据</td>
                </tr>
                <tr v-for="(document, index) in paginatedDocuments" :key="document.id">
                    <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                    <td>{{ new Date(document.createdAt).toLocaleString() }}</td>
                    <td class="title-preview" @mouseover="showTooltip('title', index)" @mouseleave="hideTooltip">
                        {{ document.title }}
                        <div class="tooltip" v-if="tooltipType === 'title' && tooltipIndex === index">
                            {{ document.title }}
                        </div>
                    </td>
                    <td class="content-preview" @mouseover="showTooltip('content', index)" @mouseleave="hideTooltip">
                        {{ document.contentPreview }}
                        <div class="tooltip" v-if="tooltipType === 'content' && tooltipIndex === index">
                            {{ document.contentPreview }}
                        </div>
                    </td>
                    <td>
                        <button class="view-btn" @click="viewDocument(document.id)">查看</button>
                        <button class="delete-btn" @click="deleteDocument(document.id)">删除</button>
                        <button class="export-btn" @click="exportDocument(document.id)">导出</button>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="pagination">
                <button @click="goToFirstPage" :disabled="currentPage === 1">最前页</button>
                <button @click="goToPreviousPage" :disabled="currentPage === 1">上一页</button>
                <span>第 {{ currentPage }} 页 / {{ totalPages }} 页</span>
                <button @click="goToNextPage" :disabled="currentPage === totalPages">下一页</button>
                <button @click="goToLastPage" :disabled="currentPage === totalPages">最后页</button>
                <span>快速跳转: </span>
                <button v-for="page in nearbyPages" :key="page" @click="goToPage(page)">{{ page }}</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import SideBar from '../components/Sidebar.vue';
import { content } from '../mockData.js';


onMounted(() => {
    fetchDocuments();
});
const documents = ref([]);
const currentPage = ref(1);
const pageSize = 5;



const fetchDocuments = async () => {
    try {
        // const response = await fetch('你的API地址');
        // const data = await response.json();
        // documents.value = data;
        documents.value = content;
        // 按创建时间降序排序
        documents.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
        console.error('获取文档失败:', error);
    }
};


// 预览窗口Tooltip
const tooltipIndex = ref(null);
const tooltipType = ref(''); // 区分 tooltip 类型
const showTooltip = (type, index) => {
    tooltipType.value = type;
    tooltipIndex.value = index; // 设置索引
    setTimeout(() => {
        const previewElement = type === 'title' ? document.querySelectorAll('.title-preview')[index] : document.querySelectorAll('.content-preview')[index];
        const tooltip = document.querySelector('.tooltip');
        if (previewElement && tooltip) {
            const width = previewElement.offsetWidth - 35;
            tooltip.style.width = `${width}px`;
        }
    }, 0);
};
const hideTooltip = () => {
    tooltipType.value = '';
    tooltipIndex.value = null;
};

// 搜索过滤文档
const searchQuery = ref('');
const startDate = ref('');
const endDate = ref('');
const filteredDocuments = computed(() => {
    // 关键词过滤
    let result = documents.value;
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(doc =>
            doc.title.toLowerCase().includes(query) || doc.contentPreview.toLowerCase().includes(query)
        );
    }
    // 日期范围过滤
    if (startDate.value) {
        const startDateUTC = new Date(startDate.value + 'T00:00:00').getTime(); // 当地时间转为 UTC
        result = result.filter(doc => new Date(doc.createdAt).getTime() >= startDateUTC);
    }
    if (endDate.value) {
        const endDateUTC = new Date(endDate.value + 'T23:59:59').getTime(); // 当地时间转为 UTC
        result = result.filter(doc => new Date(doc.createdAt).getTime() <= endDateUTC);
    }
    return result;
});

// 分页逻辑
const totalPages = computed(() => Math.ceil(filteredDocuments.value.length / pageSize));
const paginatedDocuments = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredDocuments.value.slice(start, start + pageSize);
});
// 换页
const goToFirstPage = () => { currentPage.value = 1; };
const goToLastPage = () => { currentPage.value = totalPages.value; };
const goToPreviousPage = () => { if (currentPage.value > 1) { currentPage.value--; } };
const goToNextPage = () => { if (currentPage.value < totalPages.value) { currentPage.value++; } };
const goToPage = (page) => { currentPage.value = page; };
// 计算邻近页
const nearbyPages = computed(() => {
    const pages = [];
    const start = Math.max(1, currentPage.value - 2);
    const end = Math.min(totalPages.value, currentPage.value + 2);
    for (let i = start; i <= end; i++) { pages.push(i); }
    return pages;
});
</script>

<style scoped>
#documentviewer {
    display: flex;
    font-family: Arial, sans-serif;
    margin: 0;
    height: 100vh;
}

.content {
    min-width: 600px;
    flex: 1; /* 右侧内容区域 */
    padding: 40px;
    overflow-y: auto; /* 添加滚动条 */
    display: flex;
    flex-direction: column;
    align-items: center; /* 垂直居中 */
}

.title {
    color: #4d70ff;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
}

.search-bar {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 10px;
    width: 100%;
}
.search-bar img {
    width: 20px;
    height: 20px;
    margin: 0 8px;
}
.search-bar input {
    font-size: 12px;
    padding: 6px 10px;
    border: 2px solid #4d70ff;
    border-radius: 6px;
    width: 250px;
    height: 16px;
    margin-right: 10px;
}
.search-bar input[type="date"] {
    width: 100px;
}

table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed; /* 固定布局 */
}
th, td {
    padding: 5px 8px;
    text-align: center;
    border-bottom: 1px solid #c8d9f1;
}
th {
    background-color: #dbe9fe;
    color: #4d70ff;
    border-top: 1px solid #c8d9f1;
}

/* 内容预览样式 */
.title-preview,.content-preview {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
}
.tooltip {
    position: absolute;
    max-height: 50vh;
    overflow: auto;
    opacity: 0.8;
    color: #fff;
    background-color: #000000;
    box-shadow: 0 0 10px rgba(0, 0, 0, 1);
    border: none;
    border-radius: 6px;
    padding: 10px;
    z-index: 10;
    white-space: normal; /* 允许换行 */
}

/* 按钮样式 */
.view-btn { background-color: #4d70ff; }
.delete-btn { background-color: #ff4b4b; }
.export-btn { background-color: #4dfff9; }
.content button {
    color: white;
    border: none;
    border-radius: 6px;
    margin: 2px 5px;
    padding: 5px 10px;
    cursor: pointer;
}
/*换页*/
.pagination {
    margin-top: 20px;
    display: flex;
    align-items: center;
}
.pagination button {
    background-color: #4d70ff;
}
</style>
