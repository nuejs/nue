---
include: [technical-content, form]
---

#### The Vision
# A reboot of the frontend ecosystem
Today, web development is unnecessarily complex: we've normalized JavaScript monoliths and use only a fraction of what's possible with the modern web stack. It's time for a reboot:


## Phase 1: Framework
This phase [is now done](/blog/standards-first-web-framework/). We built a framework to correct the mistakes that led web development to get off the track:

2. **Closer to metal**. Cut down the immense amount of complexity and clutter. We've stripped away the labyrinth of dependencies, build tools, and framework abstractions. The entire framework needs just 10 core dependencies instead of 300+ typical in modern stacks. Build times drop from minutes to milliseconds.

1. **Standards first**. Modern browsers offer remarkable capabilities that eliminate the need for framework abstractions. From native dialog elements through container queries to view transitions, we're using the platform's full power rather than fighting against it.

3. **Systematic design**. Break away from the JavaScript monolith and establish true separation of concerns. By cleanly separating content, structure, styling, and behavior, we enable what was previously impossible: true systematic design at scale.

We use this framework to complete the next phase:



## Phase 2: Templates
_Expected release: April 2025_

In this phase, we'll implement true templates. For a template to be truly pure, it must maintain absolute separation between function and design. It comes down to a single command:

``` sh
nue create startup --design rams
```
This is where the JavaScript monolith completely falls apart. When design decisions are locked inside the template code, the user cannot choose or switch the hardcoded design.

For agencies and creators, this transforms how websites are built. A template defines core functionality - whether it's a blog, an idea showcase, a startup platform, or an enterprise site. This purely functional foundation can express itself in radically different ways through mathematical design.


### Mathematical design systems
Right now, I'm building four systems where all the visual relationships are calculated rather than guessed:

1. **Mies** — This design system is inspired by **Mies van der Rohe**. It achieves dramatic impact through extreme reduction. The result looks remarkably similar to **Linear**, but achieves its commanding presence through stark contrasts, intense whitespace, and bold architectural functionalism.

2. **Rams** — This system builds on **Dieter Rams**'s human-centered functionalism. The end result closely resembles **Stripe**'s clean aesthetic, but stripped of ornamental elements. This design is perhaps closest to what current utility-first frameworks aim for, but achieved through systematic thinking.

3. **Zaha** — Translates **Zaha Hadid**'s bold architectural vision into digital space. Where Linear suggests depth, this system embraces the third dimension. Shadows, blur effects, and transforms create subtle movement while maintaining the mathematical relationships.

4. **Muriel** — Channels **Muriel Cooper**'s pioneering work in digital design. It captures **Apple**'s blend of precision and joy, proving how systematic thinking enables creative freedom while preserving clarity. This isn't just about copying Apple's look — it's about understanding the mathematical principles that make their interfaces feel both playful and precise.

Imagine building websites for clients:

``` sh
# bold minimalism for one client
nue create startup --design mies --brand "#439717"

# human-centered functionalism for second client
nue create startup --design rams --brand "#cab823"

# modern, playful coloring for third client
nue create startup --design muriel --brand "#84792" --secondary "#487924"
```

Each command creates a complete digital product with Apple-level sophistication in seconds rather than months. Stripe's aesthetic for one client, Linear's commanding presence for another. What previously required dedicated design teams and months of component development now emerges instantly through systematic thinking.

I expect Templates and these mathematical design systems to be the moment when standards-first development becomes undeniable. Now everyone defaults to **React**, but this can easily switch when teams can achieve world-class design this easily.



## Phase 3: Single-page applications
_Expected release: July 2025_

Single-page applications represent the ultimate artform of design engineering. They demand perfect harmony between systematic design and complex functionality. Today, this fusion requires months of specialized development.

We'll make this possible through a single command:


``` sh
nue create spa --function crm --todir app --design inherit
```

This changes how you build single-page apps. Whether you're a solo creator crafting the next Linear, a startup building your core product, or an agency delivering client solutions — you can now create complete platforms with enterprise-grade functionality that inherits your brand's mathematical design system.

What previously demanded multiple teams, different frameworks, and months of coordination now emerges from one command. Your app isn't just functional — it's a natural extension of your marketing site's visual language. The same systematic thinking that powers your public pages now shapes your application interfaces.

The impact is profound: Linear-level design meets Stripe-level functionality, achieved through pure separation of concerns. This is design engineering taken to its natural conclusion.

But to make the reboot complete, we need one final piece:



## Phase 4: Cloud
_Expected release: September 2025_

This is the final phase and it's time to squeeze everything out from the cloud. It starts with a command that makes world-class web development accessible to everyone:

``` sh
nue push
```

With this command what previously required a full rebuild now deploys to the server in milliseconds through our global CDN. Content creators update sites directly through Markdown. Designers iterate on pages without build complexity. Marketing teams publish sophisticated landing pages instantly.

Then we enter an entirely new territory - something no existing system has dared to imagine. We're extending this command to provide complete, production-ready services:

``` sh
nue create startup --services analytics,crm,checkout
```

The technical foundation for this already exists. Modern edge functions provide remarkable power. Deno offers elegant runtime environments without infrastructure complexity. Serverless databases handle state effortlessly. Nue simply unifies these capabilities through systematic thinking.

Consider what this means: A single command creates not just a website, but a complete digital business. Analytics to understand users. CRM to manage relationships. Checkout flows to handle payments. Features that previously took months or years of development emerge instantly with Linear-level sophistication.

This is what the web was always meant to be: bringing this immense power to everyone.


[.recap]
  ## Recap
  How Nue reboots the overly complex ecosystem

  [! /img/roadmap-2025-1-big.png"]

  ### Follow the progress
  We'll send you email on each major update:

  [join-list]
