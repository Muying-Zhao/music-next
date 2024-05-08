// 对state原始数据进行修改
const mutations = {
  // 修改播放状态然后两个参数，原始参数，修改后参数
  setPlayingState(state, playing) {
    state.playing = playing
  },
  // 设置顺序播放列表
  setSequenceList(state, list) {
    state.sequenceList = list
  },
  // 设置真实播放列表
  setPlaylist(state, list) {
    state.playlist = list
  },
  // 设置播放模式
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  // 设置播放索引
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  // 设置播放状态
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen
  },
  // 修改收藏列表
  setFavoriteList(state, list) {
    state.favoriteList = list
  },
  // 修改歌词
  addSongLyric(state, { song, lyric }) {
    state.sequenceList.map((item) => {
      if (item.mid === song.mid) {
        item.lyric = lyric
      }
      return item
    })
  },
  setSearchHistory(state, searches) {
    state.searchHistory = searches
  },
  setPlayHistory(state, songs) {
    state.playHistory = songs
  }
}

export default mutations
