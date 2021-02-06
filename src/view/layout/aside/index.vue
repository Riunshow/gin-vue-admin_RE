<template>
  <div>
    <el-scrollbar style="height:calc(100vh - 64px)">
      <transition :duration="{ enter: 800, leave: 100 }" mode="out-in" name="el-fade-in-linear">
        <el-menu
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="active"
          @select="selectMenuItem"
          active-text-color="#fff"
          class="el-menu-vertical"
          text-color="rgb(191, 203, 217)"
          unique-opened
        >
          <template v-for="item in asyncRouters[0].children">
            <aside-component :key="item.name" :routerInfo="item" v-if="!item.hidden" />
          </template>
        </el-menu>
      </transition>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import AsideComponent from '@/view/layout/aside/asideComponent/index.vue'
import { emitter } from '@/hooks/useEmitter'
import { computed, reactive, watchEffect, onUnmounted, ComputedRef, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
export default {
  name: 'Aside',
  components: {
    AsideComponent
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const state = reactive({
      active: '',
      isCollapse: false
    })

    const addHistory = () => store.commit('history/addHistory')
    const asyncRouters = computed(() => store.getters['router/asyncRouters'])

    const selectMenuItem = (index: string, _: ComputedRef<string[]>, ele: any) => {
      const query: any = {}
      const params: any = {}

      ele.route.parameters &&
        ele.route.parameters.forEach((item: any) => {
          if (item.type === 'query') {
            query[item.key] = item.value
          } else {
            params[item.key] = item.value
          }
        })

      if (index === route.name) return

      if (index.indexOf('http://') > -1 || index.indexOf('https://') > -1) {
        window.open(index)
      } else {
        state.active = index
        router.push({ name: index, query, params })
      }
    }

    const handleCollapse = (item: boolean) => {
      state.isCollapse = item
    }

    watchEffect(() => {
      state.active = route.name as string
    })

    emitter.on('collapse', item => handleCollapse(item))

    onUnmounted(() => {
      emitter.off('collapse', item => handleCollapse(item))
    })
    return {
      ...toRefs(state),
      addHistory,
      selectMenuItem,
      asyncRouters
    }
  }
}
</script>

<style lang="scss">
.el-scrollbar {
  .el-scrollbar__view {
    height: 100%;
  }
}
.menu-info {
  .menu-control {
    line-height: 52px;
    font-size: 20px;
    display: table-cell;
    vertical-align: middle;
  }
}
</style>
