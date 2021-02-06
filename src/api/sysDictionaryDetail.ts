import request from '@/utils/request'

import { ListResponseConfig, ResponseConfig, ListRequestConfig, SysDictionary } from '@/types'

const prefix = '/sysDictionaryDetail'

// 创建SysDictionary
export function createSysDictionaryDetail (data: SysDictionary): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/createSysDictionaryDetail', data)
}

// 删除SysDictionary
export function deleteSysDictionaryDetail (data: { ID: number }): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/deleteSysDictionaryDetail', data)
}

// 更新SysDictionary
export function updateSysDictionaryDetail (data: SysDictionary): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/updateSysDictionaryDetail', data)
}

// 用id查询SysDictionary
export function findSysDictionaryDetail (data: { ID: number }): Promise<ResponseConfig<null>> {
  return request.post(prefix + '/findSysDictionaryDetail', data)
}

// 分页获取SysDictionary列表
export function getSysDictionaryDetailList (params: ListRequestConfig): Promise<ListResponseConfig<null>> {
  return request.get(prefix + '/getSysDictionaryDetailList', { params })
}
