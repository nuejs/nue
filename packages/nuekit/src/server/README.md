
# User server
Development environment for the user's server-side code. Not to confuse with tools/server.js, which is the Nue development server.

## Files

**index.js** - Main entry point. Returns either a local worker runtime or proxy to remote server

**worker.js** - Creates local worker environment that mimics edge runtime APIs

**proxy.js** - Creates proxy to remote server for testing against live environments  

**env.js** - Simplified mocks for real server models (done later)



