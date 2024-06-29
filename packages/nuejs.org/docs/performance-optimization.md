
# Performance optimization
Nue gives you performance figures of a text-only website without compromising on design. That is: "as fast as you can get". This requires that your website has been developed according to the [UX development flow](ux-development.html) with design constraints and external CSS.


## Inline CSS
Inline CSS means that the CSS code is packaged together with the HTML so that the initial request has everything to render the landing page. This is, by far, the most important optimization that you can do for your landing pages:

[image.gridpaper]
  small: /img/first-paint.png
  large: /img/first-paint-big.png

You can enable CSS inlining on page's front matter as follows:

```
inline_css: true
```

Setting this globally is also possible, but then you need to re-compile all pages every time you edit CSS file that is shared between the pages. For this reason it's adviseable to configure this for your most popular landing pages only. This website, for example, is only using the setting on the front page.


## View transitions
The next most important performance setting is to enable view transitions.
This causes your pages to load significantly faster, and the page is transitioned to another in animated way.

! video

You can enable view transitions globally in the `site.yaml` file:

```
view_transitions: true
```

Nue transitions are fast and smooth because it uses several optimizations made possible with the global design system: like partial diff/replacement of page segments and CSS enable and disable. You can [customize the transition](motion.html#view-transitions) with CSS.


## Caching
Nue minifies your CSS and JavaScript, but does *not* bundle them into one big file so you can take advantage of etags and/or expiry headers when deploying your files to production:

[image.gridpaper]
  small: /img/cache-friendly.png
  large: /img/cache-friendly-big.png

This way only the files that have changed needs to be fetched from the server causing less transferred bits.

Note that caching and bunling are minor tweaks compared to what you can achieve with inlined CSS and view transitions. This website, for example, uses a very trivial configuration with 10 minutes expire headers on all JS and CSS so that caching is only active within one visit, but all flies are loaded fresh for every new visit.


