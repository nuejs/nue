
# Interactive islands
Interactive islands in Nue bring dynamic functionality to static HTML, seamlessly blending into content-first websites. Think of them as small, focused components—like forms, menus, or galleries—that enhance your Markdown or layouts without disrupting the core experience. Built on web standards, islands keep interactivity lightweight and optional, aligning with Nue’s progressive enhancement model.

## Creating islands
Islands use an HTML-based [template syntax](template-syntax.html) stored in `.dhtml` files, identified by the `@name` attribute. Here’s a mailing list form:

```html
<form @name="join-list" @submit.prevent="submit" autocomplete="on">
  <label>
    <span>Your name</span>
    <input type="text" name="name" placeholder="Example: John Doe" required>
  </label>
  <label>
    <span>Your email</span>
    <input type="email" name="email" placeholder="your@email.com" required>
  </label>
  <button>Submit</button>
  <script>
    function submit() {
      // Send the form data with fetch()
    }
  </script>
</form>
```

This form renders as static HTML on the server for SEO and indexing, then becomes interactive on the client with a tiny 2.5kb runtime (`/@nue/nue.js`). The `@submit.prevent` attribute stops default form submission, letting the `submit` function handle it—say, with a `fetch()` call to your backend.

## Using islands
You can drop islands into your content or layouts wherever interactivity is needed.

### In Markdown content
Add an island to a Markdown file:

```md
### Join our mailing list
Be the first to know about our new releases.

[join-list]
```

Nue replaces `[join-list]` with the form’s HTML, ready to work when the page loads. This keeps content authoring simple—writers just use the tag, no HTML required.

### In layout modules
Embed islands in layout templates:

```html
<footer @name="pagefoot">
  <h3>Join our mailing list</h3>
  <p>Be the first to know about our new releases</p>
  <join-list/>
</footer>
```

Here, the island slots into the footer, enhancing the static structure with a functional form. It’s a clean way to mix interactivity into reusable layouts.

## Organization
Islands can live at different levels in your project, depending on where you need them:
- **Global islands**: Store them in `@globals/join-list.dhtml` for use across the entire site—like a universal signup form.
- **Area-specific islands**: Put them in `blog/islands.dhtml` for app-specific features, such as a blog’s comment box.
- **Page-specific islands**: Place them in `blog/post/islands.dhtml` for one-off needs tied to a single page.

A single `.dhtml` file can hold multiple islands. For example, `blog/islands.dhtml` might include a comment form, a share button, and a related posts widget, keeping related functionality together.

## Data access
Islands pull data from multiple sources, keeping logic separate from content:
- **Global data**: From `site.yaml`, like a site-wide title or API endpoint.
- **App data**: From `blog.yaml`, such as a blog’s category list.
- **Page data**: From front matter in `post.md`, like a post’s ID or author.

For the `join-list` form, you might pass a custom button label from front matter:

```md
---
cta: "Sign up now"
---
[join-list cta="{cta}"]
```

The island could then use it:

```html
<button>{ cta || 'Submit' }</button>
```

This flexibility ties islands to your content structure without hardcoding values.

## Isomorphic islands
For SEO-critical interactivity, islands can render on both server and client. Here’s a video player:

```html
<div @name="video-player">
  <noscript>
    <video src="https://video.nuejs.org/{videoId}/play_720p.mp4" controls>
      Your browser does not support the video tag.
    </video>
  </noscript>
  <video-player :videoId="videoId" :poster="poster" :width="width"/>
  <figcaption :if="caption">{ caption }</figcaption>
</div>
```

The `<noscript>` ensures playback for JavaScript-off users, the client-side `<video-player>` adds interactivity (e.g., quality switching), and the caption boosts search visibility—all in one component.
