# Development experience: Next.js vs Nue

This benchmark compares the development experience between Next.js Blog Starter Kit and Nue Simple Blog through measurable metrics and reproducible scenarios. The analysis covers installation, codebase structure, build performance, and hot module replacement capabilities.

### Installation and Setup

| Metric | Next.js (15.0.2) | Nue (1.0.0-RC.2) |
|--------|------------------|-------------------|
| Installation Time | 58s | 3s |
| Installation Size | 372MB | 11MB |
| Template Size | - | 1.1MB |
| Dependencies | 254 packages | 10 packages |
| Setup Steps | 4 commands + manual open | Single command, auto-opens |

### Build Performance

| Metric | Next.js | Nue |
|--------|---------|-----|
| Initial Build | 23.66s | 0.15s |
| Subsequent Builds | 15-16s | 0.15s |
| Output Size | 78M | 1.1MB |

### Development Experience

| Metric | Next.js | Nue |
|--------|---------|-----|
| Dev Bundle | 85KB HTML + 2.7MB assets [^1] | 7KB HTML + 124KB assets [^2] |
| HMR Latency | 0.5-1s | 50ms or less |
| Page Navigation | ~1s first time | 50-100ms |
| State Preservation | Variable | Consistent |


### Production Output

| Metric | Next.js | Nue |
|--------|---------|-----|
| Bundle Size | 265KB [^3] | 8.5KB [^4] |
| HTTP Requests | 14 | 2 |
| Time to Interactive | 2.1s | 0.3s |


[^1]: Full breakdown: 16 JS files, 2 CSS files, 26 HMR modules
[^2]: CSS inlined in HTML, single JS file for view transitions
[^3]: 242KB JS + 11.4KB HTML + 8.7KB CSS + 2.6KB XHR
[^4]: 5.4KB HTML with inlined CSS + 3.1KB JS



## Conclusion
The quantitative differences between Next.js and Nue represent fundamental architectural distinctions that affect development workflow. The following analysis examines these implications:

Development Flow Impact:
- Build delays of 1-3 seconds create measurable context switching
- Sub-100ms updates maintain development flow
- Cumulative time savings scale with project size and team size

Architectural Implications:
- Framework coupling affects content update complexity
- Separation of concerns influences maintenance overhead
- Build pipeline complexity impacts deployment reliability

Long-term Productivity Factors:
- Content update friction affects publishing velocity
- Build time overhead accumulates across project lifecycle
- Development server restarts impact team productivity

These factors compound in production environments. The measured performance differences translate to significant productivity variance when scaled across development teams and project lifespans.

The benchmark metrics can be independently verified by replicating the test scenarios with both templates under similar conditions. Each factor was measured under controlled circumstances to ensure reproducibility.


## URLs & Resources

Next.js Blog Starter:
- Template: [blog-starter-kit](//vercel.com/templates/next.js/blog-starter-kit)
- Demo: [next-blog-starter.vercel.app](//next-blog-starter.vercel.app/)

Nue Simple Blog:
- Template: [simple-blog](installation.html)
- Demo: [simple-blog.nuejs.org](//simple-blog.nuejs.org/)

*All measurements were taken on MacBook Air M1 (2020), 8GB RAM, macOS 14.6. Network conditions simulated with Chrome DevTools using "Fast 3G" preset.*


### References