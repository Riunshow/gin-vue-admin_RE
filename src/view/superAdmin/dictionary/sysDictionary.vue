<template>
  <div>
    <div class="search-term">
      <el-form :inline="true" :model="tableInfo.searchInfo" class="demo-form-inline">
        <el-form-item label="字典名（中）">
          <el-input placeholder="搜索条件" v-model="tableInfo.searchInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="字典名（英）">
          <el-input placeholder="搜索条件" v-model="tableInfo.searchInfo.type"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="tableInfo.searchInfo.status" clear placeholder="请选择">
            <el-option key="true" label="是" value="true"></el-option>
            <el-option key="false" label="否" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input placeholder="搜索条件" v-model="tableInfo.searchInfo.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSubmit" type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="openDialog" type="primary">新增字典</el-button>
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

      <el-table-column label="字典名（中）" prop="name" width="120"></el-table-column>

      <el-table-column label="字典名（英）" prop="type" width="120"></el-table-column>

      <el-table-column label="状态" prop="status" width="120">
        <template #default="scope">{{formatBoolean(scope.row.status)}}</template>
      </el-table-column>

      <el-table-column label="描述" prop="desc" width="280"></el-table-column>

      <el-table-column label="按钮组">
        <template #default="scope">
          <el-button @click="toDetail(scope.row)" size="small" type="success">详情</el-button>
          <el-button @click="updateSysDictionaryFun(scope.row)" size="small" type="primary">变更</el-button>
          <el-popover placement="top" width="160" v-model="scope.row.visible">
            <p>确定要删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="deleteSysDictionaryFun(scope.row)">确定</el-button>
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
        <el-form-item label="字典名（中）" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入字典名（中）"
            clearable
            :style="{width: '100%'}"
          ></el-input>
        </el-form-item>
        <el-form-item label="字典名（英）" prop="type">
          <el-input
            v-model="formData.type"
            placeholder="请输入字典名（英）"
            clearable
            :style="{width: '100%'}"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" required>
          <el-switch v-model="formData.status" active-text="开启" inactive-text="停用"></el-switch>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="formData.desc" placeholder="请输入描述" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button @click="enterDialog" type="primary">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <div style="margin-top:40px;color:red">获取字典且缓存方法已在前端utils/dictionary 已经封装完成 不必自己书写 使用方法查看文件内注释</div>
  </div>
</template>

<script>
import { ref, reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

import {
  createSysDictionary,
  deleteSysDictionary,
  updateSysDictionary,
  findSysDictionary,
  getSysDictionaryList
} from '@/api/sysDictionary' //  此处请自行替换地址

import dayjs from 'dayjs'
import { infoList } from '@/mixins/infoList'

export default {
  name: 'SysDictionary',
  setup () {
    const router = useRouter()
    const { ctx } = getCurrentInstance()
    const {
      tableInfo,
      handleSizeChange,
      handleCurrentChange,
      getTableData
    } = infoList(getSysDictionaryList)
    const dialogFormVisible = ref(false)
    const visible = ref(false)
    const type = ref('')
    const formData = reactive({
      ID: 0,
      CreatedAt: undefined,
      UpdatedAt: undefined,
      name: null,
      type: null,
      status: true,
      desc: null
    })
    const rules = reactive({
      name: [
        {
          required: true,
          message: '请输入字典名（中）',
          trigger: 'blur'
        }
      ],
      type: [
        {
          required: true,
          message: '请输入字典名（英）',
          trigger: 'blur'
        }
      ],
      desc: [
        {
          required: true,
          message: '请输入描述',
          trigger: 'blur'
        }
      ]
    })

    const formatDate = time => {
      if (time != null && time !== '') {
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
    const toDetail = row => {
      router.push({
        name: 'dictionaryDetail',
        params: {
          id: row.ID
        }
      })
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
    const updateSysDictionaryFun = async row => {
      const res = await findSysDictionary({ ID: row.ID })
      type.value = 'update'
      if (res.code === 0) {
        Object.assign(formData, res.data.resysDictionary)
        dialogFormVisible.value = true
      }
    }
    const closeDialog = () => {
      dialogFormVisible.value = false
      Object.assign(formData, {
        ID: 0,
        CreatedAt: undefined,
        UpdatedAt: undefined,
        name: null,
        type: null,
        status: true,
        desc: null
      })
    }
    const deleteSysDictionaryFun = async row => {
      visible.value = false
      const res = await deleteSysDictionary({ ID: row.ID })
      if (res.code === 0) {
        ctx.$message({
          type: 'success',
          message: '删除成功'
        })
        await getTableData()
      }
    }
    const enterDialog = async () => {
      ctx.$refs.elForm.validate(async valid => {
        if (!valid) return
        let res
        switch (type.value) {
          case 'create':
            res = await createSysDictionary(formData)
            break
          case 'update':
            res = await updateSysDictionary(formData)
            break
          default:
            res = await createSysDictionary(formData)
            break
        }
        if (res.code === 0) {
          closeDialog()
          await getTableData()
        }
      })
    }
    const openDialog = () => {
      type.value = 'create'
      dialogFormVisible.value = true
    }

    getTableData()

    return {
      tableInfo,
      formatDate,
      formatBoolean,
      toDetail,
      handleCurrentChange,
      handleSizeChange,
      dialogFormVisible,
      formData,
      rules,
      closeDialog,
      enterDialog,
      openDialog,
      onSubmit,
      updateSysDictionaryFun,
      deleteSysDictionaryFun
    }
  }
}
</script>

<style>
</style>
