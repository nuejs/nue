
import { createLog } from '../../src/cli/deploy'

const types = ['html', 'css', 'js', 'webp', 'svg']

const sites = [
  '@base',
  'design/miesian', 'design/ramsian',
  'acme--myagency.nuejs.com', 'beta--myagency.nuejs.com'
]

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// { type, site, }
function createRandomFile() {
  const type = rand(types)
  const site = rand(sites)
  const is_shared = !site.includes('--')
  const size = Math.round(30000 * Math.random())
  return { type, site, size, is_shared }
}

const files = new Array(15).fill(0).map(createRandomFile)

const log = createLog({ version: '3.0.0-beta.1', files })

for (const file of files) {
  await Bun.sleep(150 * Math.random())
  log.fileFinish(file)
}


// CDN purge
log.purgeStart()
await Bun.sleep(1250)
log.purgeFinish()


/*

  nue deploy
  v3.0.0-beta.1 • Bun 1.2.23

   Files
   🔵  HTML                 (17)  • • • • • • • • • • • • • • • • ✓
   🟣  CSS                  (12)  • • • • • • • • • • • ✓
   🟢  WEBP                 (8)   • • • • • • • ✓
   🟢  SVG                  (3)   • • ✓

   Shared
   @base                    (12)  • • • • • • • • • • • • ✓
   designs/miesian          (9)   • • • • • • • • ✓
   designs/ramsian          (4)   • • •

   Sites
   clients/acme             (16)  • • • • • • • • • • • • • • • ✓
   clients/beta             (14)  • • • • • • • • • • • • • ✓

   CDN purge                ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░


   ===
   Pushed 34 files (1.2MB) in 3.5s • Purge time 2.5s (80%)

*/
