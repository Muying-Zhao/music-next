import { useStore } from 'vuex'
import { computed } from 'vue'
import { save, remove } from '@/assets/js/array-store'
import { FAVORITE_KEY } from '@/assets/js/constant'

export default function useFavorite() {
  // 使用store里的数据
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  const maxLen = 100

  /*
  添加样式
  */
  function getFavoriteIcon(song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  // 点击按钮
  function toggleFavorite(song) {
    let list
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare)
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }
    store.commit('setFavoriteList', list)

    // 定义compare函数，用户点击然后传入
    function compare(item) {
      return item.id === song.id
    }
  }

/* findIndex
1. 为数组中的每个元素都调用一次函数的执行:
①. 当数组中的元素在需求条件时返回为 true,findIndex()会返回符合条件的元素的索引位置,
之后的值不会再调用执行函数;
②. 如果没有符合条件的元素返回 -1
③. 对于空数组,函数不执行
④. 并没有改变数组的原始值
2. findIndex() 方法返回的是传入的一个需求条件（函数）符合条件的数组的第一个元素位置；
*/

  // 是否在喜欢的列表中
  function isFavorite(song) {
    return favoriteList.value.findIndex((item) => {
      return item.id === song.id
    }) > -1
    // 如果返回的值是-1与-1比较，所以再返回的就是false
    /*
    (item) => {
      return item.id === song.id
    }) > -1
    相当于传入的compare
    */
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
