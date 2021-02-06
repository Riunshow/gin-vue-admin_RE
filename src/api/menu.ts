import { ResponseConfig, MenuList, MenuListItem } from '@/types'
import request from '@/utils/request'

const prefix = '/menu'

// 获取动态路由
export function asyncMenu (): Promise<ResponseConfig<MenuList>> {
  return request.post(prefix + '/getMenu')
}

// 获取基础路由列表
export function getBaseMenuTree (): Promise<ResponseConfig<MenuList>> {
  return request.post(prefix + '/getBaseMenuTree')
}

// 获取用户menu关联关系
export function getMenuAuthority (data: { authorityId: string }): Promise<ResponseConfig<MenuList>> {
  return request.post(prefix + '/getMenuAuthority', data)
}

// 添加用户menu关联关系
export function addMenuAuthority (data: { authorityId: string, menus: MenuListItem[] }): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/addMenuAuthority', data)
}
