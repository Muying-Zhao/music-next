<template>
  <m-header></m-header>
  <tab></tab>
  <!-- router-view是可以嵌套的 -->
  <router-view :style="viewStyle" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"/>
    </keep-alive>
  </router-view>
  <router-view
    :style="viewStyle"
    name="user"
    v-slot="{ Component }"
  >
    <transition appear name="slide">
      <keep-alive>
        <component :is="Component"/>
      </keep-alive>
    </transition>
  </router-view>
  <player></player>
</template>

<script>
  import Header from '@/components/header/header'
  import Tab from '@/components/tab/tab'
  import Player from '@/components/player/player'
  import { mapState } from 'vuex'
  // 引入tab组件，Tab是给tab组件设置的别名，但使用时还是<tab></tab>

  export default {
    components: {
      Player,
      MHeader: Header,
      Tab
    },
    computed: {
      viewStyle() {
        const bottom = this.playlist.length ? '60px' : '0'
        return {
          bottom
        }
      },
      ...mapState([
        'playlist'
      ])
    }
  }
</script>
