<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="userProfile.photo"
            @click="changeAvatar"
          />
          <!-- file 选择框 -->
          <input
            type="file"
            ref="iptFile"
            v-show="false"
            accept="image/*"
            @change="onFileChange"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="userProfile.name"
        @click="changeName"
      />
      <!-- 修改用户名称的对话框 -->
      <van-dialog
        v-model="isShowDialog"
        title="修改名称"
        show-cancel-button
        closeOnClickOverlay
        :before-close="beforeClose"
      >
        <!-- 输入框 -->
        <input v-model.trim="userName" v-focus placeholder="请输入名称" />
        <!-- <input v-focus v-model.trim="userName"> -->
      </van-dialog>
      <van-cell
        title="生日"
        is-link
        :value="userProfile.birthday"
        @click="changeBirth"
      />
      <van-popup
        v-model="isShowPopup"
        round
        position="bottom"
        :style="{ height: '50%' }"
      >
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="dateCancel"
          @confirm="dateConfirm"
      /></van-popup>
    </van-cell-group>
  </div>
</template>

<script>
import { getUserProfile, changeAvatar, changeUserProfile } from '@/api'
import { Notify } from 'vant'
import { formatDate } from '@/utils/date'

export default {
  name: 'UserEdit',
  data () {
    return {
      userProfile: [],
      isShowDialog: false,
      isShowPopup: false,
      userName: '',
      minDate: new Date(1920, 0, 1),
      maxDate: new Date(),
      currentDate: new Date('2022-10-16')
    }
  },
  async created () {
    const res = await getUserProfile()
    this.userProfile = res.data.data
  },
  methods: {
    async onFileChange (e) {
      // console.log(e.target.files[0])
      const newAvatar = new FormData()
      newAvatar.append('photo', e.target.files[0])
      const res = await changeAvatar(newAvatar)
      this.userProfile.photo = res.data.data.photo
      // console.log(res)
    },
    changeAvatar () {
      this.$refs.iptFile.click()
    },
    changeName () {
      this.isShowDialog = true
      this.userName = this.userProfile.name
    },
    async beforeClose (action, done) {
      if (action === 'confirm') {
        const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/
        if (reg.test(this.userName)) {
          await changeUserProfile({
            name: this.userName
          })
          this.userProfile.name = this.userName
          done()
        } else {
          Notify({ type: 'warning', message: '请输入1-7位的中英文数字组合！' })
          done(false)
        }
      } else {
        done()
      }
    },
    changeBirth () {
      this.isShowPopup = true
      this.currentDate = new Date(this.userProfile.birthday)
    },
    dateCancel () {
      this.isShowPopup = false
    },
    async dateConfirm () {
      await changeUserProfile({
        birthday: formatDate(this.currentDate)
      })
      this.userProfile.birthday = formatDate(this.currentDate)
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
/deep/ .van-dialog__content {
  text-align: center;
  input {
    border: none;
    text-align: center;
    margin: 7px;
    color: #323233;
    font-size: revert;
  }
}
</style>
