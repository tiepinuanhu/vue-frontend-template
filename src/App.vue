<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <el-container class="layout">
    <el-header class="layout__header">
      <AppHeader />
    </el-header>
    <el-main class="layout__main">
      <RouterView />
    </el-main>
  </el-container>
</template>

<style scoped>
.layout {
  min-height: 100vh;
}

.layout__header {
  padding: 0;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.layout__main {
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 16px 48px;
}
</style>
