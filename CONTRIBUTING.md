
# Contributing to Nue

First and foremost: Thank you for helping with Nue! ❤️❤️


### Guidelines

1. **Most important** If you are adding a new feature, please discuss it first under [GitHub issues](https://github.com/nuejs/nue/issues). This way you'll avoid doing redundant work because not all features are automatically accepted. Nue JS strives for minimalism, which means that we have to say "no" to most things.

2. Features that add lots of new code, complexity, or several new/heavy NPM packages are most likely rejected. Most definitely if the first guideline wasn't applied.

3. Please create only one thing per pull request. Easier to validate and merge. And less potential for conflicts.

4. Please add a test case for every bug fix.

5. Please write JavaScript. No TypeScript here, because Nue aims to work as close to web standards as possible.


### Formatting
Please try to use the original style in the codebase. Do not introduce new rules or patterns. The most notable rules are:

1. No semicolons, because they are redundant

2. Strings with single quotes

3. Indent with two spaces

4. Prefer `==` over `===`. Strict equality only when truly needed, which is rarely the case

Nue is not using Prettier or ESLint because they will increase the project size to 40MB. The `.prettierrc.yaml` file on the root directory does the job well enough.


### Testing

```sh
# if using bun
bun install
bun install --no-save esbuild
bun test

# if using node
npm install
npm install --no-save jest jest-extended esbuild
node --experimental-vm-modules node_modules/jest/bin/jest --runInBand
```


### Linking

```sh
# if using bun
bun install
cd packages/nuekit
bun link
cd my/nue/project
nue
nue build --production

# if using node
npm install
cd packages/nuekit
npm link
cd my/nue/project
npm install --save-dev esbuild
node $(which nue)
node $(which nue) build --production
```
