
# Nueglow: CSS first syntax highlighting
Nueglow is syntax highlighting that works with your design system. Itt generates semantic HTML that your CSS can style. One minuscule highlighter for all languages.

[image.large]
  caption: 30+ languages highlighted. Click for standalone demo.
  large: /img/glow-og-big.png
  small: /img/glow-og.png
  href: /glow-demo/


## The highlighter problem
Popular syntax highlighters have issues:

**Massive codebases** - tools like Shiki ship 14MB and 44 packages. Each language needs its own grammar file with thousands of cryptic regex rules.

**Theme lock-in** - Themes come as giant JSON files with 300+ predefined colors. You can't easily adapt them to your brand or design system.

**Grammar complexity** - HTML grammar alone has 2000+ lines of regex patterns. Adding a new language means wiring another massive grammar file.

These syntax highlighters were built for code editors, not websites. They assume you want their themes and their markup. Your design system becomes an afterthought.


## Why Nueglow

**Universal language support** - Works with JavaScript, TypeScript, Python, HTML, CSS, YAML, JSON, Markdown, Bash, SQL, and virtually any other syntax. No grammar files needed.

**Language-agnostic parsing** - Instead of per-language rules, Nueglow recognizes common patterns: strings, comments, keywords, operators. This works across all programming languages.

**Semantic HTML output** - Keywords become `<b>`, strings become `<em>`, comments become `<sup>`. Your CSS controls the appearance.

**Design system friendly** - Only 10-15 HTML elements to style. Fits naturally into any design system without fighting existing patterns.

**Lightweight** - Complete highlighting for all languages in under 3KB of CSS. No JavaScript runtime, no theme bundles.

[image.larger]
  small: /img/glow-light.png
  large: /img/glow-light-big.png
  href: /glow-demo/light.html
  caption: Light mode styling across 30+ languages

## How it works

Nueglow generates clean, semantic HTML:

```html
<pre>
  <code language="javascript">
    <b>const</b> total <i>=</i> items<i>.</i><strong>reduce</strong><i>((</i>sum<i>,</i> item<i>)</i> <i>=></i> <i>{</i>
      <b>return</b> sum <i>+</i> item<i>.</i>price
    <i>},</i> <em>0</em><i>)</i>
  </code>
</pre>
```

Your CSS defines the appearance:

```css
pre {
  b { color: var(--keyword) }     /* Keywords */
  em { color: var(--value) }      /* Values */
  i { color: var(--punct) }       /* Punctuation */
  sup { color: var(--comment) }   /* Comments */
}
```

Change your color variables and every code block updates instantly. No theme switching, no configuration files.

## Features

**Line highlighting** - Mark specific lines as added, removed, or emphasized

**Region selection** - Highlight code sections with bullet markers

**Line numbers** - CSS counter-based numbering that matches your typography

**Error marking** - Visual indicators for syntax errors or problems

**Language detection** - Automatic recognition from fenced code block languages

**Custom classes** - Add specific styling for different contexts

## Installation

Get started with Nueglow through Nuekit for the full development experience:

```bash
bun install nuekit
```

Or use Nueglow outside the Nue ecosystem with your own site generator:

```bash
bun install nueglow
```

See the [Syntax highlighting reference](/docs/syntax-highlighting) for complete documentation of all features and styling options.