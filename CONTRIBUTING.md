

# Contributing to Nue
Nues JS codebase has two distinct parts:

* The reactive client is under [src](src) directory
* Server parts are under [ssr](ssr) directory (SSR: "Server Side Rendering")

[Bun](//bun.sh) is the preferred test and development environment because it's noticeably faster than Node or Deno.


## Guidelines

1. *Most important:* If you are adding a new feature, please discuss it first by creating a new issue with a tag "New feature". This way you avoid doing redundant work, because not all features are automatically accepted. Nue JS strives for minimalism.

2. Features that add lots of new code, complexity, or several new/heavy NPM packages are most likely rejected.

3. If you are fixing a bug, please add a test that fails before your fix and passes after your fix.

3. The code is written in JavaScript (Not TypeScript).


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


