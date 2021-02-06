import { IMessage } from 'element-plus/lib/el-message/src/types'
import { inject } from 'vue'

export function useMessage () {
  return inject('$message') as IMessage
}
