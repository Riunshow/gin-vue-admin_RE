import { asyncRouterHandle } from '@/utils/asyncRouter'

import { asyncMenu } from '@/api/menu'

import { RouterState, RouterItem, MenuListItem } from '@/types/index'
import { ActionContext } from 'vuex'
import { RootState } from '@/store'

const routerList: RouterItem[] = []

const formatRouter = (routes: MenuListItem[]) => {
  routes && routes.forEach((item: MenuListItem) => {
    if ((!item.children || item.children.every((ch: MenuListItem) => ch.hidden)) && item.name !== '404') {
      routerList.push(<RouterItem>{ label: item.meta.title, value: item.name })
    }
    if (item.children && item.children.length > 0) {
      formatRouter(item.children)
    }
  })
}

export type state = RouterState

const state = {
  asyncRouters: [],
  routerList: routerList
}
const getters = {
  // 获取动态路由
  asyncRouters (state: RouterState) {
    return state.asyncRouters
  },
  routerList (state: RouterState) {
    return state.routerList
  }
}

const mutations = {
  setRouterList (state: RouterState, routerList: RouterItem[]) {
    state.routerList = routerList
  },
  // 设置动态路由
  setAsyncRouter (state: RouterState, asyncRouters: MenuListItem[]) {
    state.asyncRouters = asyncRouters
  }
}

const actions = {
  async SetAsyncRouter ({ commit }: ActionContext<RouterState, RootState>) {
    const baseRouter: MenuListItem[] = [{
      path: '/layout',
      name: 'layout',
      component: 'view/layout/index.vue',
      meta: {
        title: '底层layout'
      },
      children: []
    }]

    const asyncRouterRes = await asyncMenu()
    const asyncRouter = asyncRouterRes.data.menus

    asyncRouter.push({
      path: '404',
      name: '404',
      hidden: true,
      meta: {
        title: '迷路了*。*'
      },
      component: 'view/error/index.vue'
    })

    formatRouter(asyncRouter)

    baseRouter[0].children = asyncRouter
    baseRouter.push({
      meta: {},
      path: '/:catchAll(.*)',
      redirect: '/layout/404'
    })

    asyncRouterHandle(baseRouter)

    commit('setAsyncRouter', baseRouter)
    commit('setRouterList', routerList)

    return true
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
