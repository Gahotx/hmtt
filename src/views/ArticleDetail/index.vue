<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back() || $router.replace('/')"
    />

    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ article.title }}</h1>

      <!-- 用户信息 -->
      <van-cell
        center
        :title="article.aut_name"
        :label="timeAgo(article.pubdate)"
      >
        <template #icon>
          <img
            :src="article.aut_photo"
            :alt="article.aut_name"
            class="avatar"
          />
        </template>
        <template #default>
          <div>
            <van-button
              type="info"
              size="mini"
              v-if="article.is_followed"
              @click="isFollowed(true)"
              >已关注</van-button
            >
            <van-button
              icon="plus"
              type="info"
              size="mini"
              plain
              v-else
              @click="isFollowed(false)"
              >关注</van-button
            >
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="article.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button
          icon="good-job"
          type="danger"
          size="small"
          v-if="article.attitude === 1"
          @click="isLiked(true)"
          >已点赞</van-button
        >
        <van-button
          icon="good-job-o"
          type="danger"
          plain
          size="small"
          v-else
          @click="isLiked(false)"
          >点赞</van-button
        >
      </div>

      <!-- 文章评论 -->
      <comment-list :collectType="article.is_collected" v-if="article.length !== 0"></comment-list>
    </div>
  </div>
</template>

<script>
import { getArticleDetail, followUser, unFollowUser, likeArticle, nolikeArticle } from '@/api'
import { timeAgo } from '@/utils/date'
import CommentList from './CommentList.vue'

export default {
  name: 'ArticleDetail',
  components: {
    CommentList
  },
  data () {
    return {
      article: []
    }
  },
  async created () {
    const res = await getArticleDetail({
      aid: this.$route.query.id
    })
    // console.log(res)
    this.article = res.data.data
  },
  methods: {
    timeAgo,
    async isFollowed (bool) {
      this.article.is_followed = !this.article.is_followed
      if (bool) {
        // 点击已关注 -> 取关
        await unFollowUser({
          uid: this.article.aut_id
        })
      } else {
        // 点击关注 -> 关注
        await followUser({
          uid: this.article.aut_id
        })
      }
    },
    async isLiked (bool) {
      if (bool) {
        // 点击已点赞 -> 取消点赞
        this.article.attitude = 0
        await nolikeArticle({
          aid: this.article.art_id
        })
      } else {
        // 点击点赞 -> 点赞
        this.article.attitude = 1
        await likeArticle({
          aid: this.article.art_id
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
</style>
