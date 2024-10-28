<template>
    <router-view></router-view>
</template>

<script setup>

</script>
<script>
export const userid = Math.floor(Math.random() * 3) + 1;
</script>

<style>
body {
    margin:0;
    padding:0;
    overflow-y: auto;
    -ms-overflow-style: none;
}
::-webkit-scrollbar {
    display: none;
}

.shake {
    animation: shake 0.3s;
    animation-iteration-count: 3;
}
@keyframes shake {
    0% { transform: translate(0px); }
    25% { transform: translate(-5px); }
    50% { transform: translate(5px); }
    75% { transform: translate(-5px); }
    100% { transform: translate(0px); }
}
</style>
