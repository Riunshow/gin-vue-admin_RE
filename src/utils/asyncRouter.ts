import { MenuListItem } from '@/types'

const _import = require('./_import')

export const asyncRouterHandle = (asyncRouter: MenuListItem[]) => {
  asyncRouter.forEach((item: MenuListItem) => {
    if (item.component) {
      item.component = _import(item.component)
    } else {
      delete item.component
    }
    if (item.children) {
      asyncRouterHandle(item.children)
    }
  })
}
