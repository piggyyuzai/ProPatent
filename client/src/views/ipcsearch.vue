<template>
    <div id="ipcsearch">
        <!-- 菜单栏 -->
        <SideBar />
        <!-- 树形目录 -->
        <div class="tree-container-wrapper">
            <div class="title">IPC分类查询</div>
            <div style="display: flex;justify-content:center;align-items:center;">
                <img src="../assets/search.png" style="width:20px;height:20px;margin-right:5px;" />
                <div style="color:#4d70ff;font-weight:bold;">搜索：</div>
                <input
                    type="text"
                    v-model="searchTerm"
                    placeholder="可使用空格分隔多个关键词"
                    class="search-input"
                />
            </div>
            <div class="tree-container">
                <ul>
                    <TreeNode
                            v-for="node in expandedTreeData"
                            :key="node.code"
                            :node="node"
                            :search-term="searchTerm"
                    />
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import SideBar from '../components/Sidebar.vue';
import TreeNode from '../components/TreeNode.vue';
import { ref, computed, onMounted } from 'vue';
import  ipctreeList  from '../data/ipctreeList.json';

const searchTerm = ref('');
const treeData = ref(ipctreeList);

// const treeData = ref([]);
async function loadTreeData() {
    try {
        const response = await fetch('/ipctreeList.json'); // 从 public 文件夹中获取 JSON
        if (!response.ok) throw new Error('数据加载失败');
        treeData.value = await response.json(); // 将获取的数据赋值给 treeData
    } catch (error) {
        console.error('加载ipc分类数据出错:', error);
    }
}
onMounted(() => {
    // loadTreeData();
});

const expandedTreeData = computed(() => {
    if (!searchTerm.value.trim()) return treeData.value;
    // 按空格拆分 `searchTerm` 获取单独的关键词
    const keywords = searchTerm.value.trim().toLowerCase().split(/\s+/);
    const expandNodesToMatch = (nodes) => {
        return nodes.map((node) => {
            const children = node.children ? expandNodesToMatch(node.children) : [];
            const isMatch = keywords.every(keyword => node.title.toLowerCase().includes(keyword));
            // const isMatch = node.title.includes(searchTerm.value) || node.code.includes(searchTerm.value);
            const hasMatchingChildren = children.some((child) => child.isMatch || child.hasMatchingChildren);
            // 只展开匹配的结点
            return {
                ...node,
                children,
                isMatch,
                hasMatchingChildren,
                isOpen: isMatch || hasMatchingChildren,
            };
        });
    };
    return expandNodesToMatch(treeData.value);
});

</script>

<style scoped>
#ipcsearch {
    display: flex;
    margin: 0;
    height: 100vh;
}

.title {
    color: #4d70ff;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
    width: 100%;
}

.tree-container-wrapper {
    min-width: 400px;
    flex: 1;
    padding: 40px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.search-input {
    padding: 6px 10px;
    width: 200px;
    border-radius: 6px;
    border: 2px solid #4d70ff;
}

.tree-container {
    min-width: 400px;
}
</style>
