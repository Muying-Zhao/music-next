<template>
  <div class="search">
    <div class="search-input-wrapper">
      <!--
        v-model指令将组件的query数据属性绑定到搜索输入字段中输入的值，
        使得父组件可以访问和操作该数据。因此，在父组件中可以通过访问
        query属性来获取或修改搜索框中的文本内容。
       -->
       <!-- 引入search-input组件，SearchInput是给search-input组件设置的别名，但使用时还是search-input -->
      <search-input v-model="query"></search-input>
    </div>
    <scroll
      ref="scrollRef"
      class="search-content"
      v-show="!query"
    >
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="item in hotKeys"
              :key="item.id"
              @click="addQuery(item.key)"
            >
              <span>{{item.key}}</span>
            </li>
          </ul>
        </div>
        <!-- 根据 searchHistory 数组的长度来控制元素的显示和隐藏。 -->
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <!-- 弹窗 -->
          <confirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          >
          </confirm>
          <!-- @select="addQuery"监听addQuery事件 -->
          <!-- :searches="searchHistory"传参给子组件 -->
          <search-list
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteSearch"
          ></search-list>
        </div>
      </div>
    </scroll>
    <!--搜索结果  -->
    <div class="search-result" v-show="query">
      <!-- 搜索列表组件 -->
      <!-- @select-singer="selectSinger"它的含义可能是在模板中使用该指令时，
        传递了一个名为"selectSinger"的方法或函数作为参数。这个指令可能被用于响
        应用户选择歌手的操作，并将选择结果传递给"selectSinger"方法进行处理。
      -->
      <suggest
        :query="query"
        @select-song="selectSong"
        @select-singer="selectSinger"
      ></suggest>
    </div>
    <!-- 它包含一个<router-view>标签，用于动态渲染路由匹配到的组件，
      并且使用了一个v-slot指令来访问该组件。
    -->
    <!--
      v-slot="{ Component }"定义了一个插槽，将路由匹配到的组件作为插槽内容，
      并将其绑定到名为Component的变量上。这个插槽可以被后面的代码块所使用。
     -->
    <router-view v-slot="{ Component }">
      <!-- appear属性表示第一次加载时会应用进入动画 -->
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
  import SearchInput from '@/components/search/search-input'
  import Suggest from '@/components/search/suggest'
  import SearchList from '@/components/base/search-list/search-list'
  import Scroll from '@/components/wrap-scroll'
  import Confirm from '@/components/base/confirm/confirm'
  import { ref, computed, watch, nextTick } from 'vue'
  // 接收热门搜索数据
  import { getHotKeys } from '@/service/search'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import storage from 'good-storage'
  import { SINGER_KEY } from '@/assets/js/constant'
  import useSearchHistory from '@/components/search/use-search-history'

  export default {
    name: 'search',
    components: {
      Confirm,
      Scroll,
      SearchList,
      SearchInput,
      Suggest
    },
    setup() {
      const query = ref('')
      const hotKeys = ref([])
      const selectedSinger = ref(null)
      const scrollRef = ref(null)
      const confirmRef = ref(null)

      const store = useStore()
      const searchHistory = computed(() => store.state.searchHistory)

      const router = useRouter()

      const { saveSearch, deleteSearch, clearSearch } = useSearchHistory()

      getHotKeys().then((result) => {
        hotKeys.value = result.hotKeys
        // console.log(hotKeys)
      })

      /*
      这段代码是在使用一个名为 watch 的函数来监听一个名为 query 的变量的变化。
      如果 newQuery 的值存在且不为 false，那么会执行异步回调函数。
      在这个异步回调函数中，首先会通过 await nextTick() 语句等待下一个事件循环周期，
      以确保其他相关的操作已经完成。然后会调用 refreshScroll() 函数来刷新滚动条。
      */
      watch(query, async (newQuery) => {
        if (!newQuery) {
          await nextTick()
          refreshScroll()
        }
      })

      function refreshScroll() {
        scrollRef.value.scroll.refresh()
      }

      // 将点击的id赋值在搜索框上
      function addQuery(s) {
        query.value = s
      }

      // 自定义事件开发的参数
      function selectSong(song) {
        // 用于在本地存储中保存用户的搜索历史记录的
        saveSearch(query.value)
        // store.dispatch() 方法触发了一个名为 addSong 的 action
        store.dispatch('addSong', song)
      }

      /*
      调用saveSearch函数并将query.value作为参数进行保存。
      将singer设置为selectedSinger.value的值。
      缓存该singer。
      更改路由路径，跳转到/search/${singer.mid}。
      */
      function selectSinger(singer) {
        saveSearch(query.value)
        selectedSinger.value = singer
        cacheSinger(singer)

        router.push({
          path: `/search/${singer.mid}`
        })
      }

      function cacheSinger(singer) {
        storage.session.set(SINGER_KEY, singer)
      }

      // 清除所有的弹窗
      function showConfirm() {
        confirmRef.value.show()
      }

      return {
        scrollRef,
        confirmRef,
        query,
        hotKeys,
        selectedSinger,
        searchHistory,
        addQuery,
        selectSong,
        selectSinger,
        showConfirm,
        // searchHistory
        deleteSearch,
        clearSearch
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .search-input-wrapper {
      margin: 20px;
    }
    .search-content {
      flex: 1;
      overflow: hidden;
      .hot-keys {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;
          .text {
            flex: 1;
          }
          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
    .search-result {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
