<template>
  <!-- 封装一个scroll组件，不仅可以滚动还可以回弹 -->
  <div ref="rootRef">
    <!-- slot插槽方式 -->
    <slot></slot>
  </div>
</template>

<script>
  import useScroll from './use-scroll'
  import { ref } from 'vue'

  export default {
    name: 'scroll',
    // 定义组件默认行为
    props: {
      click: {
        type: Boolean,
        default: true
      },
      probeType: {
        type: Number,
        default: 0
      }
    },
    // 定义自定义事件名称
    emits: ['scroll'],
    setup(props, { emit }) {
      const rootRef = ref(null)
      const scroll = useScroll(rootRef, props, emit)

      return {
        rootRef,
        scroll
      }
    }
  }
</script>
