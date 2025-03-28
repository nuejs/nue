
document.addEventListener('click',e => {
  const video = e.target
  if (video.matches('article > video')) {
    video.paused ? video.play() : video.pause()
    video.classList.toggle('paused', video.paused)
  }
})
