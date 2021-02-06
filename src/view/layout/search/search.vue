<template>
  <div class="search-component">
    <transition name="el-fade-in-linear">
      <div class="transition-box" style="display: inline-block" v-show="show">
        <el-select
          ref="search-input"
          @blur="hiddenSearch"
          @change="changeRouter"
          filterable
          placeholder="请选择"
          v-model="value"
        >
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in routerList"
          ></el-option>
        </el-select>
      </div>
    </transition>
    <div
      :style="{display:'inline-block',float:'right',width:'31px',textAlign:'left',fontSize:'16px',paddingTop:'2px'}"
      class="user-box"
    >
      <i @click="emitter.emit('reload')" :style="{cursor:'pointer'}" class="el-icon-refresh" />
    </div>
    <div :style="{ display: 'inline-block', float: 'right' }" class="user-box">
      <i :style="{cursor:'pointer'}"  @click="showSearch()" class="el-icon-search search-icon"></i>
    </div>
  </div>
</template>
<script>
import { computed, getCurrentInstance, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { emitter } from '@/hooks/useEmitter'

export default {
  name: 'searchComponent',
  setup () {
    const { ctx } = getCurrentInstance()
    const store = useStore()
    const value = ref('')
    const router = useRouter()
    const show = ref(false)
    const routerList = computed(() => store.getters['router/routerList'])
    const changeRouter = () => {
      router.push({ name: value.value })
      value.value = ''
    }
    const hiddenSearch = () => {
      show.value = false
    }
    const showSearch = () => {
      show.value = true
      ctx.$nextTick(() => {
        ctx.$refs['search-input'].focus()
      })
    }

    return {
      value,
      router,
      show,
      routerList,
      changeRouter,
      hiddenSearch,
      showSearch,
      emitter
    }
  }
}
</script>
<style lang="scss"></style>
