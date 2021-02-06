<template>
  <div>
    <div class="clearflex">
      <el-button @click="relation" class="fl-right" size="small" type="primary">确 定</el-button>
    </div>
    <el-tree
      :data="menuInfo.menuTreeData"
      :default-checked-keys="menuInfo.menuTreeIds"
      :props="menuDefaultProps"
      @check="nodeChange"
      default-expand-all
      highlight-current
      node-key="ID"
      ref="menuTree"
      show-checkbox
    >
     <template #default="{ node }">
     <span class="custom-tree-node">
        <span>{{ node.label }}</span>
<!--        <span>-->
<!--          <el-button-->
<!--            type="text"-->
<!--            size="mini"-->
<!--            :style="{color:row.defaultRouter == data.name?'#E6A23C':'#85ce61'}"-->
<!--            :disabled="!node.checked"-->
<!--            @click="() => setDefault(data)">-->
<!--            {{ row.defaultRouter == data.name ? "首页" : "设为首页" }}-->
<!--          </el-button>-->
<!--        </span>-->
      </span>
     </template>
    </el-tree>

  </div>
</template>
<script>
/* eslint-disable */

import { defineComponent, ref, reactive, getCurrentInstance, onBeforeMount } from 'vue'

import { updateAuthority } from '@/api/authority'
import { getBaseMenuTree, getMenuAuthority, addMenuAuthority } from '@/api/menu'

export default defineComponent({
  name: 'Menus',
  props: {
    row: {
      default: function () {
        return {}
      },
      type: Object
    }
  },
  setup (props) {
    const { ctx } = getCurrentInstance()
    const menuInfo = reactive({
      menuTreeData: [],
      menuTreeIds: []
    })
    const needConfirm = ref(false)
    const menuDefaultProps = reactive({
      children: 'children',
      label: function (data) {
        return data.meta.title
      }
    })

    const setDefault = async (data) => {
      const res = await updateAuthority({ authorityId: props.row.authorityId, AuthorityName: props.row.authorityName, parentId: props.row.parentId, defaultRouter: data.name })
      if (res.code === 0) {
        ctx.$message({ type: 'success', message: '设置成功' })
        props.row.defaultRouter = res.data.authority.defaultRouter
      }
    }

    const nodeChange = () => {
      needConfirm.value = true
    }
    // 暴露给外层使用的切换拦截统一方法
    const enterAndNext = () => {
      relation()
    }
    // 关联树 确认方法
    const relation = async () => {
      const checkArr = ctx.$refs.menuTree.getCheckedNodes(false, true)
      const res = await addMenuAuthority({
        menus: checkArr,
        authorityId: props.row.authorityId
      })
      if (res.code === 0) {
        ctx.$message({
          type: 'success',
          message: '菜单设置成功!'
        })
      }
    }

    const initMenu = async () => {
      // 获取所有菜单树
      const res = await getBaseMenuTree()
      menuInfo.menuTreeData = res.data.menus
      const res1 = await getMenuAuthority({ authorityId: props.row.authorityId })
      const menus = res1.data.menus
      const arr = []
      menus.forEach(item => {
        // 防止直接选中父级造成全选
        if (!menus.some(same => same.parentId === item.menuId)) {
          arr.push(Number(item.menuId))
        }
      })
      menuInfo.menuTreeIds = arr
    }
    onBeforeMount(() => {
      initMenu()
    })
    return {
      menuInfo,
      menuDefaultProps,
      nodeChange,
      enterAndNext,
      relation,
      setDefault
    }
  }
})
</script>
<style lang="scss">
</style>
