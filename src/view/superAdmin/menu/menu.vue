<template>
  <div>
    <div class="button-box clearflex">
      <el-button @click="addMenu('0')" type="primary">新增根菜单</el-button>
    </div>

    <!-- 由于此处菜单跟左侧列表一一对应所以不需要分页 pageSize默认999 -->
    <el-table :data="tableInfo.tableData" border row-key="ID" stripe>
      <el-table-column label="ID" min-width="100" prop="ID"></el-table-column>
      <el-table-column label="路由Name" min-width="160" prop="name"></el-table-column>
      <el-table-column label="路由Path" min-width="160" prop="path"></el-table-column>
      <el-table-column label="是否隐藏" min-width="100" prop="hidden">
        <template #default="scope">
          <span>{{scope.row.hidden?"隐藏":"显示"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="父节点" min-width="90" prop="parentId"></el-table-column>
      <el-table-column label="排序" min-width="70" prop="sort"></el-table-column>
      <el-table-column label="文件路径" min-width="360" prop="component"></el-table-column>
      <el-table-column label="展示名称" min-width="120" prop="authorityName">
        <template #default="scope">
          <span>{{scope.row.meta.title}}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标" min-width="140" prop="authorityName">
        <template #default="scope">
          <i :class="`el-icon-${scope.row.meta}`"></i>
          <span>{{scope.row.meta.icon}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="300">
        <template #default="scope">
          <el-button @click="addMenu(scope.row.ID)" size="small" type="primary" icon="el-icon-edit">添加子菜单</el-button>
          <el-button @click="editMenu(scope.row.ID)" size="small" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button @click="deleteMenu(scope.row.ID)" size="small" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :close-on-click-modal="false" :before-close="handleClose" :title="dialogTitle" v-model="dialogFormVisible">
      <div class="gva-dialog-body">
        <el-form :inline="true" :model="form" :rules="rules" label-position="top" label-width="85px" ref="menuForm">
          <el-form-item label="路由name" prop="path" style="width:30%">
            <el-input v-model="form.name" @change="changeName" autocomplete="off" placeholder="唯一英文字符串" />
          </el-form-item>
          <el-form-item prop="path" style="width:30%">
            <template #label>
              <div style="display:inline-block">
                路由path
                <el-checkbox style="float:right;margin-left:20px;" v-model="checkFlag">添加参数</el-checkbox>
              </div>
            </template>
            <el-input v-model="form.path" :disabled="!checkFlag" autocomplete="off" placeholder="建议只在后方拼接参数" />
          </el-form-item>
          <el-form-item label="是否隐藏" style="width:30%">
            <el-select placeholder="是否在列表隐藏" v-model="form.hidden">
              <el-option value="false" label="否" />
              <el-option value="true" label="是" />
            </el-select>
          </el-form-item>
          <el-form-item label="父节点Id" style="width:30%">
            <el-cascader
              v-model="form.parentId"
              :disabled="isEdit"
              :options="menuOption"
              :props="{ checkStrictly: true,label:'title',value:'ID',disabled:'disabled',emitPath:false}"
              :show-all-levels="false"
              filterable
            />
          </el-form-item>
          <el-form-item label="文件路径" prop="component" style="width:30%">
            <el-input autocomplete="off" v-model="form.component" />
          </el-form-item>
          <el-form-item label="展示名称" prop="meta.title" style="width:30%">
            <el-input autocomplete="off" v-model="form.meta.title" />
          </el-form-item>
          <el-form-item label="图标" prop="meta.icon" style="width:30%">
            <icon :meta="form.meta">
              <template #prepend>el-icon-</template>
            </icon>
          </el-form-item>
          <el-form-item label="排序标记" prop="sort" style="width:30%">
            <el-input autocomplete="off" v-model.number="form.sort" />
          </el-form-item>
          <el-form-item label="keepAlive" prop="meta.keepAlive" style="width:30%">
            <el-select placeholder="是否keepAlive缓存页面" v-model="form.meta.keepAlive">
              <el-option value="false" label="否" />
              <el-option value="true" label="是" />
            </el-select>
          </el-form-item>
          <el-form-item label="closeTab" prop="meta.closeTab" style="width:30%">
            <el-select placeholder="是否自动关闭tab" v-model="form.meta.closeTab">
              <el-option value="false" label="否" />
              <el-option value="true" label="是" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="warning">新增菜单需要在角色管理内配置权限才可使用</div>
        <div>
          <el-button size="small" type="primary" icon="el-icon-edit" @click="addParameter(form)">新增菜单参数</el-button>
          <el-table :data="form.parameters" stripe style="width: 100%">
            <el-table-column prop="type" label="参数类型" width="180">
              <template #default="scope">
                <el-select v-model="scope.row.type" placeholder="请选择">
                  <el-option key="query" value="query" label="query"></el-option>
                  <el-option key="params" value="params" label="params"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="key" label="参数key" width="180">
              <template #default="scope">
                <div>
                  <el-input v-model="scope.row.key"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="value" label="参数值">
              <template #default="scope">
                <div>
                  <el-input v-model="scope.row.value"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                <div>
                  <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteParameter(form.parameters,scope.$index)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
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

import {
  updateBaseMenu,
  getMenuList,
  addBaseMenu,
  deleteBaseMenu,
  getBaseMenuById
} from '@/api/menu'

import { infoList } from '@/mixins/infoList'

import icon from '@/view/superAdmin/menu/icon'

export default {
  name: 'Menus',
  components: {
    icon
  },
  setup () {
    const { ctx } = getCurrentInstance()

    const {
      tableInfo,
      handleSizeChange,
      handleCurrentChange,
      getTableData
    } = infoList(getMenuList)

    const checkFlag = ref(false)
    const dialogFormVisible = ref(false)
    const isEdit = ref(false)
    const dialogTitle = ref('新增菜单')
    const menuOption = reactive([
      {
        ID: '0',
        title: '根菜单'
      }
    ])
    const form = reactive({
      ID: 0,
      CreatedAt: undefined,
      UpdatedAt: undefined,
      path: '',
      name: '',
      hidden: '',
      parentId: '',
      component: '',
      meta: {
        title: '',
        icon: '',
        defaultMenu: false,
        keepAlive: 'false',
        closeTab: 'false'
      },
      parameters: []
    })
    const rules = reactive({
      path: [{ required: true, message: '请输入菜单name', trigger: 'blur' }],
      component: [
        { required: true, message: '请输入文件路径', trigger: 'blur' }
      ],
      'meta.title': [
        { required: true, message: '请输入菜单展示名称', trigger: 'blur' }
      ]
    })

    const addParameter = form => {
      if (!form.parameters) {
        form.parameters = []
      }
      form.parameters.push({
        type: 'query',
        key: '',
        value: ''
      })
    }

    const deleteParameter = (parameters, index) => {
      parameters.splice(index, 1)
    }
    const changeName = () => {
      form.path = form.name
    }
    const setOptions = () => {
      menuOption.length = 0
      menuOption.push({
        ID: '0',
        title: '根目录'
      })

      setMenuOptions(tableInfo.tableData, menuOption, false)
    }
    const setMenuOptions = (menuData, optionsData, disabled) => {
      menuData &&
      menuData.forEach(item => {
        if (item.children && item.children.length) {
          const option = {
            title: item.meta.title,
            ID: String(item.ID),
            disabled: disabled || item.ID === form.ID,
            children: []
          }
          setMenuOptions(
            item.children,
            option.children,
            disabled || item.ID === form.ID
          )
          optionsData.push(option)
        } else {
          const option = {
            title: item.meta.title,
            ID: String(item.ID),
            disabled: disabled || item.ID === form.ID
          }
          optionsData.push(option)
        }
      })
    }
    const handleClose = done => {
      initForm()
      done()
    }

    // 删除菜单
    const deleteMenu = ID => {
      ctx.$confirm('此操作将永久删除所有角色下该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await deleteBaseMenu({ ID })
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
    // 初始化弹窗内表格方法
    const initForm = () => {
      checkFlag.value = false
      ctx.$refs.menuForm.resetFields()
      Object.assign(form, {
        ID: 0,
        CreatedAt: undefined,
        UpdatedAt: undefined,
        path: '',
        name: '',
        hidden: '',
        parentId: '',
        component: '',
        meta: {
          title: '',
          icon: '',
          defaultMenu: false,
          keepAlive: 'false',
          closeTab: 'false'
        }
      })
    }
    // 关闭弹窗
    const closeDialog = () => {
      initForm()
      dialogFormVisible.value = false
    }
    // 添加menu
    const enterDialog = async () => {
      ctx.$refs.menuForm.validate(async valid => {
        if (valid) {
          let res
          if (isEdit.value) {
            res = await updateBaseMenu(form)
          } else {
            res = await addBaseMenu(form)
          }
          if (res.code === 0) {
            ctx.$message({
              type: 'success',
              message: isEdit.value ? '编辑成功' : '添加成功!'
            })
            await getTableData()
          }
          initForm()
          dialogFormVisible.value = false
        }
      })
    }
    // 添加菜单方法，id为 0则为添加根菜单
    const addMenu = id => {
      dialogTitle.value = '新增菜单'
      form.parentId = String(id)
      isEdit.value = false
      setOptions()
      dialogFormVisible.value = true
    }
    // 修改菜单方法
    const editMenu = async id => {
      dialogTitle.value = '编辑菜单'
      const res = await getBaseMenuById({ id })
      Object.assign(form, res.data.menu)
      isEdit.value = true
      setOptions()
      dialogFormVisible.value = true
    }

    tableInfo.pageSize = 999
    getTableData()
    return {
      tableInfo,
      handleSizeChange,
      handleCurrentChange,
      checkFlag,
      dialogFormVisible,
      dialogTitle,
      menuOption,
      form,
      rules,
      isEdit,
      deleteParameter,
      setMenuOptions,
      handleClose,
      deleteMenu,
      closeDialog,
      enterDialog,
      addMenu,
      editMenu,
      changeName,
      addParameter
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
.warning {
  color: #dc143c;
}
</style>
