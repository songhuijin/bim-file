<template>
  <div class="content">
    <router-view />
  </div>
</template>

<style scoped>
  .content {
    width: calc(100% - 200px);
    min-height: calc(100% - 66px);
    background-color: rgb(245,245,245);
    position: absolute;
    left: 200px;
    top: 66px;
    padding: 10px;
  }
</style>
