import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 图片懒加载
import lazyPlugin from 'vue3-lazy'
// v-loading自定义指令的开发
import loadingDirective from '@/components/base/loading/directive'
import noResultDirective from '@/components/base/no-result/directive'
import { load, saveAll } from '@/assets/js/array-store'
import { FAVORITE_KEY, PLAY_KEY } from '@/assets/js/constant'
import { processSongs } from '@/service/song'

// 引入全局样式文件
import '@/assets/scss/index.scss'

const favoriteSongs = load(FAVORITE_KEY)
if (favoriteSongs.length > 0) {
  processSongs(favoriteSongs).then((songs) => {
    store.commit('setFavoriteList', songs)
    saveAll(songs, FAVORITE_KEY)
  })
}

const historySongs = load(PLAY_KEY)
if (historySongs.length > 0) {
  processSongs(historySongs).then((songs) => {
    store.commit('setPlayHistory', songs)
    saveAll(songs, PLAY_KEY)
  })
}
/*
图片懒加载
use(lazyPlugin, {
  loading: require('@/assets/images/default.png')
})
*/
createApp(App).use(store).use(router).use(lazyPlugin, {
  loading: require('@/assets/images/default.png')
}).directive('loading', loadingDirective).directive('no-result', noResultDirective).mount('#app')
