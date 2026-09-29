import instance from '@/axios/request'
import type { ApiResult, DemoItem, TokenPayload } from './types'

/** GET /a/health — gateway 公开 */
export function healthA() {
  return instance({ url: '/a/health', method: 'get' }) as Promise<ApiResult<string>>
}

/** GET /a/token?userId= — 演示发 JWT */
export function issueToken(userId = 1) {
  return instance({
    url: '/a/token',
    method: 'get',
    params: { userId },
  }) as Promise<ApiResult<TokenPayload>>
}

/** POST /a/items — 创建商品（gateway 公开） */
export function createItem(payload: { title: string; content?: string; stock?: number }) {
  return instance({
    url: '/a/items',
    method: 'post',
    params: payload,
  }) as Promise<ApiResult<DemoItem>>
}

/** GET /a/items/{id} */
export function getItem(id: number) {
  return instance({ url: `/a/items/${id}`, method: 'get' }) as Promise<ApiResult<DemoItem>>
}

/** GET /a/items/search?q= */
export function searchItems(q: string) {
  return instance({
    url: '/a/items/search',
    method: 'get',
    params: { q },
  }) as Promise<ApiResult<DemoItem[]>>
}

/**
 * POST /a/orders — 需 Bearer token（gateway 鉴权）
 * fail=true 时演示 Seata 回滚
 */
export function placeOrder(payload: { itemId: number; amount?: number; fail?: boolean }) {
  return instance({
    url: '/a/orders',
    method: 'post',
    params: payload,
  }) as Promise<ApiResult<{ orderId: number; operator: number }>>
}
