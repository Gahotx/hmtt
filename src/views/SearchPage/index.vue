s<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        v-focus
        v-model.trim="kw"
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        @input="inputFn"
        @search="searchFn"
      />
    </div>

    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length !== 0">
      <div
        class="sugg-item"
        v-for="(str, index) in suggestionsList"
        :key="index"
        v-html="highlightFn(str, kw)"
        @click="suggFn(str)"
      ></div>
    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="delHis"/>
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(str, index) in history"
          :key="index"
          @click="goHistory(str)"
        >
          {{ str }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getSuggestions } from '@/api'

export default {
  name: 'SearchPage',
  data () {
    return {
      kw: '', // 搜索关键字
      timer: null,
      suggestionsList: [],
      history: JSON.parse(localStorage.getItem('history')) || [] // 搜索历史
    }
  },
  methods: {
    // 搜索框输入内容时触发
    inputFn () {
      // 防抖
      clearTimeout(this.timer)
      if (this.kw.length === 0) {
        this.suggestionsList = []
      } else {
        this.timer = setTimeout(async () => {
          // console.log(this.kw)
          const res = await getSuggestions({
            prefix: this.kw
          })
          // console.log(res)
          if (res.data.data.options[0] === null) {
            this.suggestionsList = []
          } else {
            this.suggestionsList = res.data.data.options
          }
        }, 300)
      }
    },
    // 高亮关键字
    highlightFn (str, target) {
      if (this.suggestionsList.length !== 0) {
        const re = new RegExp(target, 'ig')
        return str.replace(re, `<span style="color:red">${target}</span>`)
      }
    },
    // 回车搜索
    searchFn () {
      if (this.kw.length !== 0) {
        this.history.push(this.kw)
        // Eventloop - 因为 watch 监听事件是异步的，如果跳转不异步，则在保存历史记录之前已经跳转出本页面
        setTimeout(() => {
          this.$router.push({
            path: `/search/${this.kw}`
          })
        }, 0)
      }
    },
    // 点击搜索历史
    goHistory (key) {
      this.$router.push({
        path: `/search/${key}`
      })
    },
    // 点击联想建议
    suggFn (str) {
      this.history.push(str)
      setTimeout(() => {
        this.$router.push({
          path: `/search/${str}`
        })
      }, 0)
    },
    // 清空搜索历史
    delHis () {
      this.history = []
    }
  },
  watch: {
    history: {
      deep: true,
      immediate: true,
      handler () {
        // ES6 新类型（Set, Map）
        // Set：无序不重复的结构
        const his = new Set(this.history)
        const newHis = [...his]
        localStorage.setItem('history', JSON.stringify(newHis))
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}
/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
