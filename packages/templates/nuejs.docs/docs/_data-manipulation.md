## Data manipulation
Transform and enrich your data using JavaScript or TypeScript. Place `.js` or `.ts` files in the same directory as your data files:

```
@shared/data/
├── products.yaml
├── team.yaml
└── process.js         # Data manipulation script
```

### Script signature

Export a default async function that receives and returns the accumulated data:

```javascript
// @shared/data/process.js
export default async function(data) {
  // data contains all merged YAML and JSON from this directory level

  // Add computed properties
  data.featured_products = data.products.filter(p => p.featured)

  // Enrich existing data
  data.team = data.team.map(member => ({
    ...member,
    avatar_url: `/img/team/${member.avatar}`
  }))

  // Return modified data
  return data
}
```

### Fetching external data

Since manipulation functions are async, you can fetch from external sources:

```javascript
// @shared/data/fetch-posts.js
export default async function(data) {
  // Fetch from headless CMS
  const response = await fetch('https://cms.example.com/api/posts')
  const posts = await response.json()

  // Add to context
  data.cms_posts = posts

  return data
}
```

This lets you integrate with headless CMS systems, databases, or any API that provides data for your templates.


### Processing order
Scripts run after all YAML and JSON files at the same level are merged:

1. Load all `.yaml` and `.json` files in the directory
2. Merge them into a single data object
3. Run any `.js` or `.ts` scripts in alphabetical order
4. Each script receives the current merged data and returns modified data
