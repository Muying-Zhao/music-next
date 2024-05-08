<template>
  <!-- :probe-type="3"作用：决定是否派发 scroll 事件，对页面的性能有影响，
    尤其是在 useTransition 为 true 的模式下。 -->
  <!--
    // 1. probeType 为 0，在任何时候都不派发 scroll 事件，
    // 2. probeType 为 1，仅仅当手指按在滚动区域上，每隔 momentumLimitTime 毫秒派发一次 scroll 事件，
    // 3. probeType 为 2，仅仅当手指按在滚动区域上，一直派发 scroll 事件，
    // 4. probeType 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画
   -->
    <scroll
    class="index-list"
    :probe-type="3"
    @scroll="onScroll"
    ref="scrollRef"
  >
    <ul ref="groupRef">
      <li
        v-for="group in data"
        :key="group.title"
        class="group"
      >
        <h2 class="title">{{group.title}}</h2>
        <ul>
          <li
            v-for="item in group.list"
            :key="item.id"
            class="item"
            @click="onItemClick(item)"
          >
          <!-- v-lazy实现图片懒加载 -->
            <img class="avatar" v-lazy="item.pic">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 标题固定定位 -->
    <div
      class="fixed"
      v-show="fixedTitle"
      :style="fixedStyle"
    >
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <!-- 右侧固定栏 -->
    <!--
      @touchstart.stop.prevent表示当用户在该元素上开始触摸屏幕时，阻止默认行为和事件冒泡。
@touchmove.stop.prevent表示当用户在该元素上滑动手指时，阻止默认行为和事件冒泡。
@touchend.stop.prevent表示当用户从该元素上抬起手指时，阻止默认行为和事件冒泡
     -->
    <div
      class="shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop.prevent
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="item"
          :data-index="index"
          class="item"
          :class="{'current':currentIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
  import Scroll from '@/components/wrap-scroll/index'
  import useFixed from './use-fixed'
  import useShortcut from './use-shortcut'

  export default {
    name: 'index-list',
    components: { Scroll },
    // "props" 是用于父组件向子组件传递数据的一种机制。具体来说，可以在子组件中通过 props 属性声明接受哪些来自父组件的数据。
    props: {
      data: {
        /* 我们使用 props 属性声明了一个 "type" 的属性，其类型为数组（Array）
        父组件将数据传递给子组件时，它必须是一个数组类型。 */
        type: Array,
        default() {
          return []
        }
      }
    },
    // 自定义一个事件
    emits: ['select'],
    setup(props, { emit }) {
      const { groupRef, onScroll, fixedTitle, fixedStyle, currentIndex } = useFixed(props)
      const { shortcutList, scrollRef, onShortcutTouchStart, onShortcutTouchMove } = useShortcut(props, groupRef)

      function onItemClick(item) {
        emit('select', item)
      }

      return {
        onItemClick,
        // fixed
        groupRef,
        onScroll,
        fixedTitle,
        fixedStyle,
        currentIndex,
        // shortcut
        shortcutList,
        scrollRef,
        onShortcutTouchStart,
        onShortcutTouchMove
      }
    }
  }
</script>

<style lang="scss" scoped>
  .index-list {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background;
    .group {
      padding-bottom: 30px;
      .title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
      .item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name {
          margin-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
    .fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
    }
    .shortcut {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: $color-background-d;
      font-family: Helvetica;
      .item {
        padding: 3px;
        line-height: 1;
        color: $color-text-l;
        font-size: $font-size-small;
        &.current {
          color: $color-theme
        }
      }
    }
  }
</style>
