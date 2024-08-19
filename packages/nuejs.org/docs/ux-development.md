
# What is UX development?

UX development focuses on the user experience. It starts with the big picture and the general narrative, then moving on to design and design systems, and finally using CSS to convert the design system into a functional website. This role is also known as "design engineer" and the work is sometimes referred to as "design ops".

[image.gridpaper]
  small: /img/ux-development-flow.png
  large: /img/ux-development-flow-big.png
  caption: UX development process
  size: 747 × 236 px

## Content

UX development starts by understanding your audience and figuring out where to take them, and what benefits you can offer. You should figure out your general narrative, the key messaging statements, the tone and voice, and how the content is organized:

[image.bordered]
  small: /img/content-development.png
  large: /img/content-development-big.png
  caption: UX development starts with content design.
  size: 747 × 492 px

This process varies from a large team effort to a simple README file in a local file system. The more you know about your content, the better equipped you are for the next step: Design.

#### More info

- [Steve Jobs: Start with the customer experience](//surveypal.com/blog/steve-jobs-said-it-best-start-with-the-customer-experience/)
- [Balsamiq: Content-First Design](//balsamiq.com/learn/articles/content-first-design/)
- [PixelFridge: The benefits of a content-first approach](//www.pixelfridge.digital/the-benefits-of-a-content-first-approach/)
- [UX Planet: Information Architecture Design](//uxplanet.org/information-architecture-design-a-step-by-step-guide-41dcd4405ee3)

## Design

Once you have a good understanding of your content it's time to create a design system: A set of rules and building blocks that define how the content is visualized.

The content plan defines what goes to your site: The global elements and the content area. The tone and voice determine your look and feel: The use of colors, typography, whitespace, images and videos. Should it all be modern and minimalistic, or perhaps more playful and decorative?

[image.bordered]
  small: /img/figma-design-system.png
  large: /img/figma-design-system-big.png
  size: 747 × 405 px

The size and format of your design system vary a lot depending on the size of your team. Large design-focused organizations usually have everything figured out in **Figma** or **Sketch**. Small projects might go with a simple README file describing the basic rules of the design.

One-person projects can implement the design system directly with HTML and CSS, because that's what you eventually end up doing. This takes you one step closer to the finish line.

#### More info:

- [Figma: What is a design system?](//www.figma.com/blog/design-systems-101-what-is-a-design-system/)
- [The Design System Guide](//thedesignsystem.guide/)
- [Figma: Marketing of design systems](//www.figma.com/blog/the-future-of-design-systems-is-marketing/)

## CSS

Once you know exactly what you want to build, it's time to convert the design system into code. Nue's [global design system](global-design-system.html) allows developers to build websites so that the code is mostly just vanilla CSS that closely mimics what you have designed:

[image]
  small: /img/figma-to-css.png
  large: /img/figma-to-css-big.png
  size: 749 × 485 px

Nue's [CSS best practises](css-best-practices.html) helps you organize the code in such a way that it is easy to read, reuse and scale. Experienced UX developers can rapidly build websites with just a few lines of HTML and a handful of CSS files. There is no designer-developer handoff process in your way.

[.note]
  ### Note

  CSS is a phenomenal styling language, but if you don't have a clear plan things can easily get out of hand. It takes a lot of practice before you can confidently write simple, reusable CSS that is easy to read and maintain.

  We are working on website *templates*, that will change the situation. You'll get a professional website in a snap, with decades of CSS experience under the hood. The clear, commented source code will offer a great learning experience. [Join our mailing list](/#roadmap) if you want to hear when it's available.

## JavaScript

Nue brings [motion and reactivity](reactivity.html) to the hands of UX developers. They can implement advanced dynamics with vanilla CSS. Things like view transitions and scroll-triggered animations are nothing but modern CSS:

```css
/* view transition: Scale down the "old" page */
::view-transition-old(root) {
  transform: scale(.8);
  transition: .4s;
}
```

With Nue, you don't need a massive React/TypeScript ecosystem to implement the interactive parts of your website. Learn modern CSS and the basics of JavaScript and you're good to go.

## Customer handoff

Your final step is to hand the product to the ones who maintain the content. One of the best parts of Nue is that the *content is completely extracted from the code*. Any non-technical person can proceed with the content without breaking things or blocking others.

[bunny-video]
  videoId: 3bf8f658-185a-449c-93b9-9bd5e1ad0d05
  poster: /img/nuemark-splash.jpg

There are two ways to pass the website to your customers:

1. The easiest way (for you) is to grant access to the GitHub repository and let the customer manage content directly from the web.
2. A better way (for the customer) is to set up a local content development environment for them. Install a text editor like **Sublime Text** and configure it to only show content files. Run the website on another split screen and let Nue hot-reload the content automatically. This will most certainly impress your customer:

Something like the following would do the job in the Sublime preferences:

```yaml
# exclude all folders that are meant for developers
folder_exclude_patterns: [ "@global", "@lib" ]

# only include files related to content management
file_include_patterns: [ "*.md", "*.yaml" ]
```

[.note]
  ### Note

  We are working on features that will make the customer handoff as easy as possible. This includes a **VS code** extension for easy content management and a "Push live" button that deploys all the changes to production.
