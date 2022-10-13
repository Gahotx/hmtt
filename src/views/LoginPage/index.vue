<template>
  <div>
    <van-nav-bar title="黑马头条 - 登录" />
    <van-form @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        required
        name="mobile"
        label="手机号"
        placeholder="请输入手机号"
        :rules="[
          {
            required: true,
            message: '手机号格式错误',
            pattern: /^1[3-9]\d{9}$/
          }
        ]"
      />
      <van-field
        v-model="user.code"
        required
        name="code"
        label="验证码"
        placeholder="请输入验证码"
        :rules="[{ required: true, message: '验证码错误', pattern: /\d{6}/ }]"
      />
      <div style="margin: 16px">
        <van-button
          :loading="isLoading"
          :disabled="isLoading"
          loading-text="正在登录..."
          round
          block
          type="info"
          native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { userLogin } from '@/api'
import { Notify } from 'vant'
import { setToken } from '@/utils/token'

export default {
  name: 'LoginPage',
  data () {
    return {
      user: {
        mobile: '13912345678',
        code: '246810'
      },
      isLoading: false
    }
  },
  methods: {
    async onSubmit (values) {
      console.log('submit', values)
      this.isLoading = true
      try {
        const res = await userLogin(this.user)
        console.log(res)
        setToken(res.data.data.token)
        Notify({ type: 'success', message: '登录成功' })
        this.$router.replace({
          path: '/layout/home'
        })
      } catch (err) {
        Notify({ type: 'danger', message: '账号或密码错误' })
      }
      this.isLoading = false
    }
  }
}
</script>

<style>
</style>
