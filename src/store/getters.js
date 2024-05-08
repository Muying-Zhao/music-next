export const currentSong = (state) => {
  // 不设空对象就可能是undefined，所以会报错
  return state.playlist[state.currentIndex] || {}
}
