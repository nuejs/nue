
# Migration from Next.js
A step-by-step migration guide for moving a serious full-stack application from Next.js ecosystem to Nue and web standards. This covers hybrid MPA+SPA architectures with content sites, dynamic applications, and backend integration.

[TOC]

## What to expect

After migration you'll see:

**90% less project scaffolding** - From hundreds of megabytes of NPM modules and dozens of configuration files (TypeScript, ESLint, Tailwind, PostCSS, Webpack) to minimal configuration and zero redundancy.

**Cleaner and smaller codebase** - Similar to simplified project setup, your monolithic components become leaner with architectural clarity. App concerns live in isolated layers that can be managed and scaled independently.

**Lightweight pages and apps** - Order of magnitude smaller footprint across all pages. Content-heavy marketing sites, documentation, blogs, and full single-page applications all become dramatically lighter. We're talking single-page apps that take less bandwidth than a single React button component.

**Faster builds** - Build times drop from seconds to milliseconds. HMR spans all pages, apps, assets, and server routes. Every update takes around 20ms.



## Project setup
When moving to Nue, start with a fresh project structure. The monolithic Next.js architecture where everything lives in components doesn't translate directly to Nue's separated concerns. The focus is on cleaning up the entire architecture rather than porting it file-by-file.

The first step is cleaning up unnecessary NPM modules, project scaffolding, and configuration. This is quite significant in Next.js. An empty Next.js project created with `npx create-next-app@latest` (v15.5) contains 336 packages, 18,666 files, and 427MB. A size of eight Windows 95 installations.

Add a component library like ShadCN and you're at 470MB (9x Windows 95). A typical Next.js project has at least the following configuration files to start with:

```
.
├── app/
│   └── page.tsx
├── components/
│   └── ui/
│       └── button.tsx
├── components.json
├── eslint.config.mjs
├── lib/
│   └── utils.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

With Nue:

```
.
├── index.css
└── index.html
```

**No configuration required.** Nue installs globally with `bun install -g nuekit` and works like a UNIX command (`nue`, `nue build`, `nue --help`). Your project stays clean.

The shift is from configuration theater with third-party syntaxes to minimalism and web standards. You lose no functionality - only complexity. The `index.html` can be dynamic or server-rendered, contain expressions and event handlers, or serve as your SPA entry point. It's a clearer foundation for both developers and AI models to understand and build upon.




## Content
Migrating from monolithic components and MDX to a content-first architecture.


### Next.js: 500MB of redundancy
Since Next.js provides no content authoring tools natively, you need these additional packages for a content-focused site with blogs, documentation, and marketing pages:

```bash
# MDX, MD extensions, content processing and view transitions
npm install @next/mdx @mdx-js/loader @mdx-js/react
npm install gray-matter contentlayer next-contentlayer
npm install remark-gfm rehype-autolink-headings rehype-slug
npm install shiki date-fns next-seo feed next-sitemap
npm install framer-motion
```

This causes your repository size to balloon from 470MB to a whopping 550MB, over 500 times of Nue without even reaching the complete feature set yet.


### Next.js content architecture
After implementing a handful of blog entries, documentation, and marketing pages, your Next.js project structure looks like this:

```
.
├── app/
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── docs/
│   │   ├── [...slug]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── pricing/
│   │   └── page.tsx
│   └── layout.tsx
├── content/
│   ├── blog/
│   │   ├── first-post.mdx
│   │   ├── design-systems.mdx
│   │   └── web-standards.mdx
│   └── docs/
│       ├── getting-started.mdx
│       ├── api-reference.mdx
│       └── deployment.mdx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── badge.tsx
│   ├── blog-post.tsx
│   ├── doc-layout.tsx
│   └── hero-section.tsx
├── lib/
│   ├── content.ts
│   └── utils.ts
├── components/
│   ├── page-transition.tsx
│   └── variants.ts
├── hooks/
│   └── use-router-events.ts
├── contentlayer.config.js
├── next.config.js
├── mdx-components.tsx
├── package.json
├── tsconfig.json
└── [8 other config files...]
```

### Nue migration
Nue gives you the same functionality with this structure:

```
.
├── layout.html
├── components.html
├── docs/
│   ├── layout.html
│   ├── getting-started.md
│   ├── api-reference.md
│   └── deployment.md
├── blog/
│   ├── layout.html
│   ├── first-post.md
│   ├── design-systems.md
│   └── web-standards.md
├── about.md
├── pricing.md
└── index.md
```

### Nue configuration
Enable all the features (collections, RSS feeds, sitemaps, view transitions) with this `site.yaml` config:

```yaml
site:
  view_transitions: true
  sitemap: true

content:
  heading_ids: true
  sections: true

collections:
  blog:
    match: [blog/*.md]
    sort: date desc
    rss: true

  docs:
    match: [docs/*.md]
    sort: order asc
```

This literally drops thousands of lines of code, configuration and scaffoling to get a versatile content engine running  under Next.js.

### Nue benefits

**Massive simplification** - After content migration your file system goes from 30+ files across 8 directories with complex interdependencies to 11 clean files organized by purpose. No routing logic, no component glue code, no build configuration.

**Scalable content** - All pages, from rich front pages to simple blog entries, are editable with pure content. Page development becomes a content project, not a software engineering and TSX debugging project. Writers work independently without breaking builds.

**All features in 1MB** - Syntax highlighting, heading links, collections, RSS feeds, sitemaps, view transitions, responsive images, layout inheritance, and content processing.

**Rich layouts** - With [slots and layout modules](/docs/layout-system), create sophisticated page structures without component hierarchies. Section-specific layouts inherit and override automatically.


## Backend
Migrating your backend infrastructure (server and databases) from third-party APIs to [edge first](/docs/edge-first) approach and web standards.

### Next.js: More packages

The backend landscape is fragmented with options ranging from the complex T3 stack to newer Server Actions. This guide assumes tight integration with the Vercel ecosystem using these dependencies, after which the project size reaches 1.4G:

```bash
npm install @vercel/kv @vercel/postgres
npm install drizzle-orm drizzle-kit
npm install next-auth@beta @auth/drizzle-adapter
npm install @types/node
```

This requires at least the following TypeScript configuration files:

```
.
├── drizzle.config.ts     # Database schema config
├── auth.config.ts        # Auth.js configuration
├── middleware.ts         # Route protection
├── .env.local           # Database URLs and secrets
├── lib/
│   ├── auth.ts          # Auth setup
│   ├── db.ts            # Database connection
│   └── schema.ts        # Drizzle schema
├── app/api/
│   ├── auth/[...nextauth]/
│   └── users/
│       └── route.ts     # API endpoints
└── __tests__/
    ├── auth.test.ts
    └── api.test.ts
```

### Next.js: Non-standard APIs

Your server code becomes tightly coupled to framework abstractions:

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { users } from "@/lib/schema"
```

These are proprietary APIs, not web standards. Your code only works within the Next.js ecosystem.

### Nue migration
Nue skips NPM installs and configuration files. Jump straight to development using the global 1MB nue executable:

```
server/
├── index.js             # Server routes
├── db/                  # Database files
│   ├── app.db           # SQLite database
│   ├── kv.json          # KV store data
│   └── init/            # Schema and sample data
├── model/               # Business logic
│   ├── auth.js          # Authentication
│   ├── index.js         # Data operations
│   └── utils.js         # Utilities
└── test/                # Test suites
    ├── mock.js          # Mock environment
    ├── model.test.js    # Business logic tests
    └── server.test.js   # Integration tests
```

### Nue server setup
Configure the entire system centrally in `site.yaml

```yaml
server:
  dir: server          # Server directory
  db: db/app.db        # SQL database location
  kv: db/kv.json       # KV database location
  reload: true         # Server route HMR
```

### Edge first

Write code that works identically locally and globally:

```js
// Authentication middleware
use('/admin/*', async (c, next) => {
  // Same API locally and on CloudFlare Edge
  const { KV, DB } = c.env

  // CloudFlare headers work locally too
  const country = c.req.header('cf-ipcountry')

  const user = await KV.get(`session:${sessionId}`, { type: 'json' })
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  await next()
})

// API routes with standard Request/Response
get('/api/users', async (c) => {
  const { DB } = c.env
  const users = await DB.prepare('SELECT * FROM users').all()
  return c.json(users)
})
```

### Nue benefits

**90% less boilerplate** - No TypeScript configs, no authentication setup files, no database connection boilerplate, no middleware configuration.

**Edge first architecture** - Server routes, KV storage, and SQL databases work seamlessly locally and globally with identical APIs.

**Integrated development** - Frontend and backend on same port with `nue dev`. Instant startup, built-in HMR for all server routes and database changes.

**Web standards** - Work with standard `Request`/`Response` objects, not framework abstractions. Code that runs anywhere.



## Business logic
On this step, our goal is to build an isolated, testable business logic layer that works independently of any UI framework. We use plain JavaScript or TypeScript to create a portable model that is free from frontend concerns.


### Next.js: More packages
Next.js has no notion of a decoupled business logic layer. Instead there are multiple options to integrate business logic into your components. Tools like Redux Toolkit, RTK Query and Formik. Or SWR, Valtio, and React Final Form. However the most popular stack currently is likely TanStack Query, Zustand and React Hook Form. This has become the de facto standard for modern React applications in 2024-2025. So let's add some more packages:

```bash
npm add @tanstack/react-query zustand react-hook-form
npm add -D @tanstack/react-query-devtools
npm add @hookform/resolvers zod
```

### Next.js: Non-standard APIs
With Next.js you are using non-standard APIs and mixing business logic, state management, framework patterns, and rendering together:

```jsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(1, 'Name required'),
  // validation rules...
})

export default function UserProfile({ userId }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json())
  })

  const updateMutation = useMutation({
    mutationFn: (data) => fetch(`/api/users/${userId}`, {
      method: 'PUT',
      // API logic...
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userId])
      // cache invalidation logic...
    }
  })

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))}>

      // rendering logic ...
      </form>
    </div>
  )
}
```

This approach tangles business logic with UI concerns. Data fetching, validation, caching, and rendering all live in the same component. Testing becomes complex (or impossible) because you can't test business logic without mounting React components.


### Nue migration
Nue separates business logic into pure, testable modules. Your application model lives independently of any UI framework:

```
@shared/
├── app/
│   ├── index.js          # Main app exports
│   ├── users.js          # User operations
│   ├── payments.js       # Payment processing
│   └── analytics.js      # Analytics tracking
└── test/
    ├── users.test.js     # Unit tests
    ├── payments.test.js
    └── analytics.test.js
```

Configure the import map in `site.yaml`:

```yaml
import_map:
  app: /@shared/app/index.js
```

### Pure business logic
The application code is pure JavaScript with no frontend concerns:

```js
// snippet from `nue create full`
export async function login(email, password) {
  const ret = await post('/api/login', { email, password })
  localStorage.$sid = ret.sessionId
}

export async function postContact(data) {
  return await post('/api/contacts', data)
}

export async function getContacts(params) {
  return await get('/admin/contacts', params)
}
```

### Nue benefits

**Architectural clarity** - Business logic, data operations, and validation live separately from UI components. Each layer can be developed independently.

**Testability** - Unit test your application logic without mixing frontend concerns. Pure functions are trivial to test.

**Portability** - Your business model works with any UI layer. Migrate from React to Vue to vanilla JavaScript (or TypeScript) without rewriting core application logic.

**Future-proof architecture** - Pure JavaScript stays relevant forever. No trendy frontend tools risk making your model outdated.

**Advanced possibilities** - Decoupling enables ambitious logic engines built in Rust or Go, like those from Figma or Notion.




## UI development
On this step, we migrate all React components into clean, semantic HTML and detach all business logic and styling, leaving the code focused on structure only. This makes UI development similar to content development: rapid assembly of interfaces.

### Next.js: Mixed concerns
React components mix business logic, styling, data fetching, validation, and rendering together in a single file. For example:


```jsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Validation schema mixed with UI component
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {

  // State management hooks scattered throughout component
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Form validation library integration
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  // Business logic embedded in component
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      // API call logic mixed with component
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return response.json()
    }
  })

  // Event handlers with side effects
  const onSubmit = async (data: LoginFormData) => {
    // Authentication logic inside UI component
    await loginMutation.mutateAsync(data)
    router.push('/app/')
  }

  // Styling through utility classes and pre-built components
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="w-full">
          <CardHeader>
            // Semantic HTML buried under framework abstractions
            <CardTitle className="text-2xl font-bold text-center">
              Sign in to your account
            </CardTitle>
          </CardHeader>

          // etc...

        </Card>
      </div>
    </div>
  )
}
```

This monolithic component mixes concerns together:

- **Business logic** - API calls, authentication, token storage
- **Styling** - Tailwind classes, conditional styling, layout positioning
- **Validation** - Zod schemas, form validation, error handling
- **State management** - Multiple useState hooks, useEffect lifecycle
- **UI structure** - Form elements, labels, buttons buried in framework abstractions

There are almost as many ways to create a React form as there are developers, because the tools and patterns evolve quickly. So this example might not represent "idiomatic" React, but it demonstrates the fundamental issue: concerns are inevitably mixed together.


### Nue: Semantic HTML
Nue separates UI structure from all other concerns. Components focus purely on semantic HTML and user interactions:

```html
<script>
  import { login } from 'app'
</script>

<form :onsubmit="submit">

  <!-- UI code goes here-->
  <label>
    <h3>Email</h3>
    <input name="email" type="email" value="admin@example.com"
      autofocus autocomplete="email" class="fullsize">
  </label>

  <label>
    <h3>Password</h3>
    <input name="password" type="password" value="demo123"
      autocomplete="current-password" class="fullsize">
  </label>


  <!-- event handlers here  -->
  <script>
    async submit(e) {
      const { email, password } = e.target

      try {
        // handlers call methods in your business model
        await login(email, password)
        location.href = '/app/'

      } catch (error) {
        this.update({ error: 'Invalid credentials' })
      }
    }
  </script>

</form>
```

### Nue benefits


**Standards first** - Components use semantic HTML elements (`<form>`, `<table>`, `<button>`) instead of framework abstractions.

**Immediate productivity** - New team members can contribute immediately. HTML knowledge transfers directly.

**Application assembly** - With concerns separated, building interfaces becomes assembly work. Import business functions, write semantic HTML, let the design system handle presentation.

**Future-proof** - HTML semantics outlast frameworks. Your `<form>` elements will work in browsers 20 years from now. React components from 2020 already feel outdated.



### Styling
Styling is the most important migration point for building maintainable and scalable products. This final migration step moves from hardcoded styling monoliths to a modern standards-based [design system](/docs/design-systems).


### Next.js: hardcoded styling
The React ecosystem promotes mixing styling directly into components. While multiple approaches exist, the current trend seems to combine Tailwind, ShadCN/UI, clsx, and tailwind-merge. Something like this:

```jsx
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function ProductCard({ product, isFeature, variant, className }) {
  return (
    <div className={cn(
      "bg-white border rounded-lg p-4 shadow-sm",
      isFeature && "border-blue-500 shadow-blue-100",
      variant === "compact" && "p-2",
      variant === "featured" && "border-2 shadow-lg",
      className
    )}>
      <h3 className={cn(
        "font-semibold text-gray-900",
        isFeature && "text-blue-700",
        variant === "compact" && "text-sm"
      )}>
        {product.name}
      </h3>
      <button className={cn(
        "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700",
        isFeature && "bg-gradient-to-r from-blue-600 to-purple-600",
        variant === "compact" && "px-2 py-1 text-sm"
      )}>
        Add to Cart
      </button>
    </div>
  )
}
```

This approach stems from fears of global namespace pollution, desire for co-location, and challenges with naming conventions. Every component becomes a styling puzzle requiring utility memorization and merge logic.


### Nue: design system
Nue embraces minimal and semantic design systems that are centrailly maintained. You can return to clean, isolated CSS code structured as a proper system and avoid all problems that drove developers to CSS-in-JS:

```
@shared/design/
├── base.css         # Typography, colors, spacing
├── button.css       # All button variants
├── content.css      # Blog posts, documentation
├── dialog.css       # Modals, popovers
├── document.css     # Page structure
├── form.css         # All form elements
├── layout.css       # Grid, stack, columns
├── syntax.css       # Code highlighting
├── table.css        # Data tables
└── apps.css         # SPA-specific components
```

The same product card becomes pure structure:

```html
<article class="card featured">
  <h3>{ product.name }</h3>
  <button>Add to Cart</button>
</article>
```

CSS handles all presentation decisions in one place. Variants, states, and responsive behavior live in the design system, not scattered across components.

### Benefits

**Rapid assembly** - Developers focus on structure while the design system ensures consistency. No styling decisions needed during development.

**Central maintenance** - Design changes happen once and cascade everywhere. Rebrand your entire application by updating CSS variables.

**Minimal footprint** - Complete design system runs under 4.3KB, smaller than Tailwind's preflight CSS before adding any utilities.

**Swappable design** - Replace parts of the system or swap entire design languages without touching HTML structure. True separation enables design flexibility.

**Team specialization** - Designers control visual language through CSS. Developers control structure through HTML. Neither blocks the other.



## Migration complete
After following this migration guide, you've transformed a complex Next.js application into a clean, standards-based architecture. The transformation is quite dramatic:

**From 575MB to 1MB** - Your project dependencies dropped from over 450+ NPM packages to a single global installation with zero external dependencies Configuration files reduced from 15+ to one central `site.yaml`.

**From mixed concerns to architectural clarity** - Business logic lives in pure JavaScript modules. Content lives in Markdown files. Design lives in CSS. Structure lives in semantic HTML. Each layer works independently and can scale without affecting others.

**From framework lock-in to web standards** - Your forms use `<form>` elements. Your buttons use `<button>` elements. Your navigation uses `<nav>` elements. The browser understands your application natively. No hydration, no virtual DOM, no framework abstractions between you and the platform.

**From slow to instant feedback loop** - Development builds take milliseconds instead of seconds. Hot reload works across all assets - frontend, backend, and database changes. The feedback loop becomes immediate.

### What you gained

**Maintainability** - Clear separation of concerns makes the codebase easier to understand and modify. New team members can contribute immediately using skills they already have.

**Performance** - Order of magnitude improvements in bundle size, build speed, and runtime performance. Your entire application weighs less than a single React component.

**Future-proofing** - Web standards evolve slowly and deliberately. HTML, CSS, and JavaScript knowledge stays relevant for decades. Your investment compounds over time.

**Team velocity** - Designers control visual language through CSS without touching components. Content creators work independently through Markdown. Developers focus on business logic and structure. Nobody blocks anyone else.



