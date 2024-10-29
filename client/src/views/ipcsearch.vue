<template>
    <div id="ipcsearch">
        <!-- 菜单栏 -->
        <SideBar/>
        <!-- 树形目录 -->
        <div class="tree-container-wrapper">
            <div class="title">IPC分类目录</div>
            <input
                type="text"
                v-model="searchTerm"
                placeholder="输入搜索关键词"
                class="search-input"
            />
            <div class="tree-container">
                <ul>
                    <TreeNode
                        v-for="node in expandedTreeData"
                        :key="node.id"
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
import {ref, computed} from 'vue';
import {ipctreeList} from '../mockData.js';

const searchTerm = ref('');
const treeData = ref(ipctreeList);

const expandedTreeData = computed(() => {
    if (!searchTerm.value) return treeData.value;

    const expandNodesToMatch = (nodes) => {
        return nodes.map((node) => {
            const children = node.children ? expandNodesToMatch(node.children) : [];
            const isMatch = node.title.includes(searchTerm.value);
            const hasMatchingChildren = children.some((child) => child.isMatch || child.hasMatchingChildren);

            // Only expand path if there’s a match or matching children
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
    border: 2px solid #dbe9fe;
}
.tree-container {
    min-width: 400px;
}
</style>
