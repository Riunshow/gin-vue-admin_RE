import { LoginParams, ResponseConfig } from '@/types'
import request from '@/utils/request'

const prefix = '/user'

// user register 用户注册
export function userRegister (params: LoginParams): Promise<ResponseConfig<string>> {
  return request.post(prefix + '/register', params)
}
