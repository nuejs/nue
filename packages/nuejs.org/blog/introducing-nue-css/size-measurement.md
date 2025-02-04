---
date: 2024-03-22
title: Introducing Nue CSS
desc: A scalable alternative to Tailwind, BEM, and CSS-in-JS
thumb: glow-thumb.jpg
unlisted: true
---


# CSS size measurement
CSS size details for the [comparison graphs](.#size-graphs)


## Tailwind sizes

[tailwind-table]

- The sizes calculated by grabbing the code from [Tailwind Play](//play.tailwindcss.com/) and minifying it with [Lightning CSS](//lightningcss.dev/)

- **DSL** refers to "domain specific language", which is the inline styling (utility classes + expressions) inside the class name attribute


## Nue sizes

[size-table]

### File list

[css-files]

You can see the size details by running `nue --production stats .css` on your project directory:

[image]:
  small: /img/nue-stats.png
  large: /img/nue-stats-big.png
  width: 400

All files are minified with Lightning CSS


[Back to the article](.)
