
# Optimization
Nue helps you reach performance levels of a text-only website, but without compromising on design.


## Inline your CSS
Inline CSS means that the CSS code is packaged together with the HTML, so that the initial request has everything to render the landing page. This is, by far, the most important optimization that you can do for your landing pages:

[image.bordered]
  small: /img/first-paint.png
  large: /img/first-paint-big.png
  width: 650

You can enable CSS inlining on your page's front matter section as follows:

```yaml
inline_css: true
```

Setting this globally is also possible, but then you must remember to re-build all pages every time you edit a CSS file that is shared between the pages. For this reason, it's advisable to configure this for your most popular landing pages only. This website, for example, is only using the setting on the main landing pages reachable from the global navigation.



## View transitions
The next most important performance setting is to enable view transitions. This makes significantly faster (and smoother) page switches after the landing page has been loaded. You can enable view transitions globally in the `site.yaml` file:

```yaml
view_transitions: true
```

View transitions are fast and smooth because Nue uses several optimizations techniques like partial diff/replacement of page segments and the ability to enable and disable linked stylesheets instead of re-loading them.


## Minimalism
Leaner sites are faster. We recommend you to develop your site with [Nue CSS best practices](css-best-practices.html) to get the cleanest and smallest codebase possible with the least amount of bloat. It's quite easy to stay lean with Nue. For example, here is the Next.js documentation area compared to this one:

[image.bordered]
  small: /img/docs-sizes.png
  large: /img/docs-sizes-big.png



### Excluding assets { #exclude }
Use `exclude` configuration setting to strip out unneeded styles and scripts from your applications and pages:


```yaml
exclude: [syntax-highlight, video]
```

This allows you to strip CSS and scripts from the request and reduce the payload.


## Caching
Nue minifies your CSS and JavaScript but does *not* bundle them into one big file so you can take advantage of [HTTP ETags](//developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) and expiry headers on your hosting provider:

[image.bordered]
  small: /img/cache-friendly.png
  large: /img/cache-friendly-big.png
  label: Only load files that have changed
  width: 500

This way only the files that have changed need to be fetched from the server causing fewer transferred bits.

Caching and bundling are minor tweaks compared to what you can achieve with inlined CSS and view transitions. This website, for example, uses a very trivial configuration with 10-minute expire headers on all JS and CSS so that caching is only active within one visit, but all files are loaded fresh for every new visit.


