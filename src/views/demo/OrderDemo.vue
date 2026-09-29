<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { placeOrder } from '@/api/demo'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const form = reactive({
  itemId: 1,
  amount: 1,
  fail: false,
})
const loading = ref(false)
const result = ref<unknown>(null)

async function onSubmit() {
  loading.value = true
  result.value = null
  try {
    const res = await placeOrder({
      itemId: form.itemId,
      amount: form.amount,
      fail: form.fail,
    })
    if (res.code === 200) {
      result.value = res.data
      ElMessage.success('下单成功')
    } else {
      ElMessage.error(res.message || `失败 code=${res.code}`)
      result.value = res
    }
  } catch (e: unknown) {
    const err = e as { response?: { data?: unknown }; message?: string }
    result.value = err.response?.data || err.message || e
    ElMessage.error('下单失败（需登录且服务可用）')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page">
    <h2>下单 Demo（需登录）</h2>
    <p class="hint">
      当前用户：{{ userStore.user.userId || '—' }} · 调用
      <code>POST /api/a/orders</code>（gateway JWT 鉴权）
    </p>

    <el-card shadow="never">
      <el-form label-width="90px" @submit.prevent="onSubmit">
        <el-form-item label="itemId">
          <el-input-number v-model="form.itemId" :min="1" />
        </el-form-item>
        <el-form-item label="amount">
          <el-input-number v-model="form.amount" :min="1" />
        </el-form-item>
        <el-form-item label="fail">
          <el-switch v-model="form.fail" active-text="故意失败回滚" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" native-type="submit">下单</el-button>
        </el-form-item>
      </el-form>
      <pre v-if="result" class="json">{{ result }}</pre>
    </el-card>
  </div>
</template>

<style scoped>
.hint {
  color: #6b7280;
}

.json {
  margin: 12px 0 0;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  overflow: auto;
  font-size: 13px;
}

code {
  font-size: 0.9em;
  background: #f3f4f6;
  padding: 0.1em 0.35em;
  border-radius: 4px;
}
</style>
