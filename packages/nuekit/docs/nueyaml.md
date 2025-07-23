# Nueyaml specification
A developer-first data format for configuration files. It prioritizes readability and predictability over convenience.

## Design philosophy
Less is more: the syntax uses a limited type system with clear, predictable rules ditching most features and gimmicks from the original YAML specification.

## File structure
All Nueyaml files must start with an object at the root level. The parser always returns an object, never an array or primitive value.

Files are encoded in UTF-8.

## Data types

### Strings
Everything is a string by default. No quotes required unless forcing a value that looks like another type.

```
name: John Doe
title: Senior Developer
message: Hello world
```

Quoted strings are automatically unwrapped for YAML compatibility:

```
message: "Hello world"    # becomes: Hello world
note: a "quoted" word     # becomes: a "quoted" word
```

### Numbers

Only integers and decimals are parsed as numbers. Must look like a number to a human.

```
age: 30
price: 19.99
count: 0
```

No scientific notation, octal, hexadecimal, or underscore separators.

### Booleans

Only `true` and `false` are parsed as booleans. Everything else is a string.

```
enabled: true
visible: false
active: yes    # this is a string
```

### Dates

Single ISO format only: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`

```
created: 2024-01-15
updated: 2024-01-15T10:30:00Z
```

### Null

Empty values become null.

```
description:    # null
avatar:         # null
```

### Arrays

Support both inline and block syntax.

```
tags: [frontend, javascript, react]

# or

tags:
  - frontend
  - javascript
  - react
```

### Objects

Block syntax only. No inline object support.

```
user:
  name: John Doe
  age: 30
  active: true
```

## Multi-line strings

When a value continues on the next line with increased indentation, it becomes a multi-line string.

```
description:
  This is a multi-line
  string that preserves
  line breaks exactly
  as written
```

## Property names

Property names can contain any characters, including colons and special characters. The parser looks for `: ` (colon followed by space) as the key-value separator.

```
/page/:view/:id: handler
@media (max-width: 768px): styles
users[0].name: John
api_key: sk-1234#abcd#5678
with spaces: data
```

Note: Unlike standard YAML, Nueyaml does not support quoted property names. This keeps the syntax minimal while still supporting complex keys naturally.

## Indentation and whitespace

Indentation must use spaces only. Tabs are not allowed for indentation to ensure consistent visual appearance across all editors and environments.

The parser detects the indentation size from the first indented line (typically 2 or 4 spaces) and enforces consistent multiples throughout the file.

```
# Valid - consistent 2-space indentation
app:
  name: Test
  config:
    debug: true

# Invalid - mixed indentation levels
app:
  name: Test
   config: mixed    # Error: not a multiple of 2
```

Trailing spaces are ignored. Blank lines are allowed and preserved in multi-line strings. Tabs are permitted within string values but not for structural indentation.

## Comments

Use `#` for comments. Comments must be preceded by whitespace to avoid conflicts with values containing `#` characters.

```
# This is a full-line comment
name: John Doe  # This is an inline comment
password: secret#123  # The # in the password is not a comment
api_key: sk-1234#abcd#5678  # Safe for cryptic values
```

## Error handling
The parser provides clear error messages with line numbers and specific suggestions when parsing fails.

## What's not supported
- Anchors and references
- Merge keys
- Sets or ordered maps
- Multi-document streams
- Complex multi-line string operators
- Type casting or tagging
- Inline objects with `{}`
- Multiple date formats
- Timezone specifications in timestamps
- Weird Norway-style conversions
- Binary data encoding
- Octal and hexadecimal numbers
- Scientific notation
- Infinity and NaN values
- Custom directives and processing instructions
- Flow collections spanning multiple lines
- Escaped unicode sequences
- Case-insensitive boolean variations
- Block scalar indicators (`|` and `>` variations)
- Quoted key syntax
- Comment placement restrictions
- Nested tag inheritance

## FAQ

### Why not TOML?

TOML becomes verbose for nested structures, requiring explicit section headers and repetitive dotted notation:

```toml
# TOML - verbose and repetitive
[database]
host = "localhost"
port = 5432

[database.credentials]
username = "admin"

[[servers]]
name = "web-01"
ip = "192.168.1.1"

[[servers]]
name = "web-02"
ip = "192.168.1.2"
```

```yaml
# Nueyaml - natural hierarchy
database:
  host: localhost
  port: 5432
  credentials:
    username: admin

servers:
  - name: web-01
    ip: 192.168.1.1
  - name: web-02
    ip: 192.168.1.2
```

TOML's flat structure with section headers makes it hard to see relationships at a glance, while Nueyaml's indentation-based structure makes hierarchy immediately visible.

### Why not JSON5?

JSON5 improves JSON but retains its verbose syntax requirements:

```json5
// JSON5 - still requires quotes and brackets everywhere
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "credentials": {
      "username": "admin",
      "password": null
    }
  },
  "servers": [
    {
      "name": "web-01",
      "ip": "192.168.1.1"
    }
  ]
}
```

```yaml
# Nueyaml - minimal syntax, maximum readability
database:
  host: localhost
  port: 5432
  credentials:
    username: admin
    password:

servers:
  - name: web-01
    ip: 192.168.1.1
```

JSON5 requires quotes around all keys and extensive bracketing, creating visual noise. Nueyaml eliminates syntactic overhead while maintaining structure through indentation, making configuration files more readable and writable by humans.

## Example

```
# Application configuration
app:
  name: My Application
  version: 1.2.0
  debug: false

database:
  host: localhost
  port: 5432
  credentials:
    username: admin
    password:

# API configuration
/api/users/:id: getUserHandler
/api/posts: getPostsHandler

# Security settings
api_keys:
  github: "ghp_xxxxxxxxxxxxxxxxxxxx"
  stripe: sk-test_#################

features: [auth, analytics, caching]

welcome_message:
  Welcome to our application!
  
  This message spans multiple
  lines and will be preserved
  exactly as written.

# Server configuration
servers:
  - name: web-01
    ip: 192.168.1.10
    active: true
  - name: web-02
    ip: 192.168.1.11
    active: false
```
