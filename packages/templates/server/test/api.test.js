
import { getItems, getItem } from '../src/api'

test('getItems', async () => {
  const items = await getItems('dark.design')
  expect(items.length).toBeGreaterThan(1)
})


test('getItem', async () => {
  const item = await getItem('dark.design', 'monochrome')
  expect(item).not.toBeNull()
})