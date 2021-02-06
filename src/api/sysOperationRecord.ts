import request from '@/utils/request'

import { ApiItem, ListResponseConfig, ResponseConfig, ListRequestConfig } from '@/types'

const prefix = '/sysOperationRecord'

// 删除SysOperationRecord
export function deleteSysOperationRecord (data: { ID: number }): Promise<ResponseConfig<null>> {
  return request.delete(prefix + '/deleteSysOperationRecord', { data })
}

// 分页获取SysOperationRecord列表
export function getSysOperationRecordList (params: ListRequestConfig): Promise<ListResponseConfig<ApiItem[]>> {
  return request.get(prefix + '/getSysOperationRecordList', { params })
}

// 批量删除SysOperationRecord
export function deleteSysOperationRecordByIds (data: { ids: number[] }): Promise<ResponseConfig<null>> {
  return request.delete(prefix + '/deleteSysOperationRecordByIds', { data })
}
