
# Performance optimization
Nue gives you performance figures of a text-only website without compromising on design. That is: "as fast as you can get".

## Minimalism
Lean means fast. We recommend you to develop your site with [Nue CSS best practices](css-best-practices.html) to get the cleanest and smallest codebase possible with least amount of bloat. It's quite easy to accomplish significant differences on what your codebase looks like. For example, here is Next.js documentation area compared to this one:

[image.bordered]
  small: /img/docs-sizes.png
  large: /img/docs-sizes-big.png



## Inline CSS
Inline CSS means that the CSS code is packaged together with the HTML so that the initial request has everything to render the landing page. This is, by far, the most important optimization that you can do for your landing pages:

[image.bordered]
  small: /img/first-paint.png
  large: /img/first-paint-big.png
  width: 650

You can enable CSS inlining on the page's front matter as follows:

```
inline_css: true
```

Setting this globally is also possible, but then you need to re-compile all pages every time you edit a CSS file that is shared between the pages. For this reason, it's advisable to configure this for your most popular landing pages only. This website, for example, is only using the setting on the front page.


## View transitions
The next most important performance setting is to enable view transitions.
This causes your pages to load significantly faster, and the page is transitioned to another in an animated way.

You can enable view transitions globally in the `site.yaml` file:

```
view_transitions: true
```

Nue transitions are fast and smooth because it uses several optimizations made possible with the global design system: like partial diff/replacement of page segments and CSS enable and disable. You can [customize the transition](reactivity.html#view-transitions) with CSS.


## Caching
Nue minifies your CSS and JavaScript but does *not* bundle them into one big file so you can take advantage of [HTTP ETags](//developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) and expiry headers when deploying your files to production:

[image.bordered]
  small: /img/cache-friendly.png
  large: /img/cache-friendly-big.png
  label: Only load files that have changed
  width: 500

This way only the files that have changed need to be fetched from the server causing fewer transferred bits.

Note that caching and bundling are minor tweaks compared to what you can achieve with inlined CSS and view transitions. This website, for example, uses a very trivial configuration with 10-minute expire headers on all JS and CSS so that caching is only active within one visit, but all flies are loaded fresh for every new visit.


