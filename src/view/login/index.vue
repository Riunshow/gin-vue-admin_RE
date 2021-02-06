<template>
  <div id="userLayout" class="user-layout-wrapper">
    <div class="container">
      <div class="top">
        <div class="desc">
          <img class="logo_login" src="@/assets/logo_login.png" alt=""/>
        </div>
        <div class="header">
          <a href="/">
            <span class="title">Gin-Vue-Admin</span>
          </a>
        </div>
      </div>
      <div class="main">
        <el-form :model="form" :rules="rules" ref="loginForm" @keyup.enter="submitForm">
          <el-form-item prop="username">
            <el-input placeholder="请输入用户名" v-model="form.username">
              <template #suffix>
                <i class="el-input__icon el-icon-user"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" :type="lock === 'lock' ? 'password' : 'text'" placeholder="请输入密码">
              <template #suffix>
                <i :class="'el-input__icon el-icon-' + lock" @click="changeLock"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item style="position: relative">
            <el-input v-model="form.captcha" placeholder="请输入验证码" style="width: 60%"/>
            <div class="vPic">
              <img v-if="picPath" :src="picPath" alt="请输入验证码" @click="getCaptcha"/>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm" style="width: 100%">登 录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive, ref, unref, onBeforeMount } from 'vue'
import { useStore } from 'vuex'

import { captcha } from '@/api/base'
import { useMessage } from '@/hooks/useMessage'

const checkUsername = (rule: any, value: any, callback: any) => {
  if (value.length < 5 || value.length > 12) {
    return callback(new Error('请输入正确的用户名'))
  } else {
    callback()
  }
}
const checkPassword = (rule: any, value: any, callback: any) => {
  if (value.length < 6 || value.length > 12) {
    return callback(new Error('请输入正确的密码'))
  } else {
    callback()
  }
}

export default defineComponent({
  name: 'Login',
  setup () {
    const Message = useMessage()
    const store = useStore()

    const state = reactive({
      lock: 'lock',
      picPath: '',
      form: {
        username: 'admin',
        password: '123456',
        captcha: '',
        captchaId: ''
      },
      loading: false
    })

    const loginForm = ref<null | HTMLFormElement>(null)

    const rules = reactive({
      username: [{ validator: checkUsername, trigger: 'blur' }],
      password: [{ validator: checkPassword, trigger: 'blur' }]
    })

    // ---- method
    const getCaptcha = async () => {
      const res = await captcha()

      const { picPath, captchaId } = res.data

      state.picPath = picPath
      state.form.captchaId = captchaId
    }

    // 显示隐藏密码
    const changeLock = () => {
      state.lock = state.lock === 'lock' ? 'unlock' : 'lock'
    }
    // 点击提交
    const submitForm = async () => {
      const formRef = unref(loginForm)
      if (!formRef) return

      formRef.validate(async (valid: boolean) => {
        if (!valid) return

        state.loading = true

        const res = await store.dispatch('user/login', { ...state.form })

        if (!res) {
          Message.error('请正确填写登录信息')
          await getCaptcha()
        }

        state.loading = false
      })
    }

    // ----- lifecycle
    onBeforeMount(async () => {
      await getCaptcha()
    })

    return {
      ...toRefs(state),
      loginForm,
      rules,
      getCaptcha,
      changeLock,
      submitForm
    }
  }
})
</script>

<style scoped lang="scss">
@import "~@/style/login.scss";
</style>
