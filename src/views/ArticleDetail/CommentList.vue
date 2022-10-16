<template>
  <div>
    <!-- 评论列表 -->
    <div
      class="cmt-list"
      :class="{
        'art-cmt-container-1': isInput,
        'art-cmt-container-2': !isInput
      }"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="obj in comments" :key="obj.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo" :alt="obj.aut_name" class="avatar" />
              <span class="uname">{{ obj.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="16"
                color="red"
                v-if="obj.is_liking"
                @click="likeComment(true, obj)"
              />
              <van-icon
                name="like-o"
                size="16"
                color="gray"
                v-else
                @click="likeComment(false, obj)"
              />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{ obj.content }}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ timeAgo(obj.pubdate) }}</div>
        </div>
      </van-list>
    </div>

    <!-- 底部添加评论区域 - 1 -->
    <div class="add-cmt-box van-hairline--top" v-if="isInput">
      <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
      <div class="ipt-cmt-div" @click="inputFn">发表评论</div>
      <div class="icon-box">
        <van-badge :content="count === 0 ? '' : count" max="99">
          <van-icon
            name="comment-o"
            size="0.53333334rem"
            @click="goToComment"
          />
        </van-badge>
        <van-icon
          :name="starLogo"
          :color="starColor"
          size="0.53333334rem"
          @click="starFn"
        />
        <van-icon name="share-o" size="0.53333334rem" />
      </div>
    </div>

    <!-- 底部添加评论区域 - 2 -->
    <div class="cmt-box van-hairline--top" v-else>
      <textarea
        placeholder="友善评论、理性发言、阳光心灵"
        v-focus
        @blur="blurText"
        v-model.trim="comText"
      ></textarea>
      <van-button
        type="default"
        :disabled="comText.length === 0"
        @click="sendComment"
        >发布</van-button
      >
    </div>
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date'
import {
  getComments,
  likeComment,
  dislikeComment,
  sendComment,
  starArticle,
  unStarArticle
} from '@/api'

export default {
  props: {
    collectType: Boolean
  },
  data () {
    return {
      comments: [],
      isInput: true,
      count: 0,
      comText: '',
      loading: false,
      finished: false,
      lastId: null,
      starLogo: 'star-o',
      starColor: '',
      isStar: this.collectType
    }
  },
  async created () {
    // 判断文章是否收藏
    if (this.isStar) {
      this.starLogo = 'star'
      this.starColor = '#FDD13A'
    }

    const res = await getComments({
      aid: this.$route.query.id
    })
    this.comments = res.data.data.results
    this.count = res.data.data.total_count
    this.lastId = res.data.data.last_id

    if (this.comments.length === 0) {
      this.finished = true
    }
  },
  methods: {
    timeAgo,
    async likeComment (bool, commentObj) {
      commentObj.is_liking = !commentObj.is_liking
      if (bool) {
        // 点击已点赞 -> 取消点赞
        await dislikeComment({
          cid: commentObj.com_id
        })
      } else {
        // 点击点赞 -> 点赞
        await likeComment({
          cid: commentObj.com_id
        })
      }
    },
    // 点击发表评论
    inputFn () {
      this.isInput = false
    },
    // 前往评论区
    goToComment () {
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    // 评论框失去焦点
    blurText () {
      setTimeout(() => {
        this.comText = ''
        this.isInput = true
      }, 0)
    },
    // 点击发送评论
    async sendComment () {
      // console.log(this.comText)
      const res = await sendComment({
        id: this.$route.query.id,
        content: this.comText
      })
      // console.log(res)
      this.comments.unshift(res.data.data.new_obj)
      this.count++
      this.goToComment()
    },
    // 加载更多评论
    async onLoad () {
      if (this.comments.length > 0) {
        const res = await getComments({
          aid: this.$route.query.id,
          offset: this.lastId
        })
        this.comments = [...this.comments, ...res.data.data.results]
        this.lastId = res.data.data.last_id

        // 没有更多评论了
        if (this.lastId === null) {
          this.finished = true
        }
        this.loading = false
      } else {
        this.loading = false
      }
    },
    // 收藏文章
    async starFn () {
      if (!this.isStar) {
        // 点击时未收藏 -> 收藏
        this.isStar = true
        this.starLogo = 'star'
        this.starColor = '#FDD13A'
        await starArticle({
          aid: this.$route.query.id
        })
      } else {
        // 点击时已收藏 -> 取消收藏
        this.isStar = false
        this.starLogo = 'star-o'
        this.starColor = ''
        await unStarArticle({
          aid: this.$route.query.id
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}

/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
