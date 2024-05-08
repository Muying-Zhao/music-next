import { get } from './base'

export function getHotKeys() {
  return get('/api/getHotKeys')
}

// search函数接收三个参数，分别是查询关键字、页码和是否显示歌手信息。
export function search(query, page, showSinger) {
  return get('/api/search', {
    query,
    page,
    showSinger
  })
}
