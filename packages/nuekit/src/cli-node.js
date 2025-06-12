#!/usr/bin/env node

import { run } from './cli.js'
import { esMain } from './util.js'


if (esMain(import.meta.url)) await run()
