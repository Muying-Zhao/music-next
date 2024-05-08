import { save, remove, clear } from '@/assets/js/array-store'
import { SEARCH_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'

export default function useSearchHistory() {
  const maxLen = 200

  const store = useStore()

  // 用于在本地存储中保存用户的搜索历史记录的
  function saveSearch(query) {
    // 封装好的save方法将query保存到本地存储的键为SEARCH_KEY的数据中，
    // item回调函数的作用过滤掉与当前搜索关键词相同的历史记录
    const searches = save(query, SEARCH_KEY, (item) => {
      return item === query
    }, maxLen)
    store.commit('setSearchHistory', searches)
  }

  function deleteSearch(query) {
    const searches = remove(SEARCH_KEY, (item) => {
      return item === query
    })
    store.commit('setSearchHistory', searches)
  }

  function clearSearch() {
    const searches = clear(SEARCH_KEY)
    store.commit('setSearchHistory', searches)
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch
  }
}
