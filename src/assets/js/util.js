// 洗牌函数
export function shuffle(source) {
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

function getRandomInt(max) {
  // 取0~max之间的数
  return Math.floor(Math.random() * (max + 1))
}

// 交换
function swap(arr, i, j) {
  const t = arr[i]
  arr[i] = arr[j]
  arr[j] = t
}
// 定义时间工具函数
export function formatTime(interval) {
  interval = interval | 0
  // + ''目的是使其变成字符串,然后使用padStart方法,往前填充两位,不足为0
  const minute = ((interval / 60 | 0) + '').padStart(2, '0')
  const second = (interval % 60 + '').padStart(2, '0')
  return `${minute}:${second}`
}
/*
这是 JavaScript 语言中的位运算符。语句中的“|”表示按位或运算，而“0”
则是一个二进制数，全部由0构成。这个语句的作用是将变量 interval 强制
转换为整数。具体来说，它会将 interval 的小数部分截取掉并保留整数部
分。这种转换方式可以保证 interval 变量始终是整数值，即使它原本是一个
小数也不例外。
*/
