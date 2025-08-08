# Server

Development environment for the user's server-side code. Provides runtime compatibility with edge platforms like Cloudflare Workers. Not to confuse with tools/server.js, which is the Nue development server.

## Files

**index.js** - Main entry point. Returns either a local worker runtime or proxy to remote server

**worker.js** - Creates local worker environment that mimics edge runtime APIs

**proxy.js** - Creates proxy to remote server for testing against live environments  

**db.js** - Database interface that mimics Cloudflare D1 in development

**kv.js** - Key-value storage that mimics Cloudflare KV in development

## Usage

The server environment handles your `@system/server/` code during development, providing the same APIs you'll have in production but running locally.

```js
import { getServer } from './server/index.js'

// Get local development runtime
const handler = await getServer()

// Or proxy to remote server
const handler = await getServer({ url: 'https://myapp.com' })
```

Your actual server code goes in `@system/server/` in your project, not here.