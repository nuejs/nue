
import { router } from '/@nue/app-router.js'
import { model } from '/model/index.js'
import { mount } from '/@nue/mount.js'

await model.init()
router.setup('/:type/:filter', ['query', 'id', 'start', 'sort', 'asc'])
mount('app', document.querySelector('.app'))