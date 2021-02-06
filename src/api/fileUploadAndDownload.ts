import request from '@/utils/request'

import { ResponseConfig, ListResponseConfig } from '@/types'

const prefix = '/fileUploadAndDownload'

// 分页文件列表
export function getFileList (data: any): Promise<ListResponseConfig<any>> {
  return request.post(prefix + '/getFileList', data)
}

// 删除文件
export function deleteFile (data: any): Promise<ResponseConfig<any>> {
  return request.post(prefix + '/deleteFile', data)
}
