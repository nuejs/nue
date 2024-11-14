import { tests } from 'commonmark-spec'
import { nuemark } from '../index.js'

tests.forEach(v => {
    v.markdown = v.markdown.replaceAll('→', '\t').trimEnd()
    v.html = v.html.replaceAll('→', '\t').trimEnd()
})

const skipSections = ['Tabs', 'Indented code blocks', 'Raw HTML', 'HTML blocks']
const skipNumbers = []

for (const testCase of tests) {
    if (skipSections.includes(testCase.section) ||
        skipNumbers.includes(testCase.number)) continue

    test(`cmark spec: ${testCase.section}; ${testCase.number}`, () => {
        console.log(testCase.number, JSON.stringify(testCase.markdown))
        expect(nuemark(testCase.markdown)).toEqual(testCase.html)
    })
}
