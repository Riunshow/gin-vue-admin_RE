<template>
  <div>
    <div class="search-term">
      <el-form :inline="true" :model="tableInfo.searchInfo" class="demo-form-inline">
        <el-form-item label="展示值">
          <el-input placeholder="搜索条件" v-model="tableInfo.searchInfo.label"></el-input>
        </el-form-item>
        <el-form-item label="字典值">
          <el-input placeholder="搜索条件" v-model="tableInfo.searchInfo.value"></el-input>
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-select v-model="tableInfo.searchInfo.status" placeholder="请选择">
            <el-option key="true" label="是" value="true"></el-option>
            <el-option key="false" label="否" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSubmit" type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="openDialog" type="primary">新增字典项</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableInfo.tableData"
      border
      ref="multipleTable"
      stripe
      style="width: 100%"
      tooltip-effect="dark"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="日期" width="180">
        <template #default="scope">{{formatDate(scope.row.CreatedAt)}}</template>
      </el-table-column>

      <el-table-column label="展示值" prop="label" width="120"></el-table-column>

      <el-table-column label="字典值" prop="value" width="120"></el-table-column>

      <el-table-column label="启用状态" prop="status" width="120">
        <template #default="scope">{{formatBoolean(scope.row.status)}}</template>
      </el-table-column>

      <el-table-column label="排序标记" prop="sort" width="120"></el-table-column>

      <el-table-column label="按钮组">
        <template #default="scope">
          <el-button @click="updateSysDictionaryDetailFun(scope.row)" size="small" type="primary">变更</el-button>
          <el-popover placement="top" width="160" v-model="scope.row.visible">
            <p>确定要删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="deleteSysDictionaryDetailFun(scope.row)">确定</el-button>
            </div>
            <template #reference>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="tableInfo.page"
      :page-size="tableInfo.pageSize"
      :page-sizes="[10, 30, 50, 100]"
      :style="{float:'right',padding:'20px'}"
      :total="tableInfo.total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>

    <el-dialog :close-on-click-modal="false" :before-close="closeDialog" v-model="dialogFormVisible" title="弹窗操作">
      <el-form class="gva-dialog-body" ref="elForm" :model="formData" :rules="rules" size="medium" label-width="110px">
        <el-form-item label="展示值" prop="label">
          <el-input
            v-model="formData.label"
            placeholder="请输入展示值"
            clearable
            :style="{width: '100%'}"
          ></el-input>
        </el-form-item>
        <el-form-item label="字典值" prop="value">
          <el-input-number
            v-model="formData.value"
            step-strictly
            :step="1"
            placeholder="请输入字典值"
            clearable
            :style="{width: '100%'}"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="启用状态" prop="status" required>
          <el-switch v-model="formData.status" active-text="开启" inactive-text="停用"></el-switch>
        </el-form-item>
        <el-form-item label="排序标记" prop="sort">
          <el-input-number v-model="formData.sort" placeholder="排序标记"></el-input-number>
        </el-form-item>
      </el-form>
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
import { useRoute } from 'vue-router'

import {
  createSysDictionaryDetail,
  deleteSysDictionaryDetail,
  updateSysDictionaryDetail,
  findSysDictionaryDetail,
  getSysDictionaryDetailList
} from '@/api/sysDictionaryDetail' //  此处请自行替换地址

import dayjs from 'dayjs'

import { infoList } from '@/mixins/infoList'

export default {
  name: 'SysDictionaryDetail',
  setup () {
    const route = useRoute()
    const { ctx } = getCurrentInstance()
    const {
      tableInfo,
      handleSizeChange,
      handleCurrentChange,
      getTableData
    } = infoList(getSysDictionaryDetailList)

    const dialogFormVisible = ref(false)
    const visible = ref(false)
    const type = ref('')
    const formData = reactive({
      ID: 0,
      CreatedAt: undefined,
      UpdatedAt: undefined,
      label: '',
      value: 0,
      status: true,
      sort: 0
    })
    const rules = reactive({
      label: [
        {
          required: true,
          message: '请输入展示值',
          trigger: 'blur'
        }
      ],
      value: [
        {
          required: true,
          message: '请输入字典值',
          trigger: 'blur'
        }
      ],
      sort: [
        {
          required: true,
          message: '排序标记',
          trigger: 'blur'
        }
      ]
    })
    const formatDate = time => {
      if (time != null && time !== '') {
        // const date = new Date(time)
        // return formatTimeToStr(date, 'yyyy-MM-dd hh:mm:ss')
        return dayjs(time).format('YYYY-MM-DD hh:mm:ss')
      } else {
        return ''
      }
    }
    const formatBoolean = bool => {
      if (bool != null) {
        return bool ? '是' : '否'
      } else {
        return ''
      }
    }

    // 条件搜索前端看此方法
    const onSubmit = () => {
      tableInfo.page = 1
      tableInfo.pageSize = 10
      if (tableInfo.searchInfo.status === '') {
        tableInfo.searchInfo.status = null
      }
      getTableData()
    }
    const updateSysDictionaryDetailFun = async (row) => {
      const res = await findSysDictionaryDetail({ ID: row.ID })
      type.value = 'update'
      if (res.code === 0) {
        Object.assign(formData, res.data.resysDictionaryDetail)
        dialogFormVisible.value = true
      }
    }
    const closeDialog = () => {
      dialogFormVisible.value = false
      Object.assign(formData, {
        ID: 0,
        CreatedAt: undefined,
        UpdatedAt: undefined,
        label: '',
        value: 0,
        status: true,
        sort: 0,
        sysDictionaryID: ''
      })
    }
    const deleteSysDictionaryDetailFun = async (row) => {
      visible.value = false
      const res = await deleteSysDictionaryDetail({ ID: row.ID })
      if (res.code === 0) {
        ctx.$message({
          type: 'success',
          message: '删除成功'
        })
        await getTableData()
      }
    }
    const enterDialog = async () => {
      formData.sysDictionaryID = Number(route.params.id)
      ctx.$refs.elForm.validate(async valid => {
        if (!valid) return
        let res
        switch (type.value) {
          case 'create':
            res = await createSysDictionaryDetail(formData)
            break
          case 'update':
            res = await updateSysDictionaryDetail(formData)
            break
          default:
            res = await createSysDictionaryDetail(formData)
            break
        }
        if (res.code === 0) {
          ctx.$message({
            type: 'success',
            message: '创建/更改成功'
          })
          closeDialog()
          await getTableData()
        }
      })
    }
    const openDialog = () => {
      type.value = 'create'
      dialogFormVisible.value = true
    }

    tableInfo.searchInfo.sysDictionaryID = route.params.id
    getTableData()

    return {
      onSubmit,
      openDialog,
      tableInfo,
      handleCurrentChange,
      handleSizeChange,
      dialogFormVisible,
      rules,
      formData,
      closeDialog,
      enterDialog,
      formatDate,
      formatBoolean,
      updateSysDictionaryDetailFun,
      deleteSysDictionaryDetailFun
    }
  }

}
</script>

<style>
</style>
