
# The Problem: React Monolith
React was supposed to simplify web dev. Instead, it’s a tangled mess we’ve all gotten used to. Open any React app—hundreds, maybe thousands of components, tangled in state, styles, and dependencies. We’ve told ourselves this is just how it works.

It doesn’t have to. The tools we trust are holding us back from what’s possible.

## The Bloat in Numbers
Here’s a basic app—`<h1>Hello, World</h1>` plus a button with an alert dialog—built with React’s best stack (Vite, TypeScript, SWC, Tailwind 4, Shadcn/UI) versus the same thing assembled with Nue:

| Metric | React | Nue | Ratio |
|--------|-------|-----|-------|
| Dependencies | 234 mods, 155MB | 5 mods, 2MB | 77× |
| Config files | 10 files, 126 lines | 1 file, 2 lines | 63× |
| App code | 4 files, 72 lines | 2 files, 12 lines | 6× |
| Dev bundle | 35 reqs, 2.7MB | 5 reqs, 7.7kB | 350× |
| Hot reload | 100-800ms | 5-50ms | 20× |
| Build time | ~2.5s | ~0.09s | 28× |
| Prod bundle | 249kB | 1.7kB | 146× |

In fact, a single React button weighs more than a full-blown Nue single-page application. See for yourself:

![Image: Bar graph—React button (249kB) looms over Nue SPA (117kB), with features like instant search, view transitions, and design systems listed under the SPA bar.]

React drops dialog state on hot reload; Nue holds it steady. That’s friction you feel every day. Check the [full breakdown](compare.html).


## The Real Cost
This isn’t just about code—it’s about you.

### Complexity Creep
A dialog—standard HTML since 2012—takes multiple React components, hooks for state, and a pile of dependencies to update. Every UI bit follows suit—state libraries, form tools, style systems stack up fast. Simple ideas turn into heavy lifting.

### Modularity Myth
React sold us reusable components. What we got? Buttons tied to Tailwind classes, logic stuck in hooks, patterns that only work in React. No clean split between markup, style, or logic—just one big knot. Sharing code means starting over.

### Frontend Fatigue
Builds drag on for seconds. State mazes eat your time. Hot reloads lag behind your changes. You’re not building—you’re babysitting React. New devs learn hooks before the DOM, Redux before CSS. The web gets lost in the shuffle.

### Lost Career Paths
React’s blocking what you could become:

- **Systems Engineering**: Rust engines or clean data models? Tough when logic’s buried in components.

- **Design Engineering**: Systematic design’s gone—Shadcn’s “New York” theme is 40,000 lines of copied classes, not a tight CSS system.

- **UX Engineering**: We’re framework pros, not web experts—building without libraries feels foreign.


## How It Happened
React 1.0 had it right—then it grew into something else.

### A solid start (2013-2015)
It launched with a fresh take: components as state-driven functions, one-way data flow, and a virtual DOM for fast updates. It was “just the view layer”—light, focused, easy to mix with other tech. That simplicity clicked.

### Growing complexity (2015-2019)
State got messy first. Flux kicked it off, then Redux, MobX, and a dozen others piled on—each fixing the last one’s flaws. Build tools followed: Webpack configs bloated, then Vite and friends tried to slim it down, but added new quirks. Styling went wild—CSS-in-JS, styled-components, Tailwind—turning CSS into a React problem. Every fix made the stack taller.

### Hooks (2019)
Hooks dropped—a total rethink. Even Dan Abramov took months to unpack them. Tools scrambled to adapt; old code turned stale fast. It was powerful but steep—suddenly, everything had to bend around this new spine.

### The React Monolith (2020-2024)
Tailwind flipped inline styles into “utility-first” gospel—teams ate it up, class lists ballooned. Then Shadcn and Catalyst turned basics like buttons and dialogs into React-only projects—megabytes of code to mimic what HTML already does. The web became a React filter, not a platform.

What began as a view layer swallowed everything. Web dev’s trickier now than it was ten years ago—and we’ve cheered it on.


## The road ahead
React’s sticking around—big teams and old apps love its stability. But when a button outweighs an app, something’s off. Innovators are breaking free—using the web’s raw power to build leaner, faster, sharper.

[There’s a better way](the-solution.html)

