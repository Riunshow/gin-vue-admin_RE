<template>
  <div class="authority">
    <div class="button-box clearflex">
      <el-button @click="addAuthority('0')" type="primary">新增角色</el-button>
    </div>
    <el-table
      :data="tableInfo.tableData"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      border
      row-key="authorityId"
      stripe
      style="width: 100%"
    >
      <el-table-column label="角色id" min-width="180" prop="authorityId"/>
      <el-table-column label="角色名称" min-width="180" prop="authorityName"/>
      <el-table-column fixed="right" label="操作" width="460">
        <template #default="scope">
          <el-button @click="openDrawer(scope.row)" size="small" type="primary">设置权限</el-button>
          <el-button @click="addAuthority(scope.row.authorityId)" icon="el-icon-plus" size="small" type="primary">
            新增子角色
          </el-button>
          <el-button @click="copyAuthorityFunc(scope.row)" icon="el-icon-copy-document" size="small" type="primary">拷贝
          </el-button>
          <el-button @click="editAuthority(scope.row)" icon="el-icon-edit" size="small" type="primary">编辑</el-button>
          <el-button @click="deleteAuth(scope.row)" icon="el-icon-delete" size="small" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增角色弹窗 -->
    <el-dialog :close-on-click-modal="false" :title="dialogTitle" v-model="dialogFormVisible">
      <el-form class="gva-dialog-body" :model="form" :rules="rules" ref="authorityForm">
        <el-form-item label="父级角色" prop="parentId">
          <el-cascader
            v-model="form.parentId"
            :disabled="dialogType === 'add'"
            :options="AuthorityOption"
            :props="{
              checkStrictly: true,
              label: 'authorityName',
              value: 'authorityId',
              disabled: 'disabled',
              emitPath: false,
            }"
            :show-all-levels="false"
            filterable
          />
        </el-form-item>
        <el-form-item label="角色ID" prop="authorityId">
          <el-input v-model="form.authorityId" :disabled="dialogType == 'edit'" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="角色姓名" prop="authorityName">
          <el-input autocomplete="off" v-model="form.authorityName"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button @click="enterDialog" type="primary">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-drawer v-if="drawer" v-model="drawer" :with-header="false" size="40%" title="角色配置">
      <el-tabs :before-leave="autoEnter" class="role-box" type="border-card">
        <el-tab-pane label="角色菜单">
          <Menus :row="activeRow" ref="menus"/>
        </el-tab-pane>
        <el-tab-pane label="角色api">
          <apis :row="activeRow" ref="apis" />
        </el-tab-pane>
        <el-tab-pane label="资源权限">
          <Datas v-model:authority="tableInfo.tableData" v-model:row="activeRow" ref="datas" />
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script>
import {
  getAuthorityList,
  deleteAuthority,
  createAuthority,
  updateAuthority,
  copyAuthority
} from '@/api/authority'

import Menus from '@/view/superAdmin/authority/components/menus'
import Apis from '@/view/superAdmin/authority/components/apis'
import Datas from '@/view/superAdmin/authority/components/datas'

import { defineComponent, ref, reactive, getCurrentInstance } from 'vue'
import { infoList } from '@/mixins/infoList'

const mustUint = (rule, value, callback) => {
  if (!/^[0-9]*[1-9][0-9]*$/.test(value)) {
    return callback(new Error('请输入正整数'))
  }
  return callback()
}

export default defineComponent({
  name: 'Authority',
  components: {
    Menus,
    Apis,
    Datas
  },
  setup () {
    const { tableInfo, handleSizeChange, handleCurrentChange, getTableData } = infoList(getAuthorityList)

    const { ctx } = getCurrentInstance()
    tableInfo.pageSize = 999
    getTableData()

    const AuthorityOption = reactive([
      {
        authorityId: '0',
        authorityName: '根角色'
      }
    ])

    const drawer = ref(false)
    const dialogType = ref('add')
    const activeRow = reactive({})
    const dialogTitle = ref('新增角色')
    const dialogFormVisible = ref(false)
    const apiDialogFlag = ref(false)
    const copyForm = reactive({})
    const form = reactive({
      ID: 0,
      CreatedAt: undefined,
      UpdatedAt: undefined,
      authorityId: '',
      authorityName: '',
      parentId: '0'
    })
    const rules = reactive({
      authorityId: [
        { required: true, message: '请输入角色ID', trigger: 'blur' },
        { validator: mustUint, trigger: 'blur' }
      ],
      authorityName: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
      parentId: [{ required: true, message: '请选择请求方式', trigger: 'blur' }]
    })

    const autoEnter = (activeName, oldActiveName) => {
      const paneArr = ['menus', 'apis', 'datas']
      if (oldActiveName) {
        // 存疑
        if (ctx.$refs[paneArr[oldActiveName]].needConfirm) {
          ctx.$refs[paneArr[oldActiveName]].enterAndNext()
          ctx.$refs[paneArr[oldActiveName]].needConfirm = false
        }
      }
    }
    // 拷贝角色
    const copyAuthorityFunc = (row) => {
      setOptions()
      dialogTitle.value = '拷贝角色'
      dialogType.value = 'copy'
      for (const k in form) {
        form[k] = row[k]
      }
      Object.assign(copyForm, row)
      dialogFormVisible.value = true
    }
    const openDrawer = (row) => {
      drawer.value = true
      Object.assign(activeRow, row)
    }
    // 删除角色
    const deleteAuth = (row) => {
      ctx.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteAuthority({ authorityId: row.authorityId })
        if (res.code === 0) {
          ctx.$message({
            type: 'success',
            message: '删除成功!'
          })
          await getTableData()
        }
      }).catch(() => {
        ctx.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
    // 初始化表单
    const initForm = () => {
      if (ctx.$refs.authorityForm) {
        ctx.$refs.authorityForm.resetFields()
      }
      Object.assign(form, {
        ID: 0,
        CreatedAt: undefined,
        UpdatedAt: undefined,
        authorityId: '',
        authorityName: '',
        parentId: '0'
      })
    }
    // 关闭窗口
    const closeDialog = () => {
      initForm()
      dialogFormVisible.value = false
      apiDialogFlag.value = false
    }
    // 确定弹窗

    const enterDialog = async () => {
      if (form.authorityId === '0') {
        ctx.$message({
          type: 'error',
          message: '角色id不能为0'
        })
        return false
      }
      ctx.$refs.authorityForm.validate(async (valid) => {
        if (valid) {
          switch (dialogType.value) {
            case 'add': {
              const res = await createAuthority(form)
              if (res.code === 0) {
                ctx.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                await getTableData()
                closeDialog()
              }
            }
              break
            case 'edit': {
              const res = await updateAuthority(form)
              if (res.code === 0) {
                ctx.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                await getTableData()
                closeDialog()
              }
            }
              break
            case 'copy': {
              const data = {
                authority: {
                  authorityId: 'string',
                  authorityName: 'string',
                  datauthorityId: [],
                  parentId: 'string'
                },
                oldAuthorityId: 0
              }
              data.authority.authorityId = form.authorityId
              data.authority.authorityName = form.authorityName
              data.authority.parentId = form.parentId
              data.authority.dataAuthorityId = copyForm.dataAuthorityId
              data.oldAuthorityId = copyForm.authorityId
              const res = await copyAuthority(data)
              if (res.code === 0) {
                ctx.$message({
                  type: 'success',
                  message: '复制成功！'
                })
                await getTableData()
              }
            }
          }

          initForm()
          dialogFormVisible.value = false
        }
      })
    }
    const setOptions = () => {
      AuthorityOption.length = 0
      Object.assign(AuthorityOption, [
        {
          authorityId: '0',
          authorityName: '根角色'
        }
      ])
      setAuthorityOptions(tableInfo.tableData, AuthorityOption, false)
    }
    const setAuthorityOptions = (AuthorityData, optionsData, disabled) => {
      form.authorityId = String(form.authorityId)
      AuthorityData &&
      AuthorityData.forEach((item) => {
        if (item.children && item.children.length) {
          const option = {
            authorityId: item.authorityId,
            authorityName: item.authorityName,
            disabled: disabled || item.authorityId === form.authorityId,
            children: []
          }
          setAuthorityOptions(
            item.children,
            option.children,
            disabled || item.authorityId === form.authorityId
          )
          optionsData.push(option)
        } else {
          const option = {
            authorityId: item.authorityId,
            authorityName: item.authorityName,
            disabled: disabled || item.authorityId === form.authorityId
          }
          optionsData.push(option)
        }
      })
    }
    // 增加角色
    const addAuthority = (parentId) => {
      initForm()
      dialogTitle.value = '新增角色'
      dialogType.value = 'add'
      form.parentId = parentId
      setOptions()
      dialogFormVisible.value = true
    }
    // 编辑角色
    const editAuthority = (row) => {
      dialogTitle.value = '编辑角色'
      dialogType.value = 'edit'
      for (const key in form) {
        form[key] = row[key]
      }
      setOptions()
      dialogFormVisible.value = true
    }
    return {
      tableInfo,
      handleSizeChange,
      handleCurrentChange,
      addAuthority,
      openDrawer,
      copyAuthorityFunc,
      editAuthority,
      dialogTitle,
      dialogFormVisible,
      form,
      rules,
      dialogType,
      AuthorityOption,
      enterDialog,
      closeDialog,
      drawer,
      activeRow,
      autoEnter,
      deleteAuth
    }
  }
})
</script>
<style lang="scss">
.authority {
  .el-input-number {
    margin-left: 15px;

    span {
      display: none;
    }
  }

  .button-box {
    padding: 10px 20px;

    .el-button {
      float: right;
    }
  }
}

.role-box {
  .el-tabs__content {
    height: calc(100vh - 150px);
    overflow: auto;
  }
}
</style>
