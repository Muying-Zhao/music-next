import { ref, watch, computed, nextTick } from 'vue'

export default function useFixed(props) {
  const TITLE_HEIGHT = 30
  const groupRef = ref(null)
  const listHeights = ref([])
  const scrollY = ref(0)
  const currentIndex = ref(0)
  const distance = ref(0)

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  // 固定标签的样式
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
    return {
      // 0,${diff}px,0横纵竖
      transform: `translate3d(0,${diff}px,0)`
    }
  })

  /*
  watch() 函数的使用示例。它用于监视 props.data 对象的变化，并在其发生变化时异步执行 calculate() 函数。
  */
 /*
 需要注意的是，由于 watch() 函数是响应式的，因此它只能用于监听对象或表达式的变化，
 而不能监听变量或常量的变化。
 */
  watch(() => props.data, async () => {
    await nextTick() // 调用 nextTick() 方法等待 DOM 更新
    calculate()
  })

  watch(scrollY, (newY) => {
    const listHeightsVal = listHeights.value
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      const heightTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
      }
    }
  })

  function calculate() {
    // 获取groupRef下的children属性所对应的值，也就是一组子元素的列表
    // console.log(groupRef.value.children)
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    let height = 0

    listHeightsVal.length = 0
    listHeightsVal.push(height)

    for (let i = 0; i < list.length; i++) {
      // clientHeight获取一个元素实际占用的可视空间（即不包括隐藏部分的空间
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }

  function onScroll(pos) {
    scrollY.value = -pos.y
  }

  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle,
    currentIndex
  }
}
