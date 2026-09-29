<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const active = computed(() => route.path)

function logout() {
  userStore.logout()
  router.push('/')
}
</script>

<template>
  <el-menu mode="horizontal" :default-active="active" router :ellipsis="false" class="nav">
    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/demo/items">商品 Demo</el-menu-item>
    <el-menu-item index="/demo/order">下单 Demo</el-menu-item>
    <div class="nav__spacer" />
    <el-menu-item v-if="!userStore.token" index="/user/login">登录</el-menu-item>
    <el-sub-menu v-else index="user">
      <template #title>
        用户 {{ userStore.user.userId || '—' }}
      </template>
      <el-menu-item index="/" @click="logout">退出登录</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<style scoped>
.nav {
  max-width: 960px;
  margin: 0 auto;
  border-bottom: none;
}

.nav__spacer {
  flex: 1;
}
</style>
