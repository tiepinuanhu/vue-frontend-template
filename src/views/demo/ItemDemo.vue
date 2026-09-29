<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { createItem, getItem, searchItems } from '@/api/demo'
import type { DemoItem } from '@/api/demo/types'

const createForm = reactive({
  title: '',
  content: '',
  stock: 10,
})
const createLoading = ref(false)
const lastCreated = ref<DemoItem | null>(null)

const queryId = ref(1)
const queryLoading = ref(false)
const queried = ref<DemoItem | null>(null)

const keyword = ref('')
const searchLoading = ref(false)
const searchResult = ref<DemoItem[]>([])

async function onCreate() {
  if (!createForm.title.trim()) {
    ElMessage.warning('请填写 title')
    return
  }
  createLoading.value = true
  try {
    const res = await createItem({
      title: createForm.title.trim(),
      content: createForm.content || undefined,
      stock: createForm.stock,
    })
    if (res.code === 200) {
      lastCreated.value = res.data
      ElMessage.success(`已创建 id=${res.data.id}`)
    } else {
      ElMessage.error(res.message || '创建失败')
    }
  } catch {
    ElMessage.error('创建请求失败')
  } finally {
    createLoading.value = false
  }
}

async function onGet() {
  queryLoading.value = true
  try {
    const res = await getItem(queryId.value)
    if (res.code === 200) {
      queried.value = res.data
    } else {
      ElMessage.error(res.message || '查询失败')
    }
  } catch {
    ElMessage.error('查询请求失败')
  } finally {
    queryLoading.value = false
  }
}

async function onSearch() {
  if (!keyword.value.trim()) {
    ElMessage.warning('请输入关键词')
    return
  }
  searchLoading.value = true
  try {
    const res = await searchItems(keyword.value.trim())
    if (res.code === 200) {
      searchResult.value = res.data || []
    } else {
      ElMessage.error(res.message || '搜索失败')
    }
  } catch {
    ElMessage.error('搜索请求失败（需 ES 可用）')
  } finally {
    searchLoading.value = false
  }
}
</script>

<template>
  <div class="page">
    <h2>商品 Demo</h2>
    <p class="hint">公开接口：<code>/api/a/items</code>、<code>/api/a/items/search</code></p>

    <el-card shadow="never">
      <template #header>创建</template>
      <el-form label-width="80px" @submit.prevent="onCreate">
        <el-form-item label="title">
          <el-input v-model="createForm.title" placeholder="hello" />
        </el-form-item>
        <el-form-item label="content">
          <el-input v-model="createForm.content" placeholder="optional" />
        </el-form-item>
        <el-form-item label="stock">
          <el-input-number v-model="createForm.stock" :min="0" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="createLoading" native-type="submit">创建</el-button>
        </el-form-item>
      </el-form>
      <pre v-if="lastCreated" class="json">{{ lastCreated }}</pre>
    </el-card>

    <el-card shadow="never" class="mt">
      <template #header>按 ID 查询</template>
      <el-space>
        <el-input-number v-model="queryId" :min="1" />
        <el-button type="primary" :loading="queryLoading" @click="onGet">查询</el-button>
      </el-space>
      <pre v-if="queried" class="json">{{ queried }}</pre>
    </el-card>

    <el-card shadow="never" class="mt">
      <template #header>ES 搜索</template>
      <el-space>
        <el-input v-model="keyword" placeholder="关键词" style="width: 220px" />
        <el-button type="primary" :loading="searchLoading" @click="onSearch">搜索</el-button>
      </el-space>
      <pre v-if="searchResult.length" class="json">{{ searchResult }}</pre>
    </el-card>
  </div>
</template>

<style scoped>
.hint {
  color: #6b7280;
}

.mt {
  margin-top: 16px;
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
