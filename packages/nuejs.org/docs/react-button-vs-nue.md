
# Details: React button vs Nue SPA
This benchmark compares a single React button component’s full production bundle against a complete Nue single-page application (SPA). Sizes are measured as shown:

[image]
  small: /img/react-button-vs-nue-spa.png
  large: /img/react-button-vs-nue-spa-big.png


## React button
Built with Vite, TypeScript, Tailwind, and Shadcn/UI, following the official [ShadCN/Vite documentation](//ui.shadcn.com/docs/installation/vite) exactly—no additions or removals.

[image]
  small: /img/react-button.png
  large: /img/react-button-big.png
  href: //button.nuejs.org

Production build: [button.nuejs.org](//button.nuejs.org).

Total size: 73.2kb (Vite-optimized, Brotli-compressed).


## Nue single-page application
Built with:
```
bun install nuekit --global
nue create simple-mpa
nue build --production
```

[image]
  small: /img/nue-spa.png
  large: /img/nue-spa-big.png
  href: //mpa.nuejs.org/app/

Production build: [mpa.nuejs.org/app/](//mpa.nuejs.org/app/).


Total size: 39kb (includes all code and SVG icons; excludes JSON data and content images).

[image]
  src: /img/10-largest-scripts.png
  caption: The 10 largest scripts in the app

Excludes XHR (17kb) and content images (8.5kb). Check developer console for details.
