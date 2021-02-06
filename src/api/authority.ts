import {
  Authority,
  AuthorityItem,
  DeleteAuthorityItem,
  EditAuthorityItem,
  CopyAuthorityItem,
  ResponseConfig,
  ListResponseConfig,
  ListRequestConfig
} from '@/types'

import request from '@/utils/request'

const prefix = '/authority'

// 获取角色列表
export function getAuthorityList (data: ListRequestConfig): Promise<ListResponseConfig<AuthorityItem[]>> {
  return request.post(prefix + '/getAuthorityList', data)
}

// 删除角色列表
export function deleteAuthority (data: DeleteAuthorityItem): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/deleteAuthority', data)
}

// 新增角色
export function createAuthority (data: EditAuthorityItem): Promise<ResponseConfig<Authority>> {
  return request.post(prefix + '/createAuthority', data)
}

// 编辑角色
export function updateAuthority (data: EditAuthorityItem): Promise<ResponseConfig<Authority>> {
  return request.put(prefix + '/updateAuthority', data)
}

// 拷贝角色
export function copyAuthority (data: CopyAuthorityItem): Promise<ResponseConfig<Authority>> {
  return request.post(prefix + '/copyAuthority', data)
}

// 设置角色资源权限
export function setDataAuthority (data: AuthorityItem): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/setDataAuthority', data)
}
