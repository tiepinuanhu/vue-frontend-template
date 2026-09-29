<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { healthA } from '@/api/demo'

const health = ref('未检测')
const loading = ref(false)

async function checkHealth() {
  loading.value = true
  try {
    const res = await healthA()
    if (res.code === 200) {
      health.value = res.data
      ElMessage.success('gateway 可达')
    } else {
      health.value = res.message || `code=${res.code}`
      ElMessage.warning(health.value)
    }
  } catch {
    health.value = '连接失败'
    ElMessage.error('无法访问 /api/a/health，请确认 tpl-gateway 已启动')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  checkHealth()
})
</script>

<template>
  <div class="home">
    <h1>vue-frontend-template</h1>
    <p class="lead">
      Vue 3 · Element Plus · Axios · Pinia · Vue Router，默认对接
      <code>spring-cloud-template</code> 的 <code>tpl-gateway:8080</code>。
    </p>

    <el-card shadow="never">
      <template #header>连通性</template>
      <p>探活结果：<strong>{{ health }}</strong></p>
      <el-button type="primary" :loading="loading" @click="checkHealth">重新检测</el-button>
    </el-card>

    <el-card shadow="never" class="mt">
      <template #header>示例页面</template>
      <ul>
        <li><RouterLink to="/user/login">登录</RouterLink> — 调用 <code>GET /api/a/token</code> 拿 JWT</li>
        <li><RouterLink to="/demo/items">商品 Demo</RouterLink> — 创建 / 查询 / 搜索（公开接口）</li>
        <li><RouterLink to="/demo/order">下单 Demo</RouterLink> — 需登录，调用 <code>POST /api/a/orders</code></li>
      </ul>
    </el-card>
  </div>
</template>

<style scoped>
.home h1 {
  margin: 0 0 8px;
  font-size: 1.75rem;
}

.lead {
  color: #6b7280;
  margin: 0 0 24px;
}

.mt {
  margin-top: 16px;
}

ul {
  margin: 0;
  padding-left: 1.25rem;
  line-height: 1.9;
}

code {
  font-size: 0.9em;
  background: #f3f4f6;
  padding: 0.1em 0.35em;
  border-radius: 4px;
}
</style>
