<template>
  <div class="music-list">
    <div
      class="back"
      @click="goBack"
    >
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <!-- :style="bgImageStyle" -->
    <div
      class="bg-image"
      :style="bgImageStyle"
      ref="bgImage"
    >
      <div
        class="play-btn-wrapper"
        :style="playBtnStyle"
      >
        <div
          v-show="songs.length > 0"
          class="play-btn"
          @click="random"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 模糊效果 -->
      <div
        class="filter"
        :style="filterStyle"
      ></div>
    </div>
    <!-- :style="scrollStyle" -->
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <!-- @select="selectItem"监听 -->
        <song-list
          :songs="songs"
          @select="selectItem"
          :rank="rank"
        ></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
  import SongList from '@/components/base/song-list/song-list'
  import Scroll from '@/components/wrap-scroll'
  /*
  这是一个Vue.js中的方法，用于在组件中映射Vuex store中的actions和state。
  mapState是一个辅助函数，它将组件的计算属性与store的状态映射。
  mapActions是另一个辅助函数，它将组件的methods与store的actions映射。
  使用这些方法可以使得代码更加简洁，并且能够很方便地访问和修改store中
  的状态和方法。
  */
  import { mapActions, mapState } from 'vuex'

  const RESERVED_HEIGHT = 40

  export default {
    name: 'music-list',
    components: {
      SongList,
      Scroll
    },
    props: {
      songs: {
        type: Array,
        default() {
          return []
        }
      },
      title: String,
      pic: String,
      loading: Boolean,
      noResultText: {
        type: String,
        default: '抱歉，没有找到可播放的歌曲'
      },
      rank: Boolean
    },
    data() {
      return {
        imageHeight: 0,
        scrollY: 0,
        maxTranslateY: 0
      }
    },
    computed: {
      noResult() {
        return !this.loading && !this.songs.length
      },
      playBtnStyle() {
        let display = ''
        if (this.scrollY >= this.maxTranslateY) {
          display = 'none'
        }
        return {
          display
        }
      },
      /*
      在 JavaScript 中，变量名中不能含有短横线（-），因为短横线是一个运算符。
      因此，当我们在将 CSS 样式属性转换成对应的 JavaScript 对象属性时，需要使用
      驼峰命名法来替换短横线。这就是为什么在上述代码中，"z-index" 样式属性被转换
      成了 "zIndex" JavaScript 对象属性的原因。
      */
     /*
     JavaScript 本身并不能自动识别和转换 CSS 样式属性，因为 CSS 和 JavaScript 是
     两种不同的语言，它们有各自不同的语法规则。
     如果您使用了一个库或框架，例如 React、Vue 或 Angular 等，这些库和框架中通常
     已经实现了将 CSS 样式属性自动转换成对应的 JavaScript 对象属性的功能。这样，
     您就可以在编写代码时直接使用 CSS 样式属性的名称，而无需手动将它们转换成驼峰
     命名法。
     */
      bgImageStyle() {
        // const scrollY = this.scrollY
        let zIndex = 0
        let paddingTop = '70%'
        let height = 0
        // 实现iPhone兼容问题，iPhone的一个坑
        let translateZ = 0

        if (scrollY > this.maxTranslateY) {
          zIndex = 10
          paddingTop = 0
          height = `${RESERVED_HEIGHT}px`
          translateZ = 1
        }

        let scale = 1
        if (scrollY < 0) {
          // Math.abs表示返回一个数的绝对值（即去掉它的符号）
          scale = 1 + Math.abs(scrollY / this.imageHeight)
        }

        return {
          zIndex,
          paddingTop,
          height,
          backgroundImage: `url(${this.pic})`,
          transform: `scale(${scale})translateZ(${translateZ}px)`
        }
      },
      scrollStyle() {
        const bottom = this.playlist.length ? '60px' : '0'
        return {
          // 设置top值
          top: `${this.imageHeight}px`,
          bottom
        }
      },
      // 模糊效果
      filterStyle() {
        let blur = 0
        const scrollY = this.scrollY
        const imageHeight = this.imageHeight
        if (scrollY >= 0) {
          blur = Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) * 20
        }
        return {
          backdropFilter: `blur(${blur}px)`
        }
      },
      ...mapState([
        'playlist'
      ])
    },
    mounted() {
      // 获取bgImage的dom
      // console.log(this.$refs.bgImage)
      this.imageHeight = this.$refs.bgImage.clientHeight
      // 可以滚动最大距离的高度
      this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      // 定义onscroll
      /*
      pos 可能是一个对象，其中包含两个属性：x 和 y，分别表示水平和垂直方向上的滚
      动距离。在函数体内部，通过获取 pos.y 来获取当前的垂直方向上的滚动距离，并将
      其赋值给了 this.scrollY 属性，同时在控制台上打印出 this.scrollY 的值。
      */
      onScroll(pos) {
        this.scrollY = -pos.y
        // console.log(this.scrollY)
      },
      selectItem({ song, index }) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      random() {
        this.randomPlay(this.songs)
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  .music-list {
    position: relative;
    height: 100%;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 20;
      transform: translateZ(2px);
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      width: 80%;
      z-index: 20;
      transform: translateZ(2px);
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-image {
      position: relative;
      width: 100%;
      transform-origin: top;
      background-size: cover;
      .play-btn-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 10;
        width: 100%;
        .play-btn {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0;
        }
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .list {
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 0;
      .song-list-wrapper {
        padding: 20px 30px;
        background: $color-background;
      }
    }
  }
</style>
