import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

// onActivated, onDeactivated这二个生命周期,在服务器端渲染期间不会被调用
// onActivated当组件被插入到 DOM 中时调用。 onDeactivated当组件从 DOM 中被移除时调用
import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'
// onMounted页面渲染之前执行，执行完，页面就出来了
// onUnmounted组件注销之前执行，执行完组件就不在页面显示了。如果隐藏组件就行执行
BScroll.use(Slide)

export default function useSlider(wrapperRef) {
  const slider = ref(null)
  const currentPageIndex = ref(0)

  /* 前景提要：onMounted钩子是vue3新添加的特性，属于组合式api，在setup中调用，
  而setup相当于组件编译的入口，setup在beforeCreate钩子执行前运行，此时只初始化了
  prop（属性）和context等，而data是在beforeCreate钩子之后created之前执行的。

注意：onMounted虽然写在setup函数中，但却是在组件挂载到父组件时才被调用的。

方法：由于setup中不能使用this，因此需要使用getCurrentInstance 方法获得当前活跃的组件，具体方式见代码。 */
  onMounted(() => {
    const sliderVal = slider.value = new BScroll(wrapperRef.value, {
      click: true,
      // 当值为 true 时，设置 slide 的方向为横向。
      scrollX: true,
      // 当值为 true 时，设置 slide 的方向为纵向。 注意: scrollX 和 scrollY 不能同时设置为 true
      scrollY: false,
      // 当使用 slide 时，这个值需要设置为 false，用来避免惯性动画带来的快速滚动时的闪烁的问题和快速滑动时一次滚动多页的问题。
      momentum: false,
      // bounce 值需要设置为 false，否则会在循环衔接的时候出现闪烁。
      bounce: false,
      // 如果你想通过监听 slideWillChange 事件，在用户拖动 slide 时，实时获取到 slide 的 PageIndex 的改变，需要设置 probeType 值为 2 或者 3。
      probeType: 2,
      // 开启 slide 功能。若没有该项，则插件不会生效。该配置同时也是用来设置 slide 特性的相关配置，具体请参考
      slide: true
    })
    sliderVal.on('slideWillChange', (page) => {
      // console.log(currentPageIndex.value)
      currentPageIndex.value = page.pageX
    })
  })

   // onUnmounted组件注销之前执行
  onUnmounted(() => {
    // 销毁初始化
    slider.value.destroy()
  })
  // onActivated当组件被插入到 DOM 中时调用
  onActivated(() => {
    // 恢复功能
    slider.value.enable()
    // 刷新一下
    slider.value.refresh()
  })
  // onDeactivated当组件从 DOM 中被移除时调用
  onDeactivated(() => {
    slider.value.disable()
  })

  return {
    slider,
    currentPageIndex
  }
}
