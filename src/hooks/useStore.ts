import { useStore } from 'vuex'
import { RootState } from '@/store'
// 这几个玩意的type
import { Getters, Dispatch, Commit } from './storeUtils'

interface UseStoreHooks {
  state: RootState;
  getters: Getters;
  commit: Commit;
  dispatch: Dispatch;
}

const useStoreHooks = (): UseStoreHooks => {
  const store = useStore<RootState>()
  console.log(store)
  // return store;
  // 自定义的进行输出结果
  const { state, getters, dispatch, commit }: UseStoreHooks = store
  return {
    state,
    getters,
    commit,
    dispatch
  }
}

export { useStoreHooks }
export default useStoreHooks
