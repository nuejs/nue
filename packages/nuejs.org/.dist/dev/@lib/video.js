
  function getQuality(max) {
    const widths = [720, 480, 360]
    return widths.find(w => w < max)
  }

export const lib = [
{
  name: 'bunny-player',
  tagName: 'div',
  tmpl: '<div class="splash" @click="0"> <video ref="video" :poster="1" muted :width="2"></video> <a class="btn-play"></a> </div>',
  Impl: class { 

    mounted({ poster='', videoid }) {
      const base = 'https://video.nuejs.org'
      const video = this.video = this.$refs.video

      this.splash = poster[0] == '/' ? poster : `${base}/${videoid}/${poster || 'thumbnail.jpg'}`

      function addSource(filename, mime='video/mp4') {
        const el = document.createElement('source')
        el.src = `${base}/${videoid}/${filename}`
        el.type = mime
        video.appendChild(el)
      }

      if (video.canPlayType('application/vnd.apple.mpegURL')) {
        addSource('playlist.m3u8', 'application/x-mpegURL')

      } else {
        const width = getQuality(innerWidth)
        addSource(`play_${width}p.mp4`)
      }

      video.addEventListener('ended', () => {
        this.root.classList.remove('playing')
      })
    }

    toggle() {
      const { video } = this
      const { paused } = video
      paused ? video.play() : video.pause()

      this.root.classList.toggle('playing', paused)

      if (!this.started) {
        this.root.classList.remove('splash')
        this.started = true
      }
    }
   },
  fns: [
    (_,e) => { _.toggle.call(_, e) },
    _ => _.splash,
    _ => [_.width]
  ]
}]
export default lib[0]