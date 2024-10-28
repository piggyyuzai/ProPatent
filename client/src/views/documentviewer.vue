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
            </div>
            <!--表格-->
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
                <tr v-if="filteredDocuments.length === 0">
                    <td colspan="5" style="text-align: center;">暂无匹配数据</td>
                </tr>
                <tr v-for="(document, index) in paginatedDocuments" :key="document.id">
                    <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                    <td>{{ new Date(document.createdAt).toLocaleString() }}</td>
                    <td>{{ document.title }}</td>
                    <td class="preview" @mouseover="showTooltip(index)" @mouseleave="hideTooltip">
                        {{ document.contentPreview }}
                        <div class="tooltip" v-if="tooltipVisible && tooltipIndex === index">
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



onMounted(() => {
    fetchDocuments();
});
const documents = ref([]);
const currentPage = ref(1);
const pageSize = 5;

// 模拟文档数据
const mockData = [
    { id: 20, title: '专利趋势分析报告', createdAt: '2024-11-28T10:00:00Z', contentPreview: '该文档详细讨论了最新专利申请的趋势，深入分析了技术创新对行业发展的深远影响。通过对近年来的专利数据进行系统性的梳理，文档揭示了各个技术领域的申请热潮，以及这些变化对企业战略制定的重要性。特别是在快速发展的科技环境中，企业如何通过有效的专利布局来增强自身的竞争优势，成为本文的重点之一。\n\n此外，文档还提供了多项相关的案例研究，展示了不同企业如何成功地将创新转化为专利，并利用这些专利来驱动市场增长。通过具体的数据和案例，企业可以更加清晰地把握市场动态，从而制定出符合自身发展需求的技术创新策略。总体而言，该文档不仅为研究者提供了有价值的参考，也为希望在市场中占据领先地位的企业提供了切实可行的建议与指导。' },
    { id: 19, title: '近年专利数据总结', createdAt: '2024-11-25T09:15:00Z', contentPreview: '本文档总结了近年来的专利数据，探讨了各领域的创新成果及其市场前景，特别关注生物科技和信息技术领域的突破。' },
    { id: 18, title: '专利保护与创业策略', createdAt: '2024-11-22T14:30:00Z', contentPreview: '该文档分析了专利保护对创业公司的重要性。' },
    { id: 17, title: '应对专利侵权的法律风险', createdAt: '2024-11-20T11:00:00Z', contentPreview: '本文探讨了专利侵权的法律风险，并提供了应对策略以保护企业利益。讨论了常见的侵权案例以及如何通过法律手段进行维权。' },
    { id: 16, title: '全球专利布局现状分析', createdAt: '2024-11-18T09:15:00Z', contentPreview: '该文档分析了全球专利布局的现状，为企业国际化提供了参考和建议。' },
    { id: 15, title: '成功企业的专利策略', createdAt: '2024-11-15T14:30:00Z', contentPreview: '本文档展示了成功企业的专利策略，帮助其他公司制定有效的知识产权保护计划。通过案例分析，揭示了专利组合管理的重要性。' },
    { id: 14, title: '专利申请流程指南', createdAt: '2024-11-12T10:00:00Z', contentPreview: '该文档提供了专利申请流程的详细说明，帮助发明者更顺利地申请专利。包括申请书撰写、图纸准备及提交要求等方面的指导。' },
    { id: 13, title: '专利评估方法探讨', createdAt: '2024-11-10T09:15:00Z', contentPreview: '本文探讨了专利评估的方法，帮助企业评估其专利组合的市场价值。分析了评估中的关键因素，并提供了相关案例研究。' },
    { id: 12, title: '专利技术转让市场现状', createdAt: '2024-11-05T14:30:00Z', contentPreview: '该文档分析了专利技术转让的市场现状，并提供了相关的交易建议。探讨了技术转让的法律框架及其在不同领域的应用。' },
    { id: 11, title: '专利投资回报分析', createdAt: '2024-11-01T10:00:00Z', contentPreview: '本文档探讨了企业在专利方面的投资回报。' },
    { id: 10, title: '专利与研发的结合', createdAt: '2024-10-28T10:00:00Z', contentPreview: '该文档总结了专利与研发的关系，强调了创新对企业长远发展的重要性，并提出了如何将专利与研发活动有效结合的策略。' },
    { id: 9, title: '专利法规变更影响分析', createdAt: '2024-10-25T09:15:00Z', contentPreview: '本文讨论了专利法规的变化及其对行业的影响，帮助企业及时调整策略，尤其是在快速变化的科技环境中保持领先地位。' },
    { id: 8, title: '国际专利制度对比', createdAt: '2024-10-22T14:30:00Z', contentPreview: '该文档介绍了不同国家的专利制度，为企业提供了国际专利申请的指导，分析了各国的法律环境及其对企业战略的影响。' },
    { id: 7, title: '专利诉讼案例分析', createdAt: '2024-10-20T11:00:00Z', contentPreview: '本文分析了专利诉讼的案例，为企业提供了应对侵权的法律建议，具体阐述了诉讼过程中的关键步骤与注意事项。' },
    { id: 6, title: '技术专利的商业价值', createdAt: '2024-10-18T09:15:00Z', contentPreview: '该文档探讨了技术专利的商业价值，帮助企业利用专利来提升竞争优势。阐明了技术专利如何促进商业模式创新与转型。' },
    { id: 5, title: '专利申请中的常见错误', createdAt: '2024-10-15T14:30:00Z', contentPreview: '本文档分析了专利申请中的常见错误，并提供了避免这些错误的建议。' },
    { id: 4, title: '专利交易成功案例', createdAt: '2024-10-12T10:00:00Z', contentPreview: '该文档总结了专利交易的成功案例。' },
    { id: 3, title: '新产品开发中的专利保护', createdAt: '2024-10-10T09:15:00Z', contentPreview: '本文分析了专利保护在新产品开发中的作用，强调了创新与知识产权的结合，帮助企业提高新产品成功率。' },
    { id: 2, title: '企业的专利促进技术创新', createdAt: '2024-10-05T14:30:00Z', contentPreview: '该文档探讨了企业如何通过专利保护促进技术创新，实现持续的市场竞争。' },
    { id: 1, title: '专利制度对行业创新的影响', createdAt: '2024-10-01T10:00:00Z', contentPreview: '本文档分析了专利制度对行业创新的影响，并提出了改进建议以促进发展，特别是在技术快速发展的背景下，如何应对挑战。' },
    { id: 0, title: '专利制度', createdAt: '2024-10-01T10:00:00Z', contentPreview: '在技术快速发展的背景下，如何应对挑战。' },
];


const fetchDocuments = async () => {
    try {
        // const response = await fetch('你的API地址');
        // const data = await response.json();
        // documents.value = data;
        documents.value = mockData;
    } catch (error) {
        console.error('获取文档失败:', error);
    }
};

// 文档内容预览小窗
const tooltipVisible = ref(false);
const tooltipIndex = ref(null);
const showTooltip = (index) => {
    tooltipVisible.value = true;
    tooltipIndex.value = index;
    // 使用 setTimeout 确保在 DOM 更新后获取宽度
    setTimeout(() => {
        const previewElement = document.querySelectorAll('.preview')[index];
        const tooltip = document.querySelector('.tooltip');
        if (previewElement && tooltip) {
            const width = previewElement.offsetWidth - 35; // 获取预览的宽度
            tooltip.style.width = `${width}px`; // 设置 tooltip 的宽度
        }
    }, 0); // 延迟为 0 毫秒
};
const hideTooltip = () => {
    tooltipVisible.value = false;
    tooltipIndex.value = null;
};

// 搜索过滤文档
const searchQuery = ref('');
const filteredDocuments = computed(() => {
    if (!searchQuery.value) {
        return documents.value;
    }
    const query = searchQuery.value.toLowerCase();
    return documents.value.filter(doc =>
        doc.title.toLowerCase().includes(query) || doc.contentPreview.toLowerCase().includes(query)
    );
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
    justify-content: flex-end;
    margin-bottom: 10px;
    width: 100%;
}
.search-bar img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
}
.search-bar input {
    padding: 6px 10px;
    border: 2px solid #4d70ff;
    border-radius: 6px;
    width: 250px;
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
.preview {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
