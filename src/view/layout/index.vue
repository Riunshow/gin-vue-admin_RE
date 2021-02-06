<template>
  <el-container class="layout-cont">
    <el-container :class="[isSider ? 'openside' : 'hideside', isMobile ? 'mobile' : '']">
      <el-row :class="[isShadowBg ? 'shadowBg' : '']" @click="changeShadow()"></el-row>
      <el-aside class="main-cont main-left">
        <div class="title">
          <img alt class="logoimg" src="~@/assets/nav_logo.png"/>
          <h2 class="tit-text" v-if="isSider">Gin-Vue-Admin</h2>
        </div>
        <Aside class="aside"/>
      </el-aside>
      <!-- 分块滑动功能 -->
      <el-main class="main-cont main-right">
        <transition :duration="{ enter: 800, leave: 100 }" mode="out-in" name="el-fade-in-linear">
          <div :style="{width: `calc(100% - ${isMobile ? '0px' : isCollapse ? '54px' : '220px'})`}" class="topfix">
            <el-row>
              <el-header class="header-cont flex-between" style="width: 100%">
                <div class="flex-center">
                  <i class="icon-collapse" :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="totalCollapse"/>
                  <!-- todo:修改面包屑  -->
                  <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item v-for="item in matched.slice(1,matched.length)" :key="item.path">{{ item.meta.title }}</el-breadcrumb-item>
                  </el-breadcrumb>
                </div>
                <div class="flex-center" style="line-height: 60px;">
                  <Search />
                  <el-dropdown style="line-height: 62px;">
                      <span class="header-avatar">
<!--                       <CustomPic/>-->
                        <span style="margin-left: 5px">{{ userInfo.nickName }}</span>
                        <i class="el-icon-arrow-down"></i>
                      </span>
                    <template #dropdown>
                      <el-dropdown-menu class="dropdown-group">
                        <el-dropdown-item><span>更多信息<el-badge is-dot/></span>
                        </el-dropdown-item>
                        <el-dropdown-item @click="toPerson" icon="el-icon-s-custom">个人信息</el-dropdown-item>
                        <el-dropdown-item @click="LoginOut" icon="el-icon-table-lamp">登 出</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </el-header>
            </el-row>
          </div>
        </transition>

        <router-view
          v-if="route.meta.keepAlive && reloadFlag"
          :key="route.fullPath"
          v-slot="{ Component }"
          v-loading="loadingFlag"
          element-loading-text="正在加载中"
          class="admin-box"
        >
          <keep-alive>
            <component :is="Component"/>
          </keep-alive>
        </router-view>
        <router-view
          v-if="!route.meta.keepAlive && reloadFlag"
          :key="route.fullPath"
          v-slot="{ Component }"
          v-loading="loadingFlag"
          element-loading-text="正在加载中"
          class="admin-box"
        >
          <component :is="Component"/>
        </router-view>
        <BottomInfo/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import Aside from '@/view/layout/aside/index.vue'
import Search from '@/view/layout/search/search.vue'
import BottomInfo from '@/view/layout/bottomInfo/bottomInfo.vue'
import { useStore } from 'vuex'
// import CustomPic from '@/components/customPic/index.vue'
import { emitter } from '@/hooks/useEmitter'
import { computed, reactive, toRefs, nextTick, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'Layout',
  components: {
    Aside,
    Search,
    BottomInfo
    // CustomPic
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const state = reactive({
      show: false,
      isCollapse: false,
      isSider: false,
      isMobile: false,
      isShadowBg: false,
      loadingFlag: false,
      reloadFlag: true,
      value: ''
    })

    const userInfo = computed(() => store.getters['user/userInfo'])
    const title = computed(() => route.meta.title || '当前页面')
    const matched = computed(() => route.matched)

    const LoginOut = () => store.dispatch('user/logout')

    const totalCollapse = () => {
      state.isCollapse = !state.isCollapse
      state.isSider = !state.isCollapse
      state.isShadowBg = !state.isCollapse
      emitter.emit('collapse', state.isCollapse)
    }
    const reload = async () => {
      state.reloadFlag = false
      await nextTick(() => {
        state.reloadFlag = true
      })
    }
    const toPerson = () => {
      router.push({ name: 'person' })
    }
    const changeShadow = () => {
      state.isShadowBg = !state.isShadowBg
      state.isSider = !!state.isCollapse
      totalCollapse()
    }
    const handleResizeWindow = () => {
      const screenWidth = document.body.clientWidth
      if (screenWidth < 1000) {
        state.isMobile = true
        state.isSider = false
        state.isCollapse = true
      } else if (screenWidth >= 1000 && screenWidth < 1200) {
        state.isMobile = false
        state.isSider = false
        state.isCollapse = true
      } else {
        state.isMobile = false
        state.isSider = true
        state.isCollapse = false
      }
      emitter.emit('collapse', state.isCollapse)
      emitter.emit('mobile', state.isMobile)
    }

    onMounted(() => {
      handleResizeWindow()

      emitter.on('showLoading', () => {
        state.loadingFlag = true
      })
      emitter.on('reload', () => {
        reload()
      })
      emitter.on('closeLoading', () => {
        state.loadingFlag = false
      })
      window.onresize = () => {
        handleResizeWindow()
      }
    })
    return {
      ...toRefs(state),
      userInfo,
      title,
      matched,
      route,
      LoginOut,
      totalCollapse,
      toPerson,
      changeShadow
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/style/mobile.scss";

.icon-collapse {
  font-size: 22px;
  color: #838383;
}
</style>
