import request from '@/utils/request'

import { ApiItem, ListResponseConfig, ResponseConfig, ListRequestConfig } from '@/types'

const prefix = '/api'

// 获取api列表
export function getAllApis (): Promise<ListResponseConfig<ApiItem[]>> {
  return request.post(prefix + '/getAllApis')
}

// 根据id获取api
export function getApiById (data: { id: number }): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/getApiById', data)
}

// 分页获取api列表
export function getApiList (data: ListRequestConfig): Promise<ListResponseConfig<ApiItem[]>> {
  return request.post(prefix + '/getApiList', data)
}

// 创建api
export function createApi (data: ApiItem): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/createApi', data)
}

// 更新api
export function updateApi (data: ApiItem): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/updateApi', data)
}

// 删除指定api
export function deleteApi (data: ApiItem): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/deleteApi', data)
}
