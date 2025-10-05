# Contributing
I'm **Tero Piirainen**, Nue's creator. Here's how I work and the best ways to contribute.

## Work happens in bursts
I work in bursts. This means gaps in community responses, delayed pull request reviews, and periods of radio silence. Progress might look slow from the outside, but I'm working constantly.

### Major steps in the roadmap
Up next are multi-site development, deployments, multi-site templates and design systems. The wild pivots of early development are behind us.

### Vision matters
I have strong opinions about Nue's direction, especially around separation of concerns. I'm protective of the principles that make Nue different from other frameworks.


## Best ways to help

### Bug reports
Test Nue in your projects and [report issues](//github.com/nuejs/nue/issues). Clear reproduction steps help the most.

### Coding
For code contributions, reach out on [Slack](//join.slack.com/t/nuejs/shared_invite/zt-2wf8ozu5i-N2Y9PA_D17weIWuN2QPOqQ) first. **Let's talk about your idea before writing code**. This saves time and ensures your contribution aligns with the project's direction.

Small, focused pull requests have the best chance of getting merged. Large architectural changes require discussion first.


## Development setup
Run Nue directly from source for testing changes

```
git clone https://github.com/nuejs/nue
cd nue
bun install

# Test with a template using local nuekit
cd packages/templates/full
../../nuekit/src/cli.js

→ Nue 2.0-beta • Bun 1.2.22
→ Serving on http://localhost:4000/
```