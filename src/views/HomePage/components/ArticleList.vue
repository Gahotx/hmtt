<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <article-item
          v-for="obj in articleList"
          :key="obj.art_id"
          :list="obj"
          @dislikeArt="dislikeFn"
          @reportArt="reportFn"
        ></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '@/components/ArticleItem.vue'
import { getArticlesList, dislikeArticle, reportArticle } from '@/api'
import { Notify } from 'vant'

export default {
  props: {
    activeId: Number
  },
  data () {
    return {
      articleList: [],
      loading: false,
      finished: false,
      theTime: new Date().getTime(),
      isLoading: false
    }
  },
  components: {
    ArticleItem
  },
  async created () {
    // 获取文章列表
    this.getArticlesListFn()
  },
  methods: {
    // 发送请求专用
    async getArticlesListFn () {
      const res = await getArticlesList({
        channelId: this.activeId,
        timestamp: this.theTime
      })
      this.articleList = [...this.articleList, ...res.data.data.results]
      this.theTime = res.data.data.pre_timestamp

      // 数据全部加载完成
      if (res.data.data.results.pre_timestamp === null) {
        this.finished = true
        return true
      }

      // 加载状态结束
      this.loading = false

      // 加载状态结束
      this.isLoading = false
    },
    // 上拉加载更多
    onLoad () {
      if (this.articleList.length > 0) {
        this.getArticlesListFn()
      } else {
        this.loading = false
      }
    },
    // 下拉刷新
    onRefresh () {
      // 重置数组
      this.articleList = []
      this.theTime = new Date().getTime()

      this.getArticlesListFn()
    },
    // 不喜欢文章
    async dislikeFn (aid) {
      try {
        await dislikeArticle({
          articleId: aid
        })
        Notify({ type: 'success', message: '反馈成功' })
      } catch (err) {
        Notify({ type: 'danger', message: '反馈失败，请重新登录' })
      }
    },
    // 举报文章
    async reportFn (aid, val) {
      try {
        await reportArticle({
          articleId: aid,
          type: val
        })
        Notify({ type: 'success', message: '举报成功' })
      } catch (err) {
        Notify({ type: 'danger', message: '举报失败，请重新登录' })
      }
    }
  }
}
</script>

<style>
</style>
