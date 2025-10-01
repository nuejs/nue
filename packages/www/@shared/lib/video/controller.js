/*
  videoId: 39b76cca-e55b-4e9b-8583-b053f9dbd55d
  poster: thumbnail_70d8de32.jpg
  width: 704
  height: 407
*/
export function createVideo({ videoId, poster, width, height }) {
  const base = `https://video.nuejs.org/${videoId}`
  const video = document.createElement('video')

  // video attributes
  video.poster = poster?.includes('/') ? poster : `${base}/${poster || 'thumbnail.jpg'}`
  video.width = width
  video.height = height
  video.muted = true


  // video source
  const use_hls = video.canPlayType('application/vnd.apple.mpegURL')
  video.appendChild(createSource(base, use_hls))
  return video
}

function createSource(base, use_hls) {
  const el = document.createElement('source')
  const filename = use_hls ? 'playlist.m3u8' : `play_${getQuality()}p.mp4`

  el.type = use_hls ? 'application/x-mpegURL' : 'video/mp4'
  el.src = `${base}/${filename}`
  return el
}

function getQuality() {
  return [720, 480, 360].find(w => w < window.innerWidth)
}

// use a global listener (to support upcoming keyboard shortcuts)
document.addEventListener('click', e => {
  const el = e.target
  const parent = el.closest('.player')
  const video = el.matches('video') ? el : parent?.querySelector('video')
  if (!video) return

  if (el.matches('.maximize')) {
    video.requestFullscreen()
  } else {
    video.paused ? video.play() : video.pause()
    parent?.classList.toggle('paused', video.paused)
  }
})