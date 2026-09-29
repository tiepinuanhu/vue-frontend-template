<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { issueToken } from '@/api/demo'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  userId: 1,
})
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    const res = await issueToken(form.userId)
    if (res.code !== 200 || !res.data?.token) {
      ElMessage.error(res.message || '获取 token 失败')
      return
    }
    userStore.setToken(res.data.token)
    userStore.setUserProfile({
      userId: res.data.userId,
      userName: `user-${res.data.userId}`,
    })
    ElMessage.success('登录成功')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.replace(redirect)
  } catch {
    ElMessage.error('请求失败，请确认 gateway 已启动')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-card shadow="never" class="login">
    <template #header>演示登录</template>
    <p class="hint">
      调用 spring-cloud-template 的 <code>GET /api/a/token?userId=</code>，将 JWT 写入 Pinia（持久化）。
    </p>
    <el-form label-width="80px" @submit.prevent="onSubmit">
      <el-form-item label="userId">
        <el-input-number v-model="form.userId" :min="1" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" native-type="submit">获取 Token</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
.login {
  max-width: 420px;
}

.hint {
  color: #6b7280;
  margin-top: 0;
}

code {
  font-size: 0.9em;
  background: #f3f4f6;
  padding: 0.1em 0.35em;
  border-radius: 4px;
}
</style>
