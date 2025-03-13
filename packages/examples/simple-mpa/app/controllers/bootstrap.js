
import { router } from '/@nue/app-router.js'
import { model } from '../model/index.js'
import { mount } from '/@nue/mount.js'


router.configure({
  route: '/app/:type/:filter',
  url_params: ['query', 'id', 'start', 'sort', 'asc', 'shot'],
  session_params: ['plans_opened', 'sizes_opened'],
  persistent_params: ['show_grid_view']
})

model.on('authenticated', async () => {
  await model.load()
  mount('app', window.app)
})

addEventListener('route:app', async function() {
  if (!model.authenticated) mount('login-screen', window.app)
  await model.initialize()
})


// page loaded directly (not through MPA routing)
if (window.app) dispatchEvent(new Event('route:app'))