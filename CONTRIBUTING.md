

# Contributing to Nue
Nues's codebase has two distinct parts:

* The reactive client is under [src](src) directory
* Server parts are under [ssr](ssr) directory (SSR: "Server Side Rendering")

[Bun](//bun.sh) is the preferred test and development environment because it's noticeably faster than Node or Deno.


## Best practises

1. If you are adding a new feature, please add a test. If you are fixing a bug, please add a test that fails before your fix and passes after your fix.

2. Nue is a minimalistic project. The goal is to stay lean in all areas of development. Keep things simple and depend on as little dependencies as possible.

3. JavaScript is preferred over TypeScript because of minimalism, dynamic typing and it's standards-based. TypeScript should be used if there is a clear use case or a problem it solves.

4. New features add complexity. They must always be discussed before implemented.

### Running server test
Nue uses [Bun](//bun.sh) for running tests:

1. Go to root directory: `cd nuejs`
2. Run `bun test`


### Running client tests

1. Go to root directory: `cd nuejs`
2. Start a web server, for example: `python -m SimpleHTTPServer`
2. Open a test page. Either [basics][basics] or [loops][loops]

[basics]: http://localhost:8000/test/client/basics.html
[loops]: http://localhost:8000/test/client/loops.html


## FAQ

### Why not the `===` operator? [equality]
Strict typing is rarely needed in dynamically typed languages. Loose typing (`==`) is usually enough.


### Why not semicolons or double quotes?
Semicolons are optional and double is literally 2x. Less is more.

### Why not TypeScript?
This is answered on our [general FAQ page](//nuejs.org/faq/#ts)


