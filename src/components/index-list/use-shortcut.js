import { ref, computed } from 'vue'

export default function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 18
  const scrollRef = ref(null)

  /*
  使用 computed 函数来声明计算属性。computed 函数接受一个函数作为参数，并返回一个可响应的 ref 对象。
  */
  const shortcutList = computed(() => {
    // console.log(props.data.title)
    return props.data.map((group) => {
      return group.title
    })
  })

  const touch = {}

  // 点击
  function onShortcutTouchStart(e) {
    // e.target.dataset.index通过data-index=index来拿到索引
    // parseInt将字符串转换为整数
    // console.log(e.target)
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex
    // console.log(touch)
    scrollTo(anchorIndex)
  }

  // 滑动
  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY
    // 目标偏移量
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    const anchorIndex = touch.anchorIndex + delta

    scrollTo(anchorIndex)
  }

  function scrollTo(index) {
    // console.log(index)
    if (isNaN(index)) {
      return
    }
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}
