<template>
  <div>
    <div class="search-term">
      <el-form :inline="true" :model="tableInfo.searchInfo" class="demo-form-inline">
        <el-form-item label="路径">
          <el-input placeholder="路径" v-model="tableInfo.searchInfo.path"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="tableInfo.searchInfo.description" placeholder="描述" />
        </el-form-item>
        <el-form-item label="api组">
          <el-input v-model="tableInfo.searchInfo.apiGroup" placeholder="api组" />
        </el-form-item>
        <el-form-item label="请求">
          <el-select clearable placeholder="请选择" v-model="tableInfo.searchInfo.method">
            <el-option v-for="item in methodOptions" :key="item.value" :label="`${item.label}(${item.value})`" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSubmit" type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="openDialog('addApi')" type="primary">新增api</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableInfo.tableData" @sort-change="sortChange" border stripe>
      <el-table-column label="id" min-width="60" prop="ID" sortable="custom"/>
      <el-table-column label="api路径" min-width="150" prop="path" sortable="custom"/>
      <el-table-column label="api分组" min-width="150" prop="apiGroup" sortable="custom"/>
      <el-table-column label="api简介" min-width="150" prop="description" sortable="custom"/>
      <el-table-column label="请求" min-width="150" prop="method" sortable="custom">
        <template #default="scope">
          <div>
            {{ scope.row.method }}
            <el-tag :key="scope.row.methodFilter" :type="tagTypeFilter(scope.row.method)" effect="dark" size="mini">
              {{ methodFilter(scope.row.method) }}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button @click="editApi(scope.row)" size="small" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button @click="deleteApiFun(scope.row)" size="small" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="tableInfo.page"
      :page-size="tableInfo.pageSize"
      :page-sizes="[10, 30, 50, 100]"
      :style="{ float: 'right', padding: '20px' }"
      :total="tableInfo.total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      layout="total, sizes, prev, pager, next, jumper"
    />

    <el-dialog v-model="dialogFormVisible" :close-on-click-modal="false" :before-close="closeDialog" :title="dialogTitle">
      <el-form class="gva-dialog-body" :inline="true" :model="form" :rules="rules" label-width="80px" ref="apiForm">
        <el-form-item label="路径" prop="path">
          <el-input autocomplete="off" v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item label="请求" prop="method">
          <el-select placeholder="请选择" v-model="form.method">
            <el-option v-for="item in methodOptions" :key="item.value" :label="`${item.label}(${item.value})`" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="api分组" prop="apiGroup">
          <el-input autocomplete="off" v-model="form.apiGroup"></el-input>
        </el-form-item>
        <el-form-item label="api简介" prop="description">
          <el-input autocomplete="off" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <div class="warning">新增Api需要在角色管理内配置权限才可使用</div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button @click="enterDialog" type="primary">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, getCurrentInstance } from 'vue'

import { getApiById, getApiList, createApi, updateApi, deleteApi } from '@/api/api'
import { infoList } from '@/mixins/infoList'
import { toSQLLine } from '@/utils/stringFun'

export default {
  name: 'Api',
  setup () {
    const { ctx } = getCurrentInstance()
    const { tableInfo, handleSizeChange, handleCurrentChange, getTableData } = infoList(
      getApiList
    )

    const rules = reactive({
      path: [{ required: true, message: '请输入api路径', trigger: 'blur' }],
      apiGroup: [{ required: true, message: '请输入组名称', trigger: 'blur' }],
      method: [{ required: true, message: '请选择请求方式', trigger: 'blur' }],
      description: [{ required: true, message: '请输入api介绍', trigger: 'blur' }]
    })
    // 静态字典选项
    const methodOptions = reactive([
      {
        value: 'POST',
        label: '创建',
        type: 'success'
      },
      {
        value: 'GET',
        label: '查看',
        type: ''
      },
      {
        value: 'PUT',
        label: '更新',
        type: 'warning'
      },
      {
        value: 'DELETE',
        label: '删除',
        type: 'danger'
      }
    ])
    // 条件搜索前端看此方法
    const onSubmit = () => {
      tableInfo.page = 1
      tableInfo.value = 10
      getTableData()
    }
    // 先获取默认的表格信息
    getTableData()
    // 弹窗相关内容
    const dialogFormVisible = ref(false)
    const dialogTitle = ref('新增Api')
    const type = ref('')
    const form = reactive({
      ID: 0,
      CreatedAt: undefined,
      UpdatedAt: undefined,
      path: '',
      apiGroup: '',
      method: '',
      description: ''
    })
    // 排序
    const sortChange = ({ prop, order }) => {
      if (prop) {
        tableInfo.searchInfo.orderKey = toSQLLine(prop)
        tableInfo.searchInfo.desc = order === 'descending'
      }
      getTableData()
    }

    // 初始化表单
    const initForm = () => {
      ctx.$refs.apiForm.resetFields()
      Object.assign(form, {
        ID: 0,
        CreatedAt: undefined,
        UpdatedAt: undefined,
        path: '',
        apiGroup: '',
        method: '',
        description: ''
      })
    }

    // 关闭弹窗
    const closeDialog = () => {
      initForm()
      dialogFormVisible.value = false
    }

    // 开启弹窗
    const openDialog = (inType) => {
      switch (inType) {
        case 'addApi':
          dialogTitle.value = '新增Api'
          break
        case 'edit':
          dialogTitle.value = '编辑Api'
          break
        default:
          break
      }
      type.value = inType
      dialogFormVisible.value = true
    }

    // 确定弹窗
    const enterDialog = async () => {
      ctx.$refs.apiForm.validate(async (valid) => {
        if (valid) {
          switch (type.value) {
            case 'addApi': {
              const res = await createApi(form)
              if (res.code === 0) {
                ctx.$message({
                  type: 'success',
                  message: '添加成功',
                  showClose: true
                })
              }
              getTableData()
              closeDialog()
            }
              break
            case 'edit': {
              const res = await updateApi(form)
              if (res.code === 0) {
                ctx.$message({
                  type: 'success',
                  message: '编辑成功',
                  showClose: true
                })
              }
              await getTableData()
              closeDialog()
            }
              break
            default:
              ctx.$message({
                type: 'error',
                message: '未知操作',
                showClose: true
              })
              break
          }
        }
      })
    }

    const editApi = async (row) => {
      const res = await getApiById({ id: row.ID })
      Object.assign(form, res.data.api)
      openDialog('edit')
    }
    // 删除方法
    const deleteApiFun = async (row) => {
      ctx
        .$confirm('此操作将永久删除所有角色下该菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          const res = await deleteApi(row)
          if (res.code === 0) {
            ctx.$message({
              type: 'success',
              message: '删除成功!'
            })
            await getTableData()
          }
        })
        .catch(() => {
          ctx.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
    // 展示筛选方法
    const methodFilter = (value) => {
      const target = methodOptions.filter((item) => item.value === value)[0]
      // return target && `${target.label}(${target.value})`
      return target && `${target.label}`
    }
    const tagTypeFilter = (value) => {
      const target = methodOptions.filter((item) => item.value === value)[0]
      return target && `${target.type}`
    }

    return {
      tableInfo,
      handleSizeChange,
      handleCurrentChange,
      dialogFormVisible,
      deleteApiFun,
      dialogTitle,
      rules,
      methodFilter,
      tagTypeFilter,
      sortChange,
      onSubmit,
      editApi,
      enterDialog,
      closeDialog,
      methodOptions,
      openDialog,
      form
    }
  }
}
</script>
<style scoped lang="scss">
.button-box {
  padding: 10px 20px;

  .el-button {
    float: right;
  }
}

.el-tag--mini {
  margin-left: 5px;
}

.warning {
  color: #dc143c;
}
</style>
