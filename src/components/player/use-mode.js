import { useStore } from 'vuex'
import { computed } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant'

export default function useMode() {
  const store = useStore()
  // 播放模式
  const playMode = computed(() => store.state.playMode)

  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
    // 顺序播放图标
      ? 'icon-sequence'
      : playModeVal === PLAY_MODE.random
      // 随机播放图标
      ? 'icon-random'
      // 循环播放图标
        : 'icon-loop'
  })

  const modeText = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
      ? '顺序播放'
      : playModeVal === PLAY_MODE.random
        ? '随机播放'
        : '单曲循环'
  })

  function changeMode() {
    /*
    dispatch：含有异步操作，例如向后台提交数据，
    写法： this.$store.dispatch(‘action方法名’,值)
    */
    const mode = (playMode.value + 1) % 3
    store.dispatch('changeMode', mode)
  }

  return {
    modeIcon,
    modeText,
    changeMode
  }
}
