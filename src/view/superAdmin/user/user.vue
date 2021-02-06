<template>
  <div>
    <div class="button-box clearflex">
      <el-button @click="addUser" type="primary">新增用户</el-button>
    </div>
    <el-table :data="tableInfo.tableData" border stripe>
      <el-table-column label="头像" min-width="50">
        <template #default="scope">
          <div :style="{'textAlign':'center'}">
            <CustomPic :picSrc="scope.row.headerImg" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="uuid" min-width="250" prop="uuid"></el-table-column>
      <el-table-column label="用户名" min-width="150" prop="userName"></el-table-column>
      <el-table-column label="昵称" min-width="150" prop="nickName"></el-table-column>
      <el-table-column label="用户角色" min-width="150">
        <template #default="scope">
          <el-cascader
            @change="changeAuthority(scope.row)"
            v-model="scope.row.authority.authorityId"
            :options="authOptions"
            :show-all-levels="false"
            :props="{ checkStrictly: true,label:'authorityName',value:'authorityId',disabled:'disabled',emitPath:false}"
            filterable
          ></el-cascader>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150">
        <template #default="scope">
          <el-popover placement="top" width="160" v-model="scope.row.visible">
            <p>确定要删除此用户吗</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="deleteUserFun(scope.row)">确定</el-button>
            </div>
            <template #reference>
              <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
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

    <el-dialog :close-on-click-modal="false" v-model="addUserDialog" custom-class="user-dialog" title="新增用户">
      <el-form class="gva-dialog-body" :rules="rules" ref="userForm" :model="userInfo">
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px" prop="password">
          <el-input v-model="userInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="别名" label-width="80px" prop="nickName">
          <el-input v-model="userInfo.nickName"></el-input>
        </el-form-item>
        <el-form-item label="头像" label-width="80px">
          <div style="display:inline-block" @click="openHeaderChange">
            <img class="header-img-box" v-if="userInfo.headerImg" :src="userInfo.headerImg" />
            <div v-else class="header-img-box">从媒体库选择</div>
          </div>
        </el-form-item>
        <el-form-item label="用户角色" label-width="80px" prop="authorityId">
          <el-cascader
            v-model="userInfo.authorityId"
            @change="changeAuthority(userInfo)"
            :options="authOptions"
            :show-all-levels="false"
            :props="{ checkStrictly: true,label:'authorityName',value:'authorityId',disabled:'disabled',emitPath:false}"
            filterable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeAddUserDialog">取 消</el-button>
          <el-button @click="enterAddUserDialog" type="primary">确 定</el-button>
        </div>
      </template>
    </el-dialog>
<!--    <ChooseImg ref="chooseImg" :target="userInfo" :targetKey="`headerImg`" />-->
  </div>
</template>

<script>
import { ref, reactive, getCurrentInstance } from 'vue'

import {
  getUserList,
  setUserAuthority,
  register,
  deleteUser
} from '@/api/user'
import { getAuthorityList } from '@/api/authority'

import CustomPic from '@/components/customPic'
// import ChooseImg from '@/components/chooseImg'

import { infoList } from '@/mixins/infoList'

const path = process.env.VUE_APP_BASE_API

export default {
  name: 'Api',
  components: {
    CustomPic
    // ChooseImg
  },
  setup () {
    const { ctx } = getCurrentInstance()
    const {
      tableInfo,
      handleSizeChange,
      handleCurrentChange,
      getTableData
    } = infoList(getUserList)

    const authOptions = reactive([])
    const addUserDialog = ref(false)
    const userInfo = reactive({
      username: '',
      password: '',
      nickName: '',
      headerImg: '',
      authorityId: ''
    })
    const rules = reactive({
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 6, message: '最低6位字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入用户密码', trigger: 'blur' },
        { min: 6, message: '最低6位字符', trigger: 'blur' }
      ],
      nickName: [
        { required: true, message: '请输入用户昵称', trigger: 'blur' }
      ],
      authorityId: [
        { required: true, message: '请选择用户角色', trigger: 'blur' }
      ]
    })

    const openHeaderChange = () => {
      ctx.$refs.chooseImg.open()
    }

    const setOptions = authData => {
      authOptions.length = 0
      setAuthorityOptions(authData, authOptions)
    }
    const setAuthorityOptions = (AuthorityData, optionsData) => {
      AuthorityData &&
      AuthorityData.forEach(item => {
        if (item.children && item.children.length) {
          const option = {
            authorityId: item.authorityId,
            authorityName: item.authorityName,
            children: []
          }
          setAuthorityOptions(item.children, option.children)
          optionsData.push(option)
        } else {
          const option = {
            authorityId: item.authorityId,
            authorityName: item.authorityName
          }
          optionsData.push(option)
        }
      })
    }
    const deleteUserFun = async row => {
      const res = await deleteUser({ id: row.ID })
      if (res.code === 0) {
        await getTableData()
        row.visible = false
      }
    }
    const enterAddUserDialog = async () => {
      ctx.$refs.userForm.validate(async valid => {
        if (valid) {
          const res = await register(userInfo)
          if (res.code === 0) {
            ctx.$message({ type: 'success', message: '创建成功' })
          }
          await getTableData()
          closeAddUserDialog()
        }
      })
    }
    const closeAddUserDialog = () => {
      ctx.$refs.userForm.resetFields()
      addUserDialog.value = false
    }

    const addUser = () => {
      addUserDialog.value = true
    }
    const changeAuthority = async row => {
      if (!row || !row.authority) return

      const res = await setUserAuthority({
        uuid: row.uuid,
        authorityId: row.authority.authorityId || ''
      })
      if (res.code === 0) {
        ctx.$message({ type: 'success', message: '角色设置成功' })
      }
    }

    const instUser = async () => {
      await getTableData()
      const res = await getAuthorityList({ page: 1, pageSize: 999 })
      setOptions(res.data.list)
    }

    instUser()
    return {
      tableInfo,
      handleSizeChange,
      handleCurrentChange,
      path,
      authOptions,
      addUserDialog,
      userInfo,
      rules,
      changeAuthority,
      addUser,
      closeAddUserDialog,
      enterAddUserDialog,
      deleteUserFun,
      openHeaderChange
    }
  }
}
</script>
<style lang="scss">
.button-box {
  padding: 10px 20px;
  .el-button {
    float: right;
  }
}

.user-dialog {
  .header-img-box {
    width: 200px;
    height: 200px;
    border: 1px dashed #ccc;
    border-radius: 20px;
    text-align: center;
    line-height: 200px;
    cursor: pointer;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
