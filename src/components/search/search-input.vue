<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <!-- 父组件通过 props 向子组件传递数据时，默认情况下是单向数据流，
      即子组件不能直接修改来自父组件的 props 数据。 -->
    <!--
      v-model指令将组件的query数据属性绑定到搜索输入字段中输入的值，
      使得父组件可以访问和操作该数据。因此，在父组件中可以通过访问
      query属性来获取或修改搜索框中的文本内容。
    -->
    <!--
      : 前缀的 HTML 属性都表示该属性是 Vue.js 绑定的动态属性。这种属性绑定允许你将
      组件的状态（data）和模板（template）关联起来，从而实现响应式的数据绑定。因此，
      在表单中使用 :placeholder 可以方便地动态改变输入框的提示文本，提高用户体验。
     -->
    <input
      class="input-inner"
      v-model="query"
      :placeholder="placeholder"
    />
    <i
      v-show="query"
      class="icon-dismiss"
      @click="clear"
    ></i>
  </div>
</template>

<script>
  import { debounce } from 'throttle-debounce'

  export default {
    name: 'search-input',
    /*
    其中，type 属性指定了属性的类型，可以是 JavaScript 中的基本数据类型（如 String、Number 等）
    或自定义对象或数组。而 default 属性则指定了属性的默认值，当父组件没有传入对应的属性时，就会
    使用该默认值作为属性的初始值。
    在 Vue.js 组件中，props 是一种用于父子组件通信的机制，它允许父组件向子组件传递数据，并在子组件
    中声明需要哪些属性以及它们的类型、默认值等属性。通过使用 props，我们可以让组件更加灵活和可复用，
    也能够提高组件间的解耦性。
    */
    props: {
      modelValue: String,
      placeholder: {
        type: String,
        // 默认值
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        /* this.modelValue 是通过 props 从父组件传入的数据，因此它会随着父组件的更新而更新。 */
        // query 是这个组件自身的状态，如果在其他方法中修改了它，那么组件将重新渲染以反映这个变化
        query: this.modelValue
      }
    },
    /*
    created方法是一个生命周期钩子函数,一个vue实例被生成后会调用这个函数
    */
    created() {
      /* $watch 来进行组件数据的监视 */
      /*
      this.$watch 是 Vue.js 提供的一个实例方法，用于监听 Vue 实例数据的变化，并在数据变化时
      执行相应的回调函数。该方法接收两个参数：第一个参数是要监听的数据属性的表达式，第二个参数
      是一个回调函数，用于处理数据变化后的逻辑。
      this.$watch 方法的作用是建立数据的“响应式依赖”，即当数据发生变化时，自动触发相关的更新
      操作（例如重新渲染视图）。通过使用 this.$watch 方法，我们可以在数据变化时获取通知，做
      出相应的处理，从而实现更加灵活和高效的前端交互。
      */
    //  需要安装throttle-debounce
      this.$watch('query', debounce(300, (newQuery) => {
        /*
        在这个回调函数中，使用了一个 debounce 函数，它能够将连续的多次调用合并成一次调用，并
        且只有当停顿时间超过指定的时间（300ms）时才会执行回调函数。这可以避免频繁地触发更新操
        作，从而提高性能和用户体验。
        当 debounce 函数触发回调函数时，会将新的查询值 newQuery 作为参数传递给回调函数，并通
        过 $emit 方法触发 update:modelValue 自定义事件，从而向父组件传递新的值。这里使用了
        trim 方法来删除 newQuery 的两端空格，以确保不会发送无效的查询值。
        */
        this.$emit('update:modelValue', newQuery.trim())
      }))

      this.$watch('modelValue', (newVal) => {
        this.query = newVal
      })
    },
    methods: {
      clear() {
        this.query = ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-input {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 32px;
    background: $color-highlight-background;
    border-radius: 6px;
    .icon-search {
      font-size: 24px;
      color: $color-text-d;
    }
    .input-inner {
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: $color-highlight-background;
      color: $color-text;
      font-size: $font-size-medium;
      outline: 0;
      &::placeholder {
        color: $color-text-d;
      }
    }
    .icon-dismiss {
      font-size: 16px;
      color: $color-text-d;
    }
  }
</style>
