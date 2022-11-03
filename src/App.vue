<template>
  <div>
    <keep-alive :exclude="['SearchPage', 'ArticleDetail', 'Login', 'SearchResult', 'ChatBot']">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {}
</script>

<style>
</style>
