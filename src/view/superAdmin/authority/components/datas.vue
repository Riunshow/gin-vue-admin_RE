<template>
  <div>
    <div class="clearflex" style="margin:18px">
      <el-button @click="authDataEnter" class="fl-right" size="small" type="primary">确 定</el-button>
      <el-button @click="all" class="fl-left" size="small" type="primary">全选</el-button>
      <el-button @click="self" class="fl-left" size="small" type="primary">本角色</el-button>
      <el-button @click="selfAndChildren" class="fl-left" size="small" type="primary">本角色及子角色</el-button>
    </div>
    <el-checkbox-group v-model="authInfo.dataAuthorityId" @change="selectAuthority">
      <el-checkbox v-for="(item,key) in authInfo.authoritys" :label="item.authorityId" :key="key">{{item.authorityName}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
/* eslint-disable */

import { setDataAuthority } from '@/api/authority'
import { defineComponent, ref, reactive, getCurrentInstance, onBeforeMount } from 'vue'

export default defineComponent({
  name: 'Datas',
  props: {
    row: {
      default: function () {
        return {}
      },
      type: Object
    },
    authority: {
      default: function () {
        return []
      },
      type: Array
    }
  },
  setup (props) {
    const { ctx } = getCurrentInstance()
    const authInfo = reactive({
      authoritys: [],
      dataAuthorityId: []
    })
    const needConfirm = ref(false)

    // 暴露给外层使用的切换拦截统一方法
    const enterAndNext = () => {
      authDataEnter()
    }
    const all = () => {
      authInfo.dataAuthorityId = [...authInfo.authoritys]
      props.row.dataAuthorityId = authInfo.dataAuthorityId
      needConfirm.value = true
    }
    const self = () => {
      authInfo.dataAuthorityId = authInfo.authoritys.filter(
        item => item.authorityId === props.row.authorityId
      )
      props.row.dataAuthorityId = authInfo.dataAuthorityId
      needConfirm.value = true
    }
    const selfAndChildren = () => {
      const arrBox = []
      getChildrenId(props.row, arrBox)
      authInfo.dataAuthorityId = authInfo.authoritys.filter(
        item => arrBox.indexOf(item.authorityId) > -1
      )
      props.row.dataAuthorityId = authInfo.dataAuthorityId
      needConfirm.value = true
    }
    const getChildrenId = (row, arrBox) => {
      arrBox.push(row.authorityId)
      row.children &&
        row.children.forEach(item => {
          getChildrenId(item, arrBox)
        })
    }
    // 提交
    const authDataEnter = async () => {
      const res = await setDataAuthority(props.row)
      if (res.code === 0) {
        ctx.$message({ type: 'success', message: '资源设置成功' })
      }
    }
    //   平铺角色
    const roundAuthority = authoritys => {
      authoritys &&
        authoritys.forEach(item => {
          const obj = {}
          obj.authorityId = item.authorityId
          obj.authorityName = item.authorityName
          authInfo.authoritys.push(obj)
          if (item.children && item.children.length) {
            roundAuthority(item.children)
          }
        })
    }
    //   选择
    const selectAuthority = () => {
      props.row.dataAuthorityId = authInfo.dataAuthorityId
      needConfirm.value = true
    }

    const initDatas = () => {
      authInfo.authoritys = []
      authInfo.dataAuthorityId = []
      roundAuthority(props.authority)
      props.row.dataAuthorityId &&
        props.row.dataAuthorityId.forEach(item => {
          const obj =
            authInfo.authoritys &&
            authInfo.authoritys.filter(
              au => au.authorityId === item.authorityId
            ) &&
            authInfo.authoritys.filter(
              au => au.authorityId === item.authorityId
            )[0]
          authInfo.dataAuthorityId.push(obj)
        })
    }
    onBeforeMount(() => {
      initDatas()
    })
    return {
      enterAndNext,
      authInfo,
      needConfirm,
      all,
      self,
      selfAndChildren,
      getChildrenId,
      authDataEnter,
      roundAuthority,
      selectAuthority
    }
  }
})
</script>
<style lang="less">
</style>
