<template>
  <!-- :[loadingText]动态参数 -->
  <!-- v-loading:[loadingText]="loading" -->
  <!--
"v-loading"是Vue.js框架中的一个自定义指令，用于在需要等待数据或操作完成时显示加载中状态。
它可以绑定到页面元素上，并根据一个布尔值来控制该元素的加载状态。
具体来说，当v-loading="loading"被绑定到一个元素上时，该元素会在loading为真（true）时显示加载中状态，
加载中状态可以是任何自定义样式或组件。当loading为假（false）时，加载中状态则会消失。
这个指令非常适用于异步请求数据、表单提交等需要等待的场景，可以给用户更好的交互体验并提高程序的可读性和可维护性。
   -->
  <div class="recommend" v-loading="loading">
    <scroll class="recommend-content">
      <!-- betterscroll只针对第一个子节点生效，所以要加一个div包裹 -->
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <!-- slider组件 -->
            <slider v-if="sliders.length" :sliders="sliders"></slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
          <ul>
            <li
              v-for="item in albums"
              class="item"
              :key="item.id"
              @click="selectItem(item)"
            >
              <div class="icon">
                <!--将:src="item.pic"转换成 v-lazy="item.pic"实现图片懒加载效果 -->
                <img width="60" height="60" v-lazy="item.pic">
              </div>
              <div class="text">
                <h2 class="name">
                  {{ item.username }}
                </h2>
                <p class="title">
                  {{item.title}}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedAlbum"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
// 获取recommend页面接口数据
  import { getRecommend } from '@/service/recommend'
  import Slider from '@/components/base/slider/slider'
  import Scroll from '@/components/wrap-scroll'
  /*
  good-storage 是一个基于 HTML5 Web Storage（即 localStorage 和
  sessionStorage）实现的轻量级本地存储库。它提供了简单易用的 API，
  使得开发者可以更加方便地进行本地存储操作，如存储数据、读取数据、删除数据等。
  */
  import storage from 'good-storage'
  // 常量
  import { ALBUM_KEY } from '@/assets/js/constant'
  export default {
    name: 'recommend',
    components: {
      Slider,
      Scroll
    },
    data() {
      return {
        sliders: [],
        // albums指的是recommend的list数组
        albums: [],
        selectedAlbum: null
      }
    },
    /* computed又被称作计算属性，用于动态的根据某个值或某些值的变化，来产生对应的变化，
    computed具有缓存性，当无关值变化时，不会引起computed声明值的变
    化。产生一个新的变量并挂载到vue实例上去。 */
    /* 这个计算属性用于检查组件中的两个数组 sliders 和 albums
    是否都为空数组。如果两个数组都为空，则将 loading 设置为 true，否则设置为 false。 */
    computed: {
      loading() {
        return !this.sliders.length && !this.albums.length
      }
    },
    // 开始创建组件之前,在beforeCreate和created之前执行
    async created() {
      // 获取接口
      const result = await getRecommend()
      // console.log(result)
      // 将接口传入空数组
      this.sliders = result.sliders
      this.albums = result.albums
    },
    methods: {
      // 传入album数组参数
      selectItem(album) {
        this.selectedAlbum = album
        this.cacheAlbum(album)
        // console.log(album)
        this.$router.push({
          // 不同的路由id
          path: `/recommend/${album.id}`
        })
      },
      cacheAlbum(album) {
        // sessionStorage(会话存储)
        // cookie数据存放在客户的浏览器上，session数据放在服务器上；
        // cookie不是很安全，别人可以分析存放在本地的cookie并进行cookie欺骗，考虑到安全应当使用session；
        storage.session.set(ALBUM_KEY, album)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    overflow: scroll;
    // overflow: scroll;添加滚动，但没有回弹，所以使用betterscroll来实现回弹功能
    .recommend-content {
      // 可以看BetterScroll 滚动原理，高度要大于scroll高度
      height: 100%;
      overflow: hidden;
      .slider-wrapper {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 40%;
        overflow: hidden;
        .slider-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
      }
      .recommend-list {
        .list-title {
          height: 65px;
          line-height: 65px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-theme;
        }
        .item {
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding: 0 20px 20px 20px;

          .icon {
            flex: 0 0 60px;
            width: 60px;
            padding-right: 20px;
          }
          .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: $font-size-medium;
          }
          .name {
            margin-bottom: 10px;
            color: $color-text;
          }
          .title {
            color: $color-text-d;
          }
        }
      }
    }
  }
</style>
