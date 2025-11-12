
import { createTree } from '../src/tree'
import { build } from '../src/build'

process.chdir('tree')


afterAll(() => process.chdir('..'))


test.skip('base home', async () => {
  const tree = createTree()
  await tree.load()
  await build({ only: ['.css'], verbose: true, tree })
})