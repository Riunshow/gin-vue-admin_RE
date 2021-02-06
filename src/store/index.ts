import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'

import UserModule, { state as UserState } from './modules/user'
import RouterModule, { state as RouterState } from './modules/router'

export type RootState = {
  user: UserState;
  route: RouterState;
}

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['user']
})

const store = createStore({
  modules: {
    user: UserModule,
    router: RouterModule
  },
  plugins: [vuexLocal.plugin]
})

export default store
