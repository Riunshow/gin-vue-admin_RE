<template>
  <div>
    <div class="clearflex">
      <el-button @click="authApiEnter" class="fl-right" size="small" type="primary">确 定</el-button>
    </div>
    <el-tree
      :data="treeInfo.apiTreeData"
      :default-checked-keys="treeInfo.apiTreeIds"
      :props="apiDefaultProps"
      @check="nodeChange"
      default-expand-all
      highlight-current
      node-key="onlyId"
      ref="apiTree"
      show-checkbox
    ></el-tree>
  </div>
</template>
<script>
import { getAllApis } from '@/api/api'
import { UpdateCasbin, getPolicyPathByAuthorityId } from '@/api/casbin'
import { defineComponent, ref, reactive, getCurrentInstance, onBeforeMount } from 'vue'

export default defineComponent({
  name: 'Apis',
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
    const treeInfo = reactive({
      apiTreeData: [],
      apiTreeIds: []
    })
    const needConfirm = ref(false)
    const activeUserId = ref(0)
    const apiDefaultProps = reactive({
      children: 'children',
      label: 'description'
    })
    const nodeChange = () => {
      needConfirm.value = true
    }
    // 暴露给外层使用的切换拦截统一方法
    const enterAndNext = () => {
      authApiEnter()
    }
    // 创建api树方法
    const buildApiTree = (apis) => {
      const apiObj = {}
      apis &&
        apis.forEach(item => {
          item.onlyId = 'p:' + item.path + 'm:' + item.method
          if (Object.prototype.hasOwnProperty.call(apiObj, item.apiGroup)) {
            apiObj[item.apiGroup].push(item)
          } else {
            Object.assign(apiObj, { [item.apiGroup]: [item] })
          }
        })
      const apiTree = []
      for (const key in apiObj) {
        const treeNode = {
          ID: key,
          description: key + '组',
          children: apiObj[key]
        }
        apiTree.push(treeNode)
      }
      return apiTree
    }
    // 关联关系确定
    const authApiEnter = async () => {
      const checkArr = ctx.$refs.apiTree.getCheckedNodes(true)
      const casbinInfos = []
      checkArr &&
        checkArr.forEach(item => {
          const casbinInfo = {
            path: item.path,
            method: item.method
          }
          casbinInfos.push(casbinInfo)
        })
      const res = await UpdateCasbin({
        authorityId: activeUserId.value,
        casbinInfos
      })
      if (res.code === 0) {
        ctx.$message({ type: 'success', message: 'api设置成功' })
      }
    }

    const initApis = async () => {
      // 获取api并整理成树结构
      const res2 = await getAllApis()
      const apis = res2.data.apis
      treeInfo.apiTreeData = [...buildApiTree(apis)]
      const res = await getPolicyPathByAuthorityId({
        authorityId: props.row.authorityId
      })
      activeUserId.value = props.row.authorityId
      treeInfo.apiTreeIds = []
      res.data.paths &&
      res.data.paths.forEach(item => {
        treeInfo.apiTreeIds.push('p:' + item.path + 'm:' + item.method)
      })
      treeInfo.apiTreeIds = [...treeInfo.apiTreeIds]
    }

    onBeforeMount(() => {
      initApis()
    })
    return {
      enterAndNext,
      authApiEnter,
      treeInfo,
      apiDefaultProps,
      nodeChange
    }
  }
})
</script>
<style lang="scss">
</style>
