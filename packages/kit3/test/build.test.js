
import { createTree } from '../src/tree'
import { build } from '../src/build'

process.chdir('tree')

const tree = createTree()
await tree.load()

afterAll(() => process.chdir('..'))


test('base home', async () => {
  await build({ only: ['.css'], verbose: true, tree })
})