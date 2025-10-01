
import { parseEntry, getCategory, default as mutate } from './topics'

test('mutate', () => {
  const data = { topics: { first: ['Hello'] }}
  mutate(data)

  expect(data.getTopicCategory).toBeFunction()
  expect(data.topics.first[0].slug).toEqual('hello')
})

test('parseEntry', () => {
  expect(parseEntry('Nue')).toEqual({
    title: "Nue",
    desc: "",
    slug: "nue",
  })

  expect(parseEntry('Foo bar / Some | splat')).toEqual({
    title: "Foo bar",
    desc: "Some",
    slug: "splat",
  })
})

test('getCategory', () => {
  const topics = {
    first: [{ slug: 'foo' }],
    second: [{ slug: 'bar' }],
  }

  expect(getCategory(topics, 'foo')).toBe('first')
})

