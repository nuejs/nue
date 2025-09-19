
# Nueyaml: YAML without the problems
Nueyaml is YAML stripped down to its essence so you can write complex configurations without the usual YAML pitfalls.


## The problem with standard YAML
The original YAML specification buried a beautiful idea under 80 pages of features that cause more problems than they solve. It guesses what you mean, often guessing wrong:

```yaml
# Standard YAML surprises
country: NO      # becomes false (Norway problem)
time: 12:30      # becomes 750 (minutes)
version: 1.10    # becomes 1.1 (float)
port: 08080      # becomes 4176 (octal)
```

These "conveniences" turn configuration files into minefields. You quote some values defensively, but not others. You remember some gotchas, but not all. Your configuration works until it doesn't.


## How Nueyaml fixes it
Nueyaml has one rule: be predictable. If it looks like a string to a human, it's a string:

```yaml
# Nueyaml - no surprises
country: NO       # string "NO"
time: 12:30       # string "12:30"
version: 1.10     # number 1.10
port: 08080       # string "08080"
```

Only obvious numbers (`123`, `45.67`) become numbers. Only `true` and `false` become booleans. Everything else stays a string.


## Simple type system
Nueyaml supports just the types you actually need:

**Strings** - The default. No quotes needed unless you want them.

**Numbers** - Integers and decimals that look like numbers.

**Booleans** - Only `true` and `false`. Not `yes`, `YES`, `on`, or `True`.

**Dates** - Single ISO format: `2024-01-15` or `2024-01-15T10:30:00Z`

**Null** - Empty values become null.

**Arrays and Objects** - Standard YAML collections.

That's it. No binary data. No sets. No ordered maps. No custom types. no Norway problem. Just the data types every configuration file needs.


## How it looks
Write complex configurations without issues:

```yaml
# API routes with special characters
/api/users/:id: getUserHandler
/api/posts: getPostsHandler

# Responsive breakpoints
mobile: @media (max-width: 768px)
tablet: @media (max-width: 1024px)

# Multi-line content
description:
  This is a multi-line string
  that preserves line breaks
  exactly as written.

# Mixed data types
server:
  host: localhost
  port: 8080
  debug: true
  started: 2024-01-15T10:30:00Z
  description:
```

Property names can contain any characters. Values are predictable. Multi-line strings just work. No anchors, no references, no merge conflicts.


## FAQ


### Why YAML?
Configuration files should be written for humans, not parsers. Compare these:

```json
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "credentials": {
      "username": "admin",
      "password": "secret123"
    }
  }
}
```

```yaml
database:
  host: localhost
  port: 5432
  credentials:
    username: admin
    password: secret123
```

YAML removes the syntactic noise. No quotes around keys. No brackets. No commas. Just structure through indentation, like Python code or Markdown documents.


### Why not TOML?

TOML gets verbose with nested data:

```toml
[database]
host = "localhost"

[database.credentials]
username = "admin"

[[servers]]
name = "web-01"

[[servers]]
name = "web-02"
```

```yaml
database:
  host: localhost
  credentials:
    username: admin

servers:
  - name: web-01
  - name: web-02
```

TOML's section headers and dotted keys obscure the structure. Nueyaml's indentation makes hierarchy visible.

### Why not JSON5?

JSON5 still requires quotes and commas everywhere:

```json5
{
  "features": ["auth", "analytics"],
  "api_key": "sk-1234"
}
```

```yaml
features: [auth, analytics]
api_key: sk-1234
```

JSON5 improves JSON but keeps its ceremonial syntax. Nueyaml eliminates the noise.


### Is this compatible with YAML?
Yes. Nueyaml is valid YAML, but not all YAML files are valid Nueyaml. We support the useful subset and reject the dangerous parts. Your existing YAML tools can read Nueyaml files, but Nueyaml parsers reject complex YAML features.


### What about existing YAML files?
Most real-world YAML files already follow Nueyaml's restrictions. They don't use anchors, tags, or multiple date formats. They're already Nueyaml-compatible. The spec just makes it official.

## Installation

```bash
bun install nueyaml
```

Parse configuration files:

```javascript
import { parse } from 'nueyaml'

const config = parseYAML(yamlString)
```

See the [YAML syntax reference](/docs/yaml-syntax) for complete documentation of supported features.

