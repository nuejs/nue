import { compileFile } from '../index.js'


for (const name of ['basics', 'loops']) {
  const to = `dist/${name}.js`
  await compileFile(`client/${name}.dhtml`, to)
  console.log('created', `test/${to}`)
}
