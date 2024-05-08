<template>
  <div
    class="progress-bar"
    @click="onClick"
  >
    <div class="bar-inner">
      <div
        class="progress"
        ref="progress"
        :style="progressStyle"
      ></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  const progressBtnWidth = 16

  export default {
    name: 'progress-bar',
    // 自定义事件
    emits: ['progress-changing', 'progress-changed'],
    props: {
      progress: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        // 偏移量
        offset: 0
      }
    },
    // 进度条动态样式
    computed: {
      progressStyle() {
        return `width:${this.offset}px`
      },
      btnStyle() {
        return `transform:translate3d(${this.offset}px,0,0)`
      }
    },
    watch: {
      progress(newProgress) {
        this.setOffset(newProgress)
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      onTouchStart(e) {
        this.touch.x1 = e.touches[0].pageX
        // 黄色进度条的初始宽度
        this.touch.beginWidth = this.$refs.progress.clientWidth
      },
      onTouchMove(e) {
        const delta = e.touches[0].pageX - this.touch.x1
        const tempWidth = this.touch.beginWidth + delta
        // 整个进度条的宽度
        const barWidth = this.$el.clientWidth - progressBtnWidth
        // 拖动过程中限制在0~1之间
        const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
        // 偏移量
        this.offset = barWidth * progress
        this.$emit('progress-changing', progress)
      },
      onTouchEnd() {
        const barWidth = this.$el.clientWidth - progressBtnWidth
        const progress = this.$refs.progress.clientWidth / barWidth
        this.$emit('progress-changed', progress)
      },
      onClick(e) {
        // getBoundingClientRect()是一个用于获取元素在浏览器窗口视图中相对位置和大小的方法。
        const rect = this.$el.getBoundingClientRect()
        // 进度条到开始位置的偏移量
        const offsetWidth = e.pageX - rect.left
        const barWidth = this.$el.clientWidth - progressBtnWidth
        const progress = offsetWidth / barWidth
        this.$emit('progress-changed', progress)
      },
      setOffset(progress) {
        // 总进度条的宽度
        const barWidth = this.$el.clientWidth - progressBtnWidth
        // progress进度,它的进度范围0~1
        // 偏移量
        this.offset = barWidth * progress
      }
    }
  }
</script>

<style lang="scss" scoped>
  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
