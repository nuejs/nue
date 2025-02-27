
import { router } from '/@nue/app-router.js'
import { model } from '../model/index.js'
import { mount } from '/@nue/mount.js'


router.configure({
  route: '/app/:type/:filter',
  params: ['query', 'id', 'start', 'sort', 'asc', 'grid', 'shot']
})

model.on('authenticated', async () => {
  // mount('load-screen', window.app)
  await model.load()
  mount('app', window.app)
})

addEventListener('route:app', async function() {
  if (!model.authenticated) mount('login', window.app)
  await model.initialize()
})


// page loaded directly (not through MPA routing)
if (window.app) dispatchEvent(new Event('route:app'))