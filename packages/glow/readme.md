
<a href="https://nuejs.org/blog/introducing-glow/">
  <img src="https://nuejs.org/img/glow-og.png">
</a>

# Glow
Glow is a syntax highligher for markdown.

[Read the introduction](//nuejs.org/blog/introducing-glow/)


### Get started
Use Glow as a standalone library or together with Nue


#### Standalone library
Install with NPM and and follow [Glow documentation](//nuejs.org/docs/concepts/syntax-highlighting.html)

``` sh
npm i nue-glow
```

#### With Nue

Nue uses Glow in markdown code blocks and it offers [three Nuemark tags](//nuejs.org/docs/reference/nuemark-tags.html#code): `[code]`, `[codeblocks]`, and `[codetabs]` for more advanced usage. Try them out as follows:

``` sh
# Install Bun (if not done yet)
curl -fsSL https://bun.sh/install | bash

# Install website generator (Nuemark playground)
bun install nuekit --global

# Start a Nue project with a Glow-powered template
bun create nue@latest
```

Choose *"Simple blog"* and off you go.