<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar
        title="搜索结果"
        left-arrow
        @click-left="$router.go(-1)"
        fixed
      />
    </div>
    <!-- 文章列表 -->
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
        :isShow="false"
      ></article-item>
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api'
import ArticleItem from '@/components/ArticleItem.vue'

export default {
  name: 'SearchResult',
  components: {
    ArticleItem
  },
  data () {
    return {
      page: 1,
      articleList: [],
      loading: false,
      finished: false
    }
  },
  async created () {
    // 获取搜索结果
    const res = await getSearchResult({
      page: this.page,
      q: this.$route.params.keywords
    })
    // console.log(res)
    this.articleList = res.data.data.results
  },
  methods: {
    async onLoad () {
      if (this.articleList.length > 0) {
        this.page++
        const res = await getSearchResult({
          page: this.page,
          q: this.$route.params.keywords
        })
        // console.log(res)
        this.articleList = [...this.articleList, ...res.data.data.results]

        // 没有更多的结果了
        if (res.data.data.results.length === 0) {
          this.finished = true
          return true
        }

        this.loading = false
      } else {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
