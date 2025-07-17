const API_KEY = '135c1049-4589-4792-886e-d06fed9fa410'

async function showMap(opts) {
  const { circles=[], circle_size=200, zoom=13, max_zoom=20 } = opts

  // design options
  const theme = opts.design == 'minimal' ? 'stamen_toner' : 'osm_bright'

  // async load for dem
  await import('//unpkg.com/leaflet@1.9.4/dist/leaflet.js')

  // setup map at given position
  const map = L.map(opts.root).setView(opts.position, zoom)

  const apikey =  location.hostname.endsWith('nuejs.org') ? `&api_key=${API_KEY}` : ''

  L.tileLayer(`//tiles.stadiamaps.com/tiles/${ theme }/{z}/{x}/{y}{r}.png${apikey}`, {
    attribution: 'Stadia Maps',
    maxZoom: max_zoom
  }).addTo(map)

  // circles
  circles.forEach(pos => L.circle(pos, { radius: circle_size }).addTo(map))

  // forced resize to fix leaflet rendering issue
  window.dispatchEvent(new Event('resize'))
}
export const lib = [ { tag: 'dashboard',
    attr: [ { name: 'class', val: 'grid' } ],
    is_custom: true,
    children:
     [ { tag: 'section',
         attr: [ { name: 'class', val: 'compact card' } ],
         children:
          [ { tag: 'product',
              attr: [ { name: 'bind', fn: _=>_.product, is_data: true } ],
              is_custom: true } ] },
       { tag: 'section',
         attr: [ { name: 'class', val: 'compact card' } ],
         children:
          [ { tag: 'leaflet',
              attr: [ { name: 'bind', fn: _=>_.geolocation, is_data: true } ],
              is_custom: true } ] },
       { tag: 'section',
         attr: [ { name: 'class', val: 'wide card' } ],
         children:
          [ { tag: 'user-table',
              attr: [ { name: 'users', fn: _=>_.users, is_data: true } ],
              is_custom: true } ] },
       { tag: 'section',
         attr: [ { name: 'class', val: 'card thin' } ],
         children: [ { tag: 'create-account', is_custom: true } ] } ] },
  { tag: 'bar-chart',
    attr: [ { name: 'class', val: 'bar-chart' } ],
    is_custom: true,
    script: function() { this.max = this.max || Math.max(...this.data) 
		},
    children:
     [ { tag: 'bar',
         for: { fn: _=>_.data, keys: [ 'value' ], is_entries: false },
         attr:
          [ { name: 'value', fn: _=>_.value, is_data: true },
            { name: 'max', fn: _=>_.max, is_data: true } ],
         is_custom: true } ] },
  { tag: 'bar',
    attr: [ { name: 'height', fn: _=>((Math.round(_.value / _.max * 100))), is_var: true } ],
    is_custom: true },
  { tag: 'table',
    is: 'user-table',
    attr: [ { name: 'class', val: 'responsive' } ],
    script: function() { this.format = function(num) {
      return new Intl.NumberFormat('en-US').format(num)
    } 
		},
    children:
     [ { tag: 'caption',
         children:
          [ { tag: 'h1', children: [ { text: 'Top contributors' } ] },
            { tag: 'p', children: [ { text: 'January 1, 2025 — Present' } ] } ] },
       { tag: 'thead',
         children:
          [ { tag: 'tr',
              children:
               [ { tag: 'th', children: [ { text: 'Person' } ] },
                 { tag: 'th', children: [ { text: 'Name' } ] },
                 { tag: 'th',
                   attr: [ { name: 'colspan', val: '2' } ],
                   children: [ { text: 'Commits' } ] } ] } ] },
       { tag: 'tbody',
         children:
          [ { tag: 'tr',
              for: { fn: _=>_.users, keys: [ 'user' ], index: 'i', is_entries: false },
              children:
               [ { tag: 'td',
                   children:
                    [ { tag: 'avatar',
                        attr: [ { name: 'src', fn: _=>(_.user.avatar), is_data: true } ],
                        is_custom: true } ] },
                 { tag: 'td',
                   children:
                    [ { tag: 'h3', children: [ { fn: _=>(_.user.name) } ] },
                      { tag: 'p', children: [ { fn: _=>(_.user.email) } ] } ] },
                 { tag: 'td',
                   children:
                    [ { tag: 'h4',
                        children: [ { fn: _=>(_.format(_.user.commits)) }, { text: ' commits' } ] },
                      { tag: 'p',
                        children:
                         [ { tag: 'small',
                             attr: [ { name: 'class', val: 'row' } ],
                             children:
                              [ { tag: 'ins', children: [ { fn: _=>(_.format(_.user.inserts)) }, { text: '++' } ] },
                                { tag: 'del', children: [ { fn: _=>(_.format(_.user.deletes)) }, { text: '--' } ] } ] } ] } ] },
                 { tag: 'td',
                   children:
                    [ { tag: 'bar-chart',
                        attr:
                         [ { name: 'data', fn: _=>(_.user.activity), is_data: true },
                           { name: 'max', fn: _=>(_.user.max), is_data: true } ],
                        is_custom: true } ] } ] } ] },
       { tag: 'caption',
         children: [ { text: '\n    This project has 12 contributors in total\n  ' } ] } ] },
  { tag: 'figure',
    is: 'avatar',
    attr: [ { name: 'class', val: 'avatar' } ],
    children:
     [ { tag: 'img',
         attr:
          [ { name: 'src', fn: _=>("img/" + (_.src)) },
            { name: 'width', val: '40' },
            { name: 'height', val: '40' } ] } ] },
  { tag: 'create-account',
    is_custom: true,
    children:
     [ { tag: 'header',
         children:
          [ { tag: 'h1', children: [ { text: 'Create an account' } ] },
            { tag: 'p', children: [ { text: 'Continue with' } ] } ] },
       { tag: 'div',
         attr: [ { name: 'class', val: 'full row' } ],
         children:
          [ { tag: 'button', children: [ { text: 'Google' } ] },
            { tag: 'button', children: [ { text: 'GitHub' } ] } ] },
       { tag: 'form',
         attr: [ { name: 'onsubmit', val: 'return false' } ],
         children:
          [ { tag: 'h2',
              attr: [ { name: 'class', val: 'divider' } ],
              children: [ { text: 'Or continue with' } ] },
            { tag: 'div',
              children:
               [ { tag: 'label',
                   attr: [ { name: 'for', val: 'email' } ],
                   children: [ { text: 'Email' } ] },
                 { tag: 'p',
                   children:
                    [ { tag: 'input',
                        attr:
                         [ { name: 'id', val: 'email' },
                           { name: 'type', val: 'email' },
                           { name: 'placeholder', val: 'me@example.com' },
                           { name: 'autocomplete', val: 'email' } ] } ] } ] },
            { tag: 'div',
              children:
               [ { tag: 'label',
                   attr: [ { name: 'for', val: 'password' } ],
                   children: [ { text: 'Password' } ] },
                 { tag: 'p',
                   children:
                    [ { tag: 'input',
                        attr:
                         [ { name: 'id', val: 'password' },
                           { name: 'type', val: 'password' },
                           { name: 'autocomplete', val: 'current-password' } ] } ] } ] },
            { tag: 'footer',
              children:
               [ { tag: 'button',
                   attr: [ { name: 'class', val: 'primary fullsize' } ],
                   children: [ { text: 'Create an account' } ] } ] } ] } ] },
  { tag: 'leaflet',
    is_custom: true,
    script: function() { this.mounted = function(data) {
      showMap(data)
    } 
		} },
  { tag: 'product',
    attr: [ { name: 'class', val: 'media' } ],
    is_custom: true,
    children:
     [ { tag: 'figure',
         children: [ { tag: 'img', attr: [ { name: 'src', fn: _=>((_.image)) } ] } ] },
       { tag: 'section',
         children:
          [ { tag: 'header',
              children:
               [ { tag: 'h1', children: [ { fn: _=>_.title } ] },
                 { tag: 'p', children: [ { fn: _=>_.desc } ] } ] },
            { tag: 'h2', children: [ { fn: _=>_.price } ] },
            { tag: 'deflist',
              attr: [ { name: 'items', fn: _=>_.features, is_data: true } ],
              is_custom: true },
            { tag: 'p',
              children:
               [ { tag: 'button',
                   attr: [ { name: 'class', val: 'primary' } ],
                   children: [ { text: 'Add to bag' } ] } ] } ] } ] },
  { tag: 'dl',
    is: 'deflist',
    children:
     [ { tag: 'template',
         for: { fn: _=>(Object.entries(_.items)), keys: [ 'key', 'val' ], is_entries: true },
         children:
          [ { tag: 'td', children: [ { fn: _=>_.key } ] },
            { tag: 'dd', children: [ { fn: _=>_.val } ] } ] } ] } ]