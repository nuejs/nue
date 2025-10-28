import { styleText as color } from 'node:util'

const MARGIN = '     '
const LABEL_WIDTH = 35
const NL = '\n'

const COLORS = {
  yaml: '🟡',
  js:   '🟠',
  ts:   '🔴',
  html: '🔵',
  md:   '🟢',
  css:  '🟣',
}

function renderDot(type) {
  return COLORS[type] || '⚪'
}

function timeElapsed(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`
}

function renderDots(count, latestType) {
  let dots = []
  for (let i = 0; i < count; i++) {
    dots.push(i === count - 1 && latestType ? renderDot(latestType) : color('dim', '•'))
  }

  let dotStr = dots.join(' ')

  return color('dim', '(') + color('cyan', count.toString()) + color('dim', ') ') + dotStr
}

function renderSection(state, title, data) {
  if (Object.keys(data).length == 0) return ''

  let output = NL + MARGIN + color('bold', title) + NL

  Object.values(data).forEach(item => {
    const label = color('dim', item.name.padEnd(LABEL_WIDTH))
    const isLatest = state.lastType == item.type || state.lastSite == item.site
    const dots = renderDots(item.count, isLatest && item.type)
    output += MARGIN + label + dots + NL
  })

  return output
}

function renderAll(state) {
  console.clear()
  let output = NL

  // header
  output += MARGIN + color('magenta', 'nue dev') + NL
  output += MARGIN + color('dim', state.desc) + NL + NL
  output += MARGIN + renderDot(state.lastType) + ' '
  output += color('cyan', state.lastTime) + ' ago: ' + color('cyan', state.lastFile) + color('dim', ' =>') + NL

  // sections
  output += renderSection(state, 'Assets', state.assets)
  output += renderSection(state, 'Sites', state.sites)
  output += renderSection(state, 'HMR', state.sessions)

  // stats
  const updated = state.fileStats.updated + (state.fileStats.new + state.fileStats.deleted)
  const stats = `${updated} files updated • ${state.fileStats.new} new • ${state.fileStats.deleted} deleted | `
    + `${timeElapsed(Date.now() - state.startTime)} uptime • ${timeElapsed(state.devtime)} devtime (${state.devPercent}%)`
  output += NL + MARGIN + stats + NL + NL

  process.stdout.write(output)
}

export function createHmrProgress(opts = {}) {
  const state = {
    ...opts,
    assets: {},
    sites: {},
    sessions: {},
    startTime: Date.now(),
    lastUpdateTime: Date.now(),
    lastFile: '',
    lastTime: 'Updated now',
    lastType: '',
    lastSite: '',
    fileStats: { updated: 0, new: 0, deleted: 0 },
    devtime: 0,
    devPercent: 0
  }

  let renderInterval, devtimeInterval

  function updateDevtime() {
    const elapsed = Date.now() - state.startTime
    const inactiveSince = Date.now() - state.lastUpdateTime

    // stop counting devtime after 5 minutes of inactivity
    if (inactiveSince < 5 * 60 * 1000) {
      state.devtime = elapsed
      state.devPercent = Math.round((state.devtime / elapsed) * 100)
    }
  }

  return {
    siteUpdated(asset) {
      const name = asset.type.toUpperCase()
      const assetEntry = state.assets[name] ??= { name, type: asset.type, count: 0 }
      assetEntry.count++

      state.sites[asset.site] ??= { name: asset.site, site: asset.site, count: 0 }
      state.sites[asset.site].count++

      state.lastFile = asset.filepath
      state.lastTime = timeElapsed(Date.now() - state.startTime)
      state.lastType = asset.type
      state.lastSite = asset.site
      state.lastUpdateTime = Date.now()

      Object.values(state.sessions).forEach(session => {
        if (session.site == asset.site && session.active) {
          session.count++
        }
      })
    },

    browserUpdated(sessionData) {
      const host = sessionData.host

      state.sessions[host] ??= {
        site: sessionData.site,
        host,
        name: host,
        count: 0,
        active: true
      }
      state.sessions[host].active = sessionData.active
    },

    start() {
      renderInterval = setInterval(() => {
        updateDevtime()
        this.render()
      }, 60 * 1000)

      devtimeInterval = setInterval(updateDevtime, 1000)
    },

    stop() {
      clearInterval(renderInterval)
      clearInterval(devtimeInterval)
    },

    render() {
      updateDevtime()
      renderAll(state)
    }
  }
}