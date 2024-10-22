
### Data
Each page is backed with different kinds of data:



## Front matter
You can pass optional [settings and metadata](settings.html) in the "front matter" section of the page. This is the first thing in your file between triple-dashed (`---`) lines taking a valid YAML format:


```yaml
\---
title: Page title
desc: Page description for search engines
og: /img/hero-image.png
\---
```



### Data inheritance
If you include assets in several levels, the values of include statements are *concatenated* into one single array. The matches are partial so that a value such as "syntax" will match both "syntax-highlight" and "syntax-extras".

```yaml
include: [syntax-highlight, video]


[image.gridpaper]
  small: /img/dependencies.png
  large: /img/dependencies-big.png
  size:   747 × 378 px
```

Here's a more complex example that gives you an idea how dependencies are calculated:

[image.gridpaper]
  small: /img/libraries.png
  large: /img/libraries-big.png
  size:  747 × 591 px
