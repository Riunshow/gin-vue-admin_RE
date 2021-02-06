import { ResponseConfig, ListResponseConfig, ListRequestConfig, MenuList, MenuListItem } from '@/types'
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

// 修改menu列表
export function updateBaseMenu (data: MenuListItem): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/updateBaseMenu', data)
}

// 获取menu列表
export function getMenuList (data: ListRequestConfig): Promise<ListResponseConfig<MenuListItem[]>> {
  return request.post(prefix + '/getMenuList', data)
}

// 新增基础menu
export function addBaseMenu (data: MenuListItem): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/addBaseMenu', data)
}

// 删除基础menu
export function deleteBaseMenu (data: { ID: number }): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/deleteBaseMenu', data)
}

// 根据id获取菜单
export function getBaseMenuById (data: { ID: number }): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/getBaseMenuById', data)
}
