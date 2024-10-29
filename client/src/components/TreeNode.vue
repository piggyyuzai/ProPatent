<template>
        <div @click="toggle" class="tree-node">
            <span v-if="node.children" style="color:#4d70ff;font-weight:bold;font-size:20px;">{{ isOpen ? ' − ' : ' + ' }}</span>
            <span v-else style="color:#999;font-weight:bold;font-size:20px;"> ▪ </span>
            <span v-html="highlightMatch(node.title, searchTerm)"></span>
        </div>
        <ul v-if="isOpen">
            <TreeNode
                v-for="child in node.children"
                :key="child.id"
                :node="child"
                :search-term="searchTerm"
            />
        </ul>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    node: Object,
    searchTerm: String,
});

const isOpen = ref(props.node.isOpen);

// Watch the `isOpen` prop to automatically open matching nodes
watch(
    () => props.node.isOpen,
    (newVal) => {
        isOpen.value = newVal;
    },
    { immediate: true }
);

function toggle() {
    isOpen.value = !isOpen.value;
}

const highlightMatch = (title, term) => {
    if (!term) return title;
    const regex = new RegExp(`(${term})`, 'gi');
    return title.replace(regex, '<span style="color:red;">$1</span>');
};
</script>

<style scoped>
.tree-node {
    cursor: pointer;
    padding: 5px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
}
ul {
}
</style>
