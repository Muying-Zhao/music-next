import { get } from './base'

export function processSongs(songs) {
  // 它首先检查这些歌曲是否为空，如果是空
  if (!songs.length) {
    // 如果是空，则立即返回带有这些原始歌曲的一个解决的Promise
    return Promise.resolve(songs)
  }
  // 否则，它将发送一个GET请求到"/api/getSongsUrl"路由，并传递所有歌曲的mid（音乐ID）作为参数。
  return get('/api/getSongsUrl', {
    mid: songs.map((song) => {
      return song.mid
    })
    /*
    一旦它得到了结果，它会在结果映射中找到每个歌曲的URL，并将其添加到原始歌曲中。最后，
    它会过滤出那些具有vkey的URL，然后返回一个带有更新URL的解决Promise。
    */
  }).then((result) => {
    const map = result.map
    return songs.map((song) => {
      song.url = map[song.mid]
      return song
    }).filter((song) => {
      return song.url && song.url.indexOf('vkey') > -1
    })
  })
}
/*
如果歌曲已经有歌词，则该函数会立即返回带有当前歌词的解决Promise。否则，
它会从内存中的缓存"lyricMap"中查找该歌曲的歌词。如果找到了歌词，则它会立即返
回带有歌词的解决Promise。否则，它将发送一个GET请求到"/api/getLyric"路由，并将歌
曲的mid作为参数。一旦它得到了结果，它会将歌词存储在"lyricMap"中，并返回一个带有
歌词的解决Promise。如果没有找到歌词，则函数将返回一个包含默认歌词的解决Promise。
*/
const lyricMap = {}
// 函数"getLyric"获取一首歌曲，并检查该歌曲是否已有歌词。
export function getLyric(song) {
  if (song.lyric) {
    // Promise.resolve（） 将现有对象转为Promise对象,并且立即resolved
    return Promise.resolve(song.lyric)
  }
  const mid = song.mid
  const lyric = lyricMap[mid]
  if (lyric) {
    console.log(lyric)
    return Promise.resolve(lyric)
  }

  return get('/api/getLyric', {
    mid
  }).then((result) => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[mid] = lyric
    return lyric
  })
}
