export interface ApiResult<T = unknown> {
  code: number
  data: T
  message?: string
}

export interface DemoItem {
  id: number
  title: string
  content?: string
  stock?: number
}

export interface TokenPayload {
  token: string
  userId: number
}
