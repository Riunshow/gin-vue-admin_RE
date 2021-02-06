<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    {{ levelList }}
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noRedirect' || index === levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import pathToRegexp from 'path-to-regexp'

import { RouteLocation } from '@/types'

export default defineComponent({
  setup () {
    const route = useRoute()
    const router = useRouter()

    const levelList = ref<RouteLocation[]>([])

    const isHome = (route: RouteLocation) => {
      return route.path === '/home'
    }

    const getBreadcrumb = () => {
      const matched: any = route.matched.filter(item => item.meta && item.meta.title)

      const matchedRouteInfo: RouteLocation[] = matched.map(({ meta, path, redirect }: RouteLocation) => ({ path, meta, redirect }))

      const firstRoute: RouteLocation = matchedRouteInfo[0]

      const homeRoute: RouteLocation = {
        path: '/home',
        meta: { title: '主页' }
      }

      let breadcrumbRouteList: RouteLocation[] = [...matchedRouteInfo]

      if (!isHome(firstRoute)) {
        breadcrumbRouteList = [homeRoute, ...breadcrumbRouteList]
      }

      levelList.value = breadcrumbRouteList.filter(item => item.meta && item.meta.title)
    }

    const pathCompile = (path: string) => {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = route
      const toPath = pathToRegexp.compile(path)
      return toPath(params)
    }

    const handleLink = (item: RouteLocation) => {
      const { redirect, path } = item
      if (redirect) {
        router.push(redirect)
        return
      }
      router.push(pathCompile(path))
    }

    getBreadcrumb()

    return {
      levelList,
      handleLink
    }
  }
})
</script>

<style scoped>

</style>
