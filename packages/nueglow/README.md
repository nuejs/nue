
# Nueglow: CSS first syntax highlighting
Nueglow is syntax highlighting that works with your design system. It generates semantic HTML that your CSS can style. One minuscule highlighter for all languages.


<a href="https://nuejs.org/blog/nueglow">
  <img src="https://nuejs.org/img/glow-dark-big.png"></a>


## The highlighter problem
Popular syntax highlighters can be troublesome:

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

<img src="https://nuejs.org/img/glow-light-big.png">


See the [Nue website](https://nuejs.org/docs/nueglow) for details and documentation.
