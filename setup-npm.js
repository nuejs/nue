import { readdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

for (const pkg of readdirSync('packages').map(d => join('packages', d, 'package.json'))) {
    if (!existsSync(pkg)) continue
    writeFileSync(pkg, readFileSync(pkg, 'utf8').replaceAll('workspace:*', '*'))
}
