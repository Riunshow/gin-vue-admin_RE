import { LoginParams, ResponseConfig, Captcha, LoginResponse } from '@/types'
import request from '@/utils/request'

const prefix = '/base'

// 获取验证码
export function captcha (): Promise<ResponseConfig<Captcha>> {
  return request.post(prefix + '/captcha')
}

// user login 用户登录
export function userLogin (params: LoginParams): Promise<ResponseConfig<LoginResponse>> {
  return request.post(prefix + '/login', params)
}
