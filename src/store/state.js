import { PLAY_MODE, SEARCH_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

const state = {
  // 原始播放列表
  sequenceList: [],
  // 真实播放列表
  playlist: [],
  // 判断正在播放
  playing: false,
  // 播放模式，默认顺序播放
  playMode: PLAY_MODE.sequence,
  // 当前播放索引
  currentIndex: 0,
  // 当前播放状态，全屏还是收缩的
  fullScreen: false,
  // 收藏歌曲列表
  favoriteList: [],
  // 搜索历史
  /*  load() 方法通过 AJAX 请求从服务器加载数据,并把返回的数据放置到指定的元素中 */
  searchHistory: load(SEARCH_KEY),
  playHistory: []
}

export default state
