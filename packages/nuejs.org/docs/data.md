
# Data
Three kinds of data

1. Page metadata: title, description, date, author, og:image...
2. Application data: products, team members, navigation, ...
3. Settings





## Why YAML?
Nue uses YAML as the primary data format. Human friendly. Good for all team members, while formats like TOML or JSON are better for strict typing, but they fail with expressivity, speed of writing, and readability.


### Data propagation
If you include assets in several levels, the values of include statements are *concatenated* into one single array. The matches are partial so that a value such as "syntax" will match both "syntax-highlight" and "syntax-extras".

```yaml
include: [syntax-highlight, video]
```

[image.gridpaper]
  small: /img/dependencies.png
  large: /img/dependencies-big.png
  size:  747 × 378 px

Here's a more complex example that gives you an idea how dependencies are calculated:

[image.gridpaper]
  small: /img/libraries.png
  large: /img/libraries-big.png
  size:  747 × 591 px


## Front matter
You can pass optional [settings and metadata](settings.html) in the "front matter" section of the page. This is the first thing in your file between triple-dashed (`---`) lines taking a valid YAML format:


```yaml
\---
title: Page title
desc: Page description for search engines
og: /img/hero-image.png
\---
```
