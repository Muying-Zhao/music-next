/*
用于在 HTML 元素上添加或删除 CSS 类名。这些函数使用了 Element.classList API
具体来说，addClass(el, className) 函数会将 className 添加到 el
元素的类列表中，但只有当 className 不在列表中时才会添加；
removeClass(el, className) 函数会将 el 元素的类列表中的
className 移除。这些函数通常用于动态修改样式或改变元素的状态。
*/
export function addClass(el, className) {
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

export function removeClass(el, className) {
  el.classList.remove(className)
}
