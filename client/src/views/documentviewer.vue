<template>
    <div id="documentviewer">
        <!--菜单栏-->
        <SideBar />
        <!--历史文档内容-->
        <div class="content">
            <div class="title">文书查看</div>
            <table>
                <thead>
                <tr>
                    <th style="width: 5%;">序号</th>
                    <th style="width: 15%;">时间</th>
                    <th style="width: 20%;">标题</th>
                    <th style="width: 40%;">内容预览</th>
                    <th style="width: 20%;">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="documents.length === 0">
                    <td colspan="5" style="text-align: center;">暂无历史数据</td>
                </tr>
                <tr v-for="(document, index) in paginatedDocuments" :key="document.id">
                    <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                    <td>{{ new Date(document.createdAt).toLocaleString() }}</td>
                    <td>{{ document.title }}</td>
                    <td class="preview">{{ document.contentPreview }}</td>
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

const documents = ref([]);
const currentPage = ref(1);
const pageSize = 5;

// 模拟文档数据
const mockData = [
    { id: 1, title: '文档标题 1', createdAt: '2024-10-01T10:00:00Z', contentPreview: '这是文档 1 的内容预览asdhgfaegsasgqgesdhgewsdhfhgesgdgegsdfggsdngsdfdgsdf' },
    { id: 2, title: '文档标题 2', createdAt: '2024-10-05T14:30:00Z', contentPreview: '这是文档 2 的内容预览...' },
    { id: 3, title: '文档标题 3', createdAt: '2024-10-10T09:15:00Z', contentPreview: '这是文档 3 的内容预览...' },
    { id: 4, title: '文档标题 4', createdAt: '2024-10-12T10:00:00Z', contentPreview: '这是文档 4 的内容预览...' },
    { id: 5, title: '文档标题 5', createdAt: '2024-10-15T14:30:00Z', contentPreview: '这是文档 5 的内容预览...' },
    { id: 6, title: '文档标题 6', createdAt: '2024-10-18T09:15:00Z', contentPreview: '这是文档 6 的内容预览...' },
    { id: 7, title: '文档标题 7', createdAt: '2024-10-20T11:00:00Z', contentPreview: '这是文档 7 的内容预览...' },
    { id: 8, title: '文档标题 8', createdAt: '2024-10-22T14:30:00Z', contentPreview: '这是文档 8 的内容预览...' },
    { id: 9, title: '文档标题 9', createdAt: '2024-10-25T09:15:00Z', contentPreview: '这是文档 9 的内容预览...' },
    { id: 10, title: '文档标题 10', createdAt: '2024-10-28T10:00:00Z', contentPreview: '这是文档 10 的内容预览...' },
    { id: 11, title: '文档标题 11', createdAt: '2024-11-01T10:00:00Z', contentPreview: '这是文档 11 的内容预览...' },
    { id: 12, title: '文档标题 12', createdAt: '2024-11-05T14:30:00Z', contentPreview: '这是文档 12 的内容预览...' },
    { id: 13, title: '文档标题 13', createdAt: '2024-11-10T09:15:00Z', contentPreview: '这是文档 13 的内容预览...' },
    { id: 14, title: '文档标题 14', createdAt: '2024-11-12T10:00:00Z', contentPreview: '这是文档 14 的内容预览...' },
    { id: 15, title: '文档标题 15', createdAt: '2024-11-15T14:30:00Z', contentPreview: '这是文档 15 的内容预览...' },
    { id: 16, title: '文档标题 16', createdAt: '2024-11-18T09:15:00Z', contentPreview: '这是文档 16 的内容预览...' },
    { id: 17, title: '文档标题 17', createdAt: '2024-11-20T11:00:00Z', contentPreview: '这是文档 17 的内容预览...' },
    { id: 18, title: '文档标题 18', createdAt: '2024-11-22T14:30:00Z', contentPreview: '这是文档 18 的内容预览...' },
    { id: 19, title: '文档标题 19', createdAt: '2024-11-25T09:15:00Z', contentPreview: '这是文档 19 的内容预览...' },
    { id: 20, title: '文档标题 20', createdAt: '2024-11-28T10:00:00Z', contentPreview: '这是文档 20 的内容预览...' },
];

const fetchDocuments = async () => {
    try {
        documents.value = mockData;
    } catch (error) {
        console.error('获取文档失败:', error);
    }
};

const totalPages = computed(() => Math.ceil(documents.value.length / pageSize));
const paginatedDocuments = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return documents.value.slice(start, start + pageSize);
});

const goToFirstPage = () => {
    currentPage.value = 1;
};

const goToLastPage = () => {
    currentPage.value = totalPages.value;
};

const goToPreviousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const goToNextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const goToPage = (page) => {
    currentPage.value = page;
};

const nearbyPages = computed(() => {
    const pages = [];
    const start = Math.max(1, currentPage.value - 2);
    const end = Math.min(totalPages.value, currentPage.value + 2);
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

onMounted(() => {
    fetchDocuments();
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
    text-align: center; /* 标题水平居中 */
}

table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed; /* 固定布局 */
}

th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #dbe9fe;
    color: #4d70ff;
}

/* 内容预览样式 */
.preview {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

/* 按钮样式 */
.view-btn {
    background-color: #4d70ff;
}
.delete-btn {
    background-color: #ff4b4b;
}
.export-btn {
    background-color: #4dfff9;
}
.content button {
    color: white;
    border: none;
    border-radius: 6px;
    margin: 2px 5px;
    padding: 5px 10px;
    cursor: pointer;
}

.pagination {
    margin-top: 20px;
    display: flex;
    align-items: center;
}
.pagination button {
    background-color: #4d70ff;
}
</style>
