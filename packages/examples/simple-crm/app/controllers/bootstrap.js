
import { router } from '/@nue/app-router.js'
import { model } from '/model/index.js'
import { mount } from '/@nue/mount.js'


router.configure({
  route: '/:type/:filter',
  params: ['query', 'id', 'start', 'sort', 'asc', 'grid', 'shot']
})

model.on('authenticated', async () => {
  await mount('load-screen', window.app)
  await model.load()
  mount('app', window.app)
})


if (!model.authenticated) mount('login', window.app)

await model.initialize()
