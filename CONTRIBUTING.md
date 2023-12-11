
# Contributing to Nue

First and foremost: thank you for helping with Nue! ❤️❤️


### Guidelines

1. **Most important** If you are adding a new feature, please discuss it first under /issues. This way you'll avoid doing redundant work because not all features are automatically accepted. Nue JS strives for minimalism, which means that we have to say "no" to most things.

2. Features that add lots of new code, complexity, or several new/heavy NPM packages are most likely rejected. Most definitely if the first guideline wasn't applied.

3. Please create only one thing per pull request. Easier to validate and merge. And less potential for conflicts.

3. Please add a test case for every bug fix fix

3. Please write JavaScript. No TypeScript here, because Nue aims to work as close to web standards as possible.


### Formatting
Please try to use the original style in the codebase. Do not introduce new rules or patterns. The most notable rules are:

1. No semicolons, because they are redundant

2. Strings with single quotes

3. Indent with two spaces

4. Prefer `==` over `===`. Only strict equality only when truly needed, which is rarely

Nue is not using Prettier or ESLint because they will increase the project size to 40MB. The `.prettierrc.csj` file on the root directory does the job well enough.





