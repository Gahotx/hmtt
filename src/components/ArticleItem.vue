<template>
  <div>
    <!-- 一条文章单元格 -->
    <van-cell @click="goArticle(list.art_id)">
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ list.title }}</span>
          <!-- 一张封面 -->
          <img
            class="thumb"
            v-if="list.cover.type === 1"
            :src="list.cover.images"
            alt=""
          />
        </div>
        <!-- 多张封面 -->
        <div class="thumb-box" v-if="list.cover.type > 1">
          <img
            class="thumb"
            v-for="(item, index) in list.cover.images"
            :src="item"
            :key="index"
            alt=""
          />
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ list.aut_name }}</span>
            <span>{{ list.comm_count }} 评论</span>
            <span>{{ timeAgo(list.pubdate) }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click="show = true" v-if="isShow"/>
        </div>
      </template>
    </van-cell>

    <van-action-sheet
      v-model="show"
      :actions="actions"
      @select="onSelect"
      get-container="body"
      :cancel-text="bottomText"
      @cancel="onCancel"
      @close="onClose"
    />
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date'
import { options, spam } from '@/api/report'

export default {
  data () {
    return {
      show: false,
      actions: options,
      bottomText: '取消'
    }
  },
  props: {
    list: Object,
    isShow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    timeAgo,
    onSelect (actions) {
      if (actions.name === '反馈垃圾内容') {
        this.actions = spam
        this.bottomText = '返回'
      } else if (actions.name === '不感兴趣') {
        this.$emit('dislikeArt', this.list.art_id)
        this.show = false
      } else {
        this.$emit('reportArt', this.list.art_id, actions.value)
      }
    },
    onCancel () {
      if (this.bottomText === '返回') {
        this.actions = options
        this.show = true
        this.bottomText = '取消'
      }
    },
    onClose () {
      this.actions = options
      this.bottomText = '取消'
    },
    // 跳转至文章详情页
    goArticle (aid) {
      // console.log(aid)
      this.$router.push({
        path: '/article',
        query: {
          id: aid
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}

/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
