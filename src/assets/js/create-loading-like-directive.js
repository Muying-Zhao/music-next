/*
首先从Vue库中导入createApp函数，然后将我们的根组件loading作为参数传递
给它。接着，我们创建了一个名为app的实例，并使用mount方法将其挂载到
DOM元素上。这样，整个应用就可以开始运行了。
*/
import { createApp } from 'vue'
// 添加样式删除样式
import { addClass, removeClass } from '@/assets/js/dom'

const relativeCls = 'g-relative'
/*
具体实现时，指令在元素挂载后创建了一个 Vue 应用程序实例，
并将其挂载到一个新创建的 div 元素上，然后把这个 div 元素插入到指
令所在元素内部。同时，指令会在元素更新时对 Loading 组件进行相应的修改或移除操作。
这个指令接收一个组件作为参数，组件必须包含一个名为 setTitle 的方法，用于设置 Loading 组件的标题。
*/
// Comp传入的参数，本来是loading，但后面singer也需要使用同一组件
export default function createLoadingLikeDirective(Comp) {
  return {
    /*
    然后通过 mount() 方法将其挂载到指定的 DOM 元素上。这个方法会
    替换掉 DOM 元素中原有的内容，只展示 Vue 应用程序的内容。
     */
    // el用于指定 Vue 实例挂载的目标元素
    mounted(el, binding) { // 当指令绑定的元素挂载时触发
      const app = createApp(Comp) // 创建 Vue 应用程序实例
      const instance = app.mount(document.createElement('div')) // 将实例挂载到一个新创建的 div 元素上
      const name = Comp.name // 获取组件的名称
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance // 将实例保存到元素上
      const title = binding.arg // 获取指令的参数
      if (typeof title !== 'undefined') {
        instance.setTitle(title) // 调用组件的 setTitle 方法设置标题
      }

      if (binding.value) { // 如果指令的值为真，则将 Loading 组件插入到元素中
        append(el)
      }
    },
    updated(el, binding) { // 当指令绑定的元素更新时触发
      const title = binding.arg
      const name = Comp.name
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }
      if (binding.value !== binding.oldValue) { // 如果指令的值发生变化，则添加或移除 Loading 组件
        binding.value ? append(el) : remove(el)
      }
    }
  }

  function append(el) { // 将 Loading 组件插入到元素中的方法
    const name = Comp.name
    // 获取元素的样式
    const style = getComputedStyle(el)
    // 如果元素不是绝对定位、固定定位或相对定位，则为元素添加 relativeCls 类名
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }
    el.appendChild(el[name].instance.$el) // 将 Loading 组件的根 DOM 元素插入到指令所在元素中
  }

  function remove(el) {
    const name = Comp.name
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }
}
