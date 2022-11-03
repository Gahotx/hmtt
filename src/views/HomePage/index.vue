<template>
  <div>
    <!-- 顶部导航栏 -->
    <van-nav-bar fixed>
      <template #left>
        <img class="logo" src="@/assets/logo.png" alt="" />
      </template>
      <template #right>
        <van-icon @click="goSearch" name="search" size="0.48rem" color="#fff" />
      </template>
    </van-nav-bar>

    <!-- 顶部标签栏 -->
    <van-tabs
      v-model="active"
      @change="channelChangeFn"
      class="tabs"
      animated
      sticky
      offset-top="1.226667rem"
      color="#007bff"
    >
      <van-tab
        v-for="obj in userChannelsList"
        :title="obj.name"
        :key="obj.id"
        :name="obj.id"
      >
        <article-list :activeId="active"></article-list>
      </van-tab>
    </van-tabs>

    <!-- 编辑频道图标 -->
    <van-icon
      @click="showPopup"
      name="plus"
      size="0.37333334rem"
      class="moreChannels"
    />

    <!-- 频道管理弹出层 -->
    <van-popup class="popup" v-model="show" get-container="body">
      <channel-edit
        :userList="userChannelsList"
        :otherList="otherChannelsList"
        @addChannelEV="addChannelFn"
        @removeChannelEV="removeChannelFn"
        @closeEV="closeEdit"
        @goChannelEV="goChannelFn"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import {
  getUserChannels,
  getAllChannels,
  updateUserChannels,
  deleteTheChannel
} from '@/api'
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './components/ChannelEdit.vue'

export default {
  name: 'HomePage',
  data () {
    return {
      active: 0, // 频道 ID
      userChannelsList: [],
      allChannelsList: [],
      show: false,
      channelScroll: {} // 每个频道的滚动条位置
    }
  },
  async created () {
    // 获取用户频道
    const res = await getUserChannels()
    this.userChannelsList = res.data.data.channels
    // console.log(res)

    // 获取所有频道
    const res2 = await getAllChannels()
    this.allChannelsList = res2.data.data.channels
    // console.log(res2)
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  methods: {
    // 点击加号显示频道管理面板
    showPopup () {
      this.show = true
    },
    // 频道管理-添加频道
    async addChannelFn (otherChannel) {
      this.userChannelsList.push(otherChannel)
      await updateUserChannels({
        channels: this.userChannelsList
      })
    },
    // 频道管理-删除频道
    async removeChannelFn (channel) {
      const index = this.userChannelsList.findIndex(
        (obj) => obj.id === channel.id
      )
      this.userChannelsList.splice(index, 1)
      await deleteTheChannel({
        channelId: channel.id
      })
    },
    // 关闭频道管理面板
    closeEdit () {
      this.show = false
    },
    // 频道管理-进入频道
    goChannelFn (channel) {
      this.active = channel.id
    },
    // 进入搜索页面
    goSearch () {
      this.$router.push('/search')
    },
    // 记录各频道的滚动条位置
    scrollFn () {
      this.channelScroll[this.active] = document.documentElement.scrollTop
    },
    // 切换频道时还原滚动条高度
    channelChangeFn () {
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.channelScroll[this.active]
      })
    }
  },
  computed: {
    otherChannelsList () {
      const newArr = this.allChannelsList.filter((bigObj) => {
        const index = this.userChannelsList.findIndex((smallObj) => {
          return smallObj.id === bigObj.id
        })

        if (index > -1) {
          return false
        } else {
          return true
        }
      })

      return newArr
    }
  },
  activated () {
    document.addEventListener('scroll', this.scrollFn)
    // 切换页面时还原滚动条高度
    document.documentElement.scrollTop = this.channelScroll[this.active]
  },
  deactivated () {
    document.removeEventListener('scroll', this.scrollFn)
  }
}
</script>

<style scoped lang="less">
.logo {
  width: 100px;
  height: 30px;
}
.tabs {
  padding-top: 46px;
}
// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
.popup {
  width: 100vw;
  height: 100vh;
}
</style>
