import request from '@/utils/request'

import { ListResponseConfig, ResponseConfig, ListRequestConfig, SysDictionary } from '@/types'

const prefix = '/sysDictionary'

// 创建SysDictionary
export function createSysDictionary (data: SysDictionary): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/createSysDictionary', data)
}

// 删除SysDictionary
export function deleteSysDictionary (data: { ID: number }): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/deleteSysDictionary', data)
}

// 更新SysDictionary
export function updateSysDictionary (data: SysDictionary): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/updateSysDictionary', data)
}

// 用id查询SysDictionary
export function findSysDictionary (data: { ID: number }): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/findSysDictionary', data)
}

// 分页获取SysDictionary列表
export function getSysDictionaryList (params: ListRequestConfig): Promise<ListResponseConfig<{ list: SysDictionary[] }>> {
  return request.get(prefix + '/getSysDictionaryList', { params })
}
