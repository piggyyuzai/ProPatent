<template>
    <div @click="toggle" class="tree-node">
        <span v-if="hasChildren" style="color:#4d70ff;font-weight:bold;font-size:20px;">
            {{ isOpen ? ' − ' : ' + ' }}
        </span>
        <span v-else style="color:#999;font-weight:bold;font-size:20px;"> ▪ </span>
        <span v-html="highlightMatch(node.code + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + node.title, searchTerm)"></span>
    </div>
    <ul v-if="isOpen && hasChildren">
        <TreeNode
            v-for="child in node.children"
            :key="child.code"
            :node="child"
            :search-term="searchTerm"
        />
    </ul>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
    node: Object,
    searchTerm: String,
});

const isOpen = ref(props.node.isOpen);

// 确认是否有子节点的计算属性
const hasChildren = computed(() => props.node.children && props.node.children.length > 0);

// 监听 `isOpen` 和 `node.children`，以自动调整节点
watch(
    () => [props.node.isOpen, props.node.children],
    ([newIsOpen]) => {
        isOpen.value = newIsOpen;
    },
    { immediate: true }
);

function toggle() {
    if (hasChildren.value) {
        isOpen.value = !isOpen.value;
    }
}

const highlightMatch = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<span style="color:red;font-weight:bold;">$1</span>');
};
</script>

<style scoped>
.tree-node {
    cursor: pointer;
    padding: 5px;
    border-bottom: 2px solid #c8d9f1;
}
.tree-node:hover {
    background-color: #dbedff;
}
</style>
