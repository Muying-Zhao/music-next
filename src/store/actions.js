import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

/*
commit 是 Vuex 中的一个方法，用于提交一个 mutation。mutation 是 Vuex 中的一种概念，用于修改 store 中的状态
必须通过 commit 触发 mutation 来完成。
*/
export function selectPlay({ commit }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlaylist', list)
  commit('setCurrentIndex', index)
}

export function randomPlay({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlaylist', shuffle(list))
  commit('setCurrentIndex', 0)
}

export function changeMode({ commit, state, getters }, mode) {
  const currentId = getters.currentSong.id
  if (mode === PLAY_MODE.random) {
    commit('setPlaylist', shuffle(state.sequenceList))
  } else {
    commit('setPlaylist', state.sequenceList)
  }
  const index = state.playlist.findIndex((song) => {
    return song.id === currentId
  })

  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}

// 移除列表项
export function removeSong({ commit, state }, song) {
  const sequenceList = state.sequenceList.slice()
  const playlist = state.playlist.slice()

  // 原始播放列表
  const sequenceIndex = findIndex(sequenceList, song)
  // 真实播放列表
  const playIndex = findIndex(playlist, song)
  if (sequenceIndex < 0 || playIndex < 0) {
    return
  }

  sequenceList.splice(sequenceIndex, 1)
  playlist.splice(playIndex, 1)

  let currentIndex = state.currentIndex
  if (playIndex < currentIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit('setSequenceList', sequenceList)
  commit('setPlaylist', playlist)
  commit('setCurrentIndex', currentIndex)
  if (!playlist.length) {
    commit('setPlayingState', false)
  }
}

export function clearSongList({ commit }) {
  commit('setSequenceList', [])
  commit('setPlaylist', [])
  commit('setCurrentIndex', 0)
  commit('setPlayingState', false)
}
// 搜索歌曲列表中添加
export function addSong({ commit, state }, song) {
  // slice() 方法不会改变原始数组
  const playlist = state.playlist.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 在 playlist 数组中查找与 song 相等的元素，并返回该元素在数组中的索引值。未能找到相应的元素则返回-1
  const playIndex = findIndex(playlist, song)

  if (playIndex > -1) {
    currentIndex = playIndex
  } else {
    playlist.push(song)
    currentIndex = playlist.length - 1
  }

  const sequenceIndex = findIndex(sequenceList, song)
  if (sequenceIndex === -1) {
    sequenceList.push(song)
  }

  commit('setSequenceList', sequenceList)
  commit('setPlaylist', playlist)
  commit('setCurrentIndex', currentIndex)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
}

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
