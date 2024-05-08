/*
1.创建了三个变量分别代表 BetterScroll 实例、根元素引用和是否正在下拉加载。
2.在组件挂载时通过 onMounted 钩子函数创建一个 BetterScroll 实例，
传递 pullUpLoad: true 和 observeDOM: true 选项开启下拉加载和观察 DOM 变动。
3.监听 pullingUp 事件，当触发该事件时，如果 preventPullUpLoad 值为 true，
则完成下拉加载并返回；否则将 isPullUpLoad 设置为 true 表示正在下拉加载，然
后执行 requestData 异步方法获取数据，完成后调用 finishPullUp 完成下拉加载完成，
并刷新 BetterScroll 实例和页面内容，最后将 isPullUpLoad 设置为 false 表示下拉加载结束。
4.在组件卸载时通过 onUnmounted 钩子函数销毁 BetterScroll 实例。
5.在组件激活时通过 onActivated 钩子函数启用 BetterScroll 的滚动效果，并刷新页面内容。
6.在组件失去焦点时通过 onDeactivated 钩子函数禁用 BetterScroll 的滚动效果。
这段代码是一个封装良好的下拉加载 Hook，可以方便地在 Vue3 项目中使用实现下拉加载功能。
*/

// 滚动
import BScroll from '@better-scroll/core'
// 下拉加载
import PullUp from '@better-scroll/pull-up'
// 回弹
import ObserveDOM from '@better-scroll/slide'
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'

BScroll.use(PullUp)
BScroll.use(ObserveDOM)

export default function usePullUpLoad(requestData, preventPullUpLoad) {
  /* 创建了三个变量分别代表 BetterScroll 实例、根元素引用和是否正在下拉加载。 */
  const scroll = ref(null)
  const rootRef = ref(null)
  const isPullUpLoad = ref(false)

  onMounted(() => {
    // 在组件挂载时通过 onMounted 钩子函数创建一个 BetterScroll 实例，
    const scrollVal = scroll.value = new BScroll(rootRef.value, {
      pullUpLoad: true,
      observeDOM: true,
      click: true
    })

    scrollVal.on('pullingUp', pullingUpHandler)

    /* 监听 pullingUp 事件，当触发该事件时，如果 preventPullUpLoad 值为 true，
则完成下拉加载并返回；否则将 isPullUpLoad 设置为 true 表示正在下拉加载，然
后执行 requestData 异步方法获取数据，完成后调用 finishPullUp 完成下拉加载完成，
并刷新 BetterScroll 实例和页面内容，最后将 isPullUpLoad 设置为 false 表示下拉加载结束。 */
    async function pullingUpHandler() {
      if (preventPullUpLoad.value) {
        scrollVal.finishPullUp()
        return
      }
      isPullUpLoad.value = true
      await requestData()
      /* 可以调用 finishPullUp() 方法来通知界面已经加载完所有数据，让界面停止继续加载并隐藏相应的加载更多提示。 */
      scrollVal.finishPullUp()
      scrollVal.refresh()
      isPullUpLoad.value = false
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  /*
  (理解,好像是因为给动态路由组件外设置了keep-alive)
  具体来说，当窗口被激活（即用户将焦点设置到该窗口）时，可以通过调用enable()方法来启用自动滚动，
  并通过调用refresh()方法刷新窗口内容。而当窗口失去焦点（即用户将焦点从该窗口移开）时，则可以通
  过调用disable()方法来禁用自动滚动。
  */
  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })

  onDeactivated(() => {
    scroll.value.disable()
  })

  return {
    scroll,
    rootRef,
    isPullUpLoad
  }
}
