import request from '@/utils/request'

import { ApiItem, ListResponseConfig } from '@/types'

const prefix = '/api'

// 获取角色列表
export function getAllApis (): Promise<ListResponseConfig<ApiItem[]>> {
  return request.post(prefix + '/getAllApis')
}
