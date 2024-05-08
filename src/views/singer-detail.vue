<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script>
  import createDetailComponent from '@/assets/js/create-detail-component'
  // 获取歌手页面数据接口
  import { getSingerDetail } from '@/service/singer'
  // 常量
  import { SINGER_KEY } from '@/assets/js/constant'

  export default createDetailComponent('singer-detail', SINGER_KEY, getSingerDetail)
</script>

<style lang="scss" scoped>
  .singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
