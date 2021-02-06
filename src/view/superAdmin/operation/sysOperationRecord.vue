<template>
  <div>
    <div class="search-term">
      <el-form :inline="true" :model="tableInfo.searchInfo" class="demo-form-inline">
        <el-form-item label="请求方法">
          <el-input placeholder="搜索条件" v-model="tableInfo.searchInfo.method"></el-input>
        </el-form-item>
        <el-form-item label="请求路径">
          <el-input placeholder="搜索条件" v-model="tableInfo.searchInfo.path"></el-input>
        </el-form-item>
        <el-form-item label="结果状态码">
          <el-input placeholder="搜索条件" v-model="tableInfo.searchInfo.status"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSubmit" type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-popover placement="top" v-model="deleteVisible" width="160">
            <p>确定要删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button @click="deleteVisible = false" size="mini" type="text">取消</el-button>
              <el-button @click="onDelete" size="mini" type="primary">确定</el-button>
            </div>
            <template #reference>
              <el-button icon="el-icon-delete" size="mini" type="danger">批量删除</el-button>
            </template>
          </el-popover>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableInfo.tableData"
      @selection-change="handleSelectionChange"
      border
      ref="multipleTable"
      stripe
      style="width: 100%"
      tooltip-effect="dark"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="操作人" width="140">
        <template #default="scope">
          <div>{{ scope.row.user.userName }}({{ scope.row.user.nickName }})</div>
        </template>
      </el-table-column>
      <el-table-column label="日期" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.CreatedAt) }}
        </template>
      </el-table-column>
      <el-table-column label="状态码" prop="status" width="120">
        <template #default="scope">
          <div>
            <el-tag type="success">{{ scope.row.status }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="请求ip" prop="ip" width="120"></el-table-column>
      <el-table-column label="请求方法" prop="method" width="120"></el-table-column>
      <el-table-column label="请求路径" prop="path" width="240"></el-table-column>
      <el-table-column label="请求" prop="path" width="80">
        <template #default="scope">
          <div>
            <el-popover placement="top-start" trigger="hover" v-if="scope.row.body">
              <div class="popover-box">
                <pre>{{ fmtBody(scope.row.body) }}</pre>
              </div>
              <template #reference>
                <i class="el-icon-view"></i>
              </template>
            </el-popover>
            <span v-else>无</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="响应" prop="path" width="80">
        <template #default="scope">
          <div>
            <el-popover placement="top-start" trigger="hover" v-if="scope.row.resp">
              <div class="popover-box">
                <pre>{{ fmtBody(scope.row.resp) }}</pre>
              </div>
              <template #reference>
                <i class="el-icon-view"></i>
              </template>
            </el-popover>
            <span v-else>无</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="按钮组">
        <template #default="scope">
          <el-popover placement="top" v-model="scope.row.visible" width="160">
            <p>确定要删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button @click="scope.row.visible = false" size="mini" type="text">取消</el-button>
              <el-button @click="deleteSysOperationRecordFun(scope.row)" size="mini" type="primary">确定</el-button>
            </div>
            <template #reference>
              <el-button icon="el-icon-delete" size="mini" type="danger">删除</el-button>
            </template>
          </el-popover>
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
    ></el-pagination>
  </div>
</template>

<script>
import { ref, reactive, getCurrentInstance } from 'vue'

import {
  deleteSysOperationRecord,
  getSysOperationRecordList,
  deleteSysOperationRecordByIds
} from '@/api/sysOperationRecord' //  此处请自行替换地址

import { infoList } from '@/mixins/infoList'

import dayjs from 'dayjs'

export default {
  name: 'SysOperationRecord',
  setup () {
    const { ctx } = getCurrentInstance()
    const {
      tableInfo,
      handleSizeChange,
      handleCurrentChange,
      getTableData
    } = infoList(getSysOperationRecordList)

    const visible = ref(false)
    const dialogFormVisible = ref(false)
    const type = ref('')
    const deleteVisible = ref(false)
    const multipleSelection = reactive([])
    const formData = reactive({
      ID: 0,
      CreatedAt: undefined,
      UpdatedAt: undefined,
      ip: '',
      method: '',
      path: '',
      status: '',
      latency: '',
      agent: '',
      error_message: '',
      user_id: ''
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

    // 条件搜索前端看此方法
    const onSubmit = () => {
      tableInfo.page = 1
      tableInfo.pageSize = 10
      getTableData()
    }

    const handleSelectionChange = val => {
      multipleSelection.length = 0
      Object.assign(multipleSelection, val)
    }

    const onDelete = async () => {
      const ids = []
      multipleSelection &&
      multipleSelection.forEach(item => {
        ids.push(item.ID)
      })
      const res = await deleteSysOperationRecordByIds({ ids })
      if (res.code === 0) {
        ctx.$message({
          type: 'success',
          message: '删除成功'
        })
        deleteVisible.value = false
        await getTableData()
      }
    }
    const deleteSysOperationRecordFun = async row => {
      visible.value = false
      const res = await deleteSysOperationRecord({ ID: row.ID })
      if (res.code === 0) {
        ctx.$message({
          type: 'success',
          message: '删除成功'
        })
        await getTableData()
      }
    }
    const fmtBody = value => {
      try {
        return JSON.parse(value)
      } catch (err) {
        return value
      }
    }
    getTableData()
    return {
      tableInfo,
      handleSizeChange,
      handleCurrentChange,
      visible,
      dialogFormVisible,
      type,
      deleteVisible,
      multipleSelection,
      formData,
      formatDate,
      formatBoolean,
      onSubmit,
      handleSelectionChange,
      onDelete,
      deleteSysOperationRecordFun,
      fmtBody
    }
  }
}
</script>

<style lang="scss">
.table-expand {
  padding-left: 60px;
  font-size: 0;
  label {
    width: 90px;
    color: #99a9bf;
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }
}
.popover-box {
  background: #112435;
  color: #f08047;
  height: 600px;
  width: 420px;
  overflow: auto;
}
.popover-box::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
