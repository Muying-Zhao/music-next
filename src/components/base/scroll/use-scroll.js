import BScroll from '@better-scroll/core'
/* 开启对 content 以及 content 子元素 DOM 改变的探测。当插件被使用后，
当这些 DOM 元素发生变化时，将会触发 scroll 的 refresh 方法
该插件的特性用于解决scroll针对改变频繁的 CSS 属性，增加 debounce，
如果改变发生在 scroll 动画过程中，则不会触发 refresh */
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'

BScroll.use(ObserveDOM)

export default function useScroll(wrapperRef, options, emit) {
  const scroll = ref(null)

  onMounted(() => {
    // debugger将内容隐藏来然后检查问题
    const scrollVal = scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })
    // 设置监听scroll事件
    if (options.probeType > 0) {
      scrollVal.on('scroll', (pos) => {
        emit('scroll', pos)
      })
    }
  })
  // onUnmounted组件注销之前执行
  onUnmounted(() => {
    // 销毁初始化
    scroll.value.destroy()
  })

  // 被包含在 < keep - alive > 中的组件，会多出两个生命周期钩子函数。被激活时执行。
  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })

  // 比如从 A 组件，切换到 B 组件，A 组件消失时执行
  onDeactivated(() => {
    scroll.value.disable()
  })

  return scroll
}
