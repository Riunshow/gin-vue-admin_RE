import { LoginParams, ResponseConfig, ListResponseConfig, ListRequestConfig, UserInfo } from '@/types'
import request from '@/utils/request'

const prefix = '/user'

// user register 用户注册
export function userRegister (data: LoginParams): Promise<ResponseConfig<string>> {
  return request.post(prefix + '/register', data)
}

// 分页获取用户列表
export function getUserList (data: ListRequestConfig): Promise<ListResponseConfig<{ list: UserInfo[] }>> {
  return request.post(prefix + '/getUserList', data)
}

// 设置用户权限
export function setUserAuthority (data: { uuid: number; authorityId: string; }): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/setUserAuthority', data)
}

// 用户注册
export function register (data: UserInfo): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/register', data)
}

// 删除用户
export function deleteUser (data: { id: number }): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/deleteUser', data)
}
