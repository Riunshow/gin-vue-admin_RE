import request from '@/utils/request'

import { ResponseConfig, ListResponseConfig, CasbinRequest, CasbinResponse } from '@/types'

const prefix = '/casbin'

// 更改角色api权限
export function UpdateCasbin (data: CasbinRequest): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/UpdateCasbin', data)
}

// 获取权限列表
export function getPolicyPathByAuthorityId (data: { authorityId: string }): Promise<ListResponseConfig<CasbinResponse>> {
  return request.post(prefix + '/getPolicyPathByAuthorityId', data)
}
