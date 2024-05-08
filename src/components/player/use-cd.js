// 图片旋转
import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

export default function useCd() {
  // 获取dom元素
  const cdRef = ref(null)
  const cdImageRef = ref(null)

  const store = useStore()
  // 判断是否正在播放
  const playing = computed(() => store.state.playing)

  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })

  watch(playing, (newPlaying) => {
    // 如果暂停的时候同步
    // console.log(cdRef.value)
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  // 定义函数
  function syncTransform(wrapper, inner) {
    // getComputedStyle()这个方法来获取元素当前的样式
    const wrapperTransform = getComputedStyle(wrapper).transform
    // 内层图片旋转角度
    const innerTransform = getComputedStyle(inner).transform
    // concat() 方法用于将指定的字符串参数连接到字符串上
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
  }

  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}
