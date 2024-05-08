import { get } from './base'

export function getRecommend() {
  return get('/api/getRecommend')
}

/* 这段代码是一个 JavaScript 函数，用于获取音乐专辑信息。
该函数调用了一个名为 get 的函数，并传递了两个参数：一个字符串
'/api/getAlbum' 表示要访问的 API 路径，
另一个是一个包含 id 属性的对象，该属性的值为传入函数的 album 对象的 id 属性值。
该函数返回一个 Promise 对象，可通过 .then() 和 .catch() 方法处理异步操作的结果。
这段代码很可能是用于从服务器端获取特定音乐专辑信息的前端代码片段 */
export function getAlbum(album) {
  return get('/api/getAlbum', {
    id: album.id
  })
}
