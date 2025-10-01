
# The UNIX of the Web
Web development became complicated. Hundreds of packages, gigabytes of dependencies, hours of configuration before writing a single line of code. We forgot that it doesn't have to be this way.

Nue brings back the fundamentals: HTML for structure, CSS for design, JavaScript for logic. But taken to their absolute peak with modern capabilities.


## How web development should work
**Content sites:** Write Markdown, add layouts, deploy. No build tools, no framework lock-in.

**Single-page apps:** Write HTML with reactive expressions. Add business logic in pure JavaScript. Style with a design system.

**Backend:** Standard Request/Response APIs that work locally and on the edge. No platform-specific adapters.

**Full stack:** Everything works together in 1MB. Content sites, SPAs, server routes, databases, hot reload.

One tool. Zero dependencies. Complete system: The UNIX philosophy applied to web development.


## The kitchen sink problem
React emerged in 2013 to make HTML "reactive". It started small and focused: the first version was just the view layer, deliberately leaving state management and routing to other tools. But then it went on a trajectory nobody could foresee. The ecosystem grew into a mountain of packages beyond anything imaginable. Today, a Next.js project created with `create-next-app` weighs 427MB just to display "Hello, World."

The UNIX tradition has a name for this: kitchen sink software. Codebases that try to do everything inevitably do nothing well. They become unmaintainable, unpredictable, and harder to reason about.

Meanwhile, the web evolved dramatically. The web in 2025 has capabilities that didn't exist in 2013. HTML can describe complex applications. CSS creates real design systems. JavaScript became ES6: practically a new language. Browser APIs handle what once required libraries.

While React stayed on its own path, adding more and more packages, Nue stays close to metal and takes HTML, CSS, and JavaScript to their absolute peak.


## Why this matters

**Instant feedback:** Build times in milliseconds, not seconds. Hot reload across all assets in 10ms.

**Tiny bundles:** Complete SPAs smaller than individual React components. Marketing sites under 30KB.

**Clear architecture:** Business logic separated from design separated from content. Each layer scales independently.

**Standards-based:** HTML, CSS, and JavaScript that work everywhere. No framework APIs to learn, no migration paths to navigate.


### Standards are forever
The biggest tragedy in React is technical debt. Remember Redux? Higher-Order Components? Class components? Enzyme? Each solving problems that exist in the React ecosystem only, now forgotten and replaced with the next trend. Skills you learn today risk becoming obsolete in 2-3 years.

Web standards persist. HTML from 2006 still works. CSS only grows more powerful. JavaScript remains the language of the web. These skills compound over decades.

Products built on standards remain fresh forever. Your investment in web fundamentals never expires.


## Who this is for

**Solo developers** building client projects who want to 10x their output.

**Technical founders** who need to ship products fast without framework overhead.

**Full-stack developers** who prefer backends but need admin interfaces.

**Agencies** delivering custom dashboards to small businesses.

**Anyone** who remembers when web development was straightforward and wants that back.


## Try it

```bash
bun install -g nuekit
nue create blog
cd blog
nue
```