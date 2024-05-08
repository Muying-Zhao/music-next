<template>
  <div class="singer" v-loading="!singers.length">
    <!-- 父组件为singer.vue.子组件为list-view.vue.需要把歌手的数据传给子组件。
      则绑定 :data = 'singers' ，singers为父组件的值。data为子组件接收值的名称 -->
    <!--然后 子组件采用props的方式接收、data 里面就是父组件传过来的的值了。 -->
    <!--
      @select="selectSinger"
      Vue 3 中的一个事件监听器，它会在指定的组件上绑定一个 selectSinger 方法。当该组件触发了 select 事件时，就会调用 selectSinger 方法进行处理。
     -->
     <!-- 歌手页面 -->
    <index-list
      :data="singers"
      @select="selectSinger"
    ></index-list>
    <!-- 路由动态切换 -->
    <!-- 一开始就显示appear属性 -->
    <!-- 我们使用了 v-slot 指令将内部的组件实例传递到外层模板中的 Component 变量中。 -->
    <!-- 然后，通过 <transition> 组件包裹住了 <component> 组件，从而实现了路由切换时的过渡效果。appear 属性表示组件在初始渲染时也需要执行过渡动画，name 属性指定了过渡动画的名称，可以自定义。 -->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
// 获取singer接口数据
  import { getSingerList } from '@/service/singer'
  import IndexList from '@/components/index-list/index-list'
  // 存储
  import storage from 'good-storage'
  // 引入常量
  import { SINGER_KEY } from '@/assets/js/constant'

  export default {
    name: 'singer',
    components: {
      IndexList
    },
    data() {
      return {
        singers: [],
        selectedSinger: null
      }
    },
    // created在这个异步函数执行完成之前，组件不会渲染。
    async created() {
      const result = await getSingerList()
      // console.log(result)
      this.singers = result.singers
    },
    methods: {
      selectSinger(singer) {
        this.selectedSinger = singer
        // 缓存singer
        this.cacheSinger(singer)
        this.$router.push({
          path: `/singer/${singer.mid}`
        })
      },
      // 缓存singer
      cacheSinger(singer) {
        storage.session.set(SINGER_KEY, singer)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .singer {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
  }
</style>
