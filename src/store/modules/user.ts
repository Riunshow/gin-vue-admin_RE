import router from '@/router/index'
import { LoginParams, UserState, UserInfo } from '@/types/index'
import { RootState } from '@/store'
import { ActionContext } from 'vuex'

import { userLogin } from '@/api/base'

import { ERR_OK } from '@/api/config'

export type state = UserState

const state = {
  userInfo: {
    ID: '',
    nickName: '',
    headerImg: '',
    authority: ''
  },
  token: ''
}

const getters = {
  token (state: UserState) {
    return state.token
  },
  userInfo (state: UserState) {
    return state.userInfo
  }
}

const mutations = {
  setToken (state: UserState, token: string) {
    state.token = token
  },
  setUserInfo (state: UserState, userInfo: UserInfo) {
    state.userInfo = userInfo
  },
  LoginOut (state: UserState) {
    state.userInfo = {}
    state.token = ''
    sessionStorage.clear()
    router.push({ name: 'login', replace: true })
    window.location.reload()
  },
  ResetUserInfo (state: UserState, userInfo: UserInfo = {}) {
    state.userInfo = { ...state.userInfo, ...userInfo }
  }
}

const actions = {
  // 登录
  async login ({ commit }: ActionContext<UserState, RootState>, params: LoginParams) {
    const { code, data } = await userLogin(params)

    if (code === ERR_OK) {
      commit('setUserInfo', data.user)
      commit('setToken', data.token)

      // router.push({ name: getters.userInfo.authority.defaultRouter })

      await router.push({ path: '/layout/dashboard' })

      return true
    }
  },
  async logout ({ commit }: ActionContext<UserState, RootState>) {
    commit('setToken', '')
    commit('setUserInfo', {
      ID: '',
      nickName: '',
      headerImg: '',
      authority: ''
    })
    await router.replace({
      path: '/login'
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
