
# The UNIX of the Web
"Do one thing and do it well". Nue is a shift from monolithic components to architectural sanity. It changes the way you think about web development.


## The kitchen sink problem
React emerged in 2013 to make HTML "reactive". It started small and focused: the first version was just the view layer, deliberately leaving state management and routing to other tools. But then it went on a trajectory nobody could foresee. The ecosystem grew into a mountain of packages beyond anything imaginable. Today, a Next.js project created with `create-next-app` weighs 427MB just to display "Hello, World."

The UNIX tradition has a name for this: kitchen sink software. Codebases that try to do everything inevitably do nothing well. They become unmaintainable, unpredictable, and harder to reason about.

Meanwhile, the web evolved dramatically. The web in 2025 has capabilities that didn't exist in 2013. HTML can describe complex applications. CSS creates real design systems. JavaScript became ES6: practically a new language. Browser APIs handle what once required libraries.

While React stayed on its own path, adding more and more packages. Nue stays close to metal and takes HTML, CSS, and JavaScript to their absolute peak.


## The UNIX way
Nue is a new take on web frameworks. It uses zero external dependencies, every piece handcrafted to integrate perfectly, all focused on delivering the absolute best developer experience.

The result is remarkable: a complete **full-stack development environment in 1MB**. That includes content-focused apps, single-page applications, server-side rendering, hot reloading, syntax highlighting, CloudFlare compatible local dev environment with SQL database, KV database, and more. You'd need both Next.js and Astro to get even close to the feature set.

While an empty Next.js project weighs 427MB, an empty Nue project is just an `index.html` file.


### New performance tier
Nue operates at a completely different performance tier: **Build times** drop from 10+ seconds to 100 milliseconds. **Hot reload** happens in 10ms instead of taking seconds. **Bundle sizes** shrink so dramatically that entire single-page applications weigh less than individual React components.

You get instant feedback loops, dramatically less complexity, fewer bugs, easier debugging with thinner stack traces, and easier to maintain products.


### Rapid application development
React's component model encourages everything-in-one thinking. Your application code becomes another kitchen sink: business logic mixed with styling mixed with markup mixed with data fetching.

Nue enforces architectural clarity. System code (logic, data, design) stays separate from application code (structure and content). Your SPAs focus solely on HTML structure. Your marketing pages become pure content.

The result: codebases that are easier to understand, maintain, and scale. You build applications by assembling pieces, not debugging JavaScript monoliths.


## Standards are forever
The biggest tragedy in React is technical debt. Remember Redux? Higher-Order Components? Class components? Enzyme? Each solving problems that exist in the React ecosystem only, now forgotten and replaced with the next trend. Skills you learn today risk becoming obsolete in 2-3 years.

Web standards persist. HTML from 2006 still works. CSS only grows more powerful. JavaScript remains the language of the web. These skills compound over decades to come.

Products built on standards remain fresh forever. Your investment in web fundamentals never expires.

