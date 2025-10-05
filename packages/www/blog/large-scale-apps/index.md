---
title: Apps lighter than a React button
description: Nue is HTML, CSS, and JavaScript taken to their absolute peak.
date: 2025-04-01
---

On this release, we’re showing what happens when you push modern web standards — HTML, CSS, and JS — to their peak:

[video-player]
  videoId: 39b76cca-e55b-4e9b-8583-b053f9dbd55d
  poster: thumbnail_70d8de32.jpg
  width: 704
  height: 407


This entire [app](//mpa.nuejs.org/app/) is _lighter_ than a React/ShadCN button:

[image]
  small: react-button.png
  large: react-button-big.png
  size:  704 × 394


## Going large-scale
Here’s the same app, now with a **Rust** computation engine and **Event Sourcing** for instant search and other operations over **150,000** records — far past where [JS-version](//github.com/nuejs/nue/blob/master/packages/examples/simple-mpa/app/model/engines/javascript.js) of the engine crashed with a maximum call stack exception.

[video-player]
  videoId: eb65fcdd-5be4-4923-a783-f41efafe58a7
  poster: ./rust-splash.png
  width: 704
  height: 440

In the [above demo](//mpa.nuejs.org/app/?rust) you can see instant operations across 150,000 records with Rust/WASM


## Here's what this means


### For Rust, Go, and JS engineers

This is a game-changer for Rust, Go, and JS engineers stuck wrestling with React idioms instead of leaning on timeless software patterns. Nue emphasizes a model-first approach, delivering modular design with simple, testable functions, true static typing, and minimal dependencies. Nue is a liberating experience for system devs whose skills can finally shine in a separated model layer.


### For design engineers
This is an important shift for design engineers bogged down by React patterns and [40,000+ line][new_york] design systems. Build radically simpler systems with modern CSS (@layers, variables, calc()) and take control of your typography and whitespace.


### For UX Engineers

This is a wake-up call for UX engineers tangled in React hooks and utility class walls instead of owning the user experience. Build apps as light as a React button to push the web — and your skills — forward.


## FAQ: WTH is Nue?
Nue is a web framework focused on web standards, currently in active development. I'm aiming to reveal the hidden complexity that’s become normalized in modern web development. When a single button outweighs an entire application, something’s fundamentally broken.

Nue drives the inevitable shift. We’re rebuilding tools and frameworks from the ground up with a cleaner, more robust architecture. Our goal is to bring back the joy of web development for everyone — whether you’re focused on performance, design, or UX.


[new_york]: //github.com/shadcn-ui/ui/tree/main/apps/v4/registry/new-york-v4