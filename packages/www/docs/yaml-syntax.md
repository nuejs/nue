# YAML syntax

Complete reference for Nueyaml's simplified YAML syntax. For an overview and introduction, see the [Nueyaml documentation](/docs/nueyaml).

## File structure

All Nueyaml files must start with an object at the root level. The parser always returns an object, never an array or primitive value.

```yaml
# Valid - root object
name: My App
version: 1.0.0

# Invalid - root array
- item1
- item2
```

Files are encoded in UTF-8.

## Data types

### Strings

Everything is a string by default. No quotes required unless forcing a value that looks like another type.

```yaml
name: John Doe
title: Senior Developer
message: Hello world
country: NO             # string "NO", not false
time: 12:30             # string "12:30", not 750 minutes
```

Quoted strings are automatically unwrapped for YAML compatibility:

```yaml
message: "Hello world"  # becomes: Hello world
note: a "quoted" word   # becomes: a "quoted" word
force: "123"            # stays string "123", not number
```

### Numbers

Only integers and decimals are parsed as numbers. Must look like a number to a human.

```yaml
age: 30                 # integer
price: 19.99            # decimal
count: 0                # zero
negative: -42           # negative integer
```

Not supported:
```yaml
scientific: 1.2e3       # string "1.2e3"
octal: 0o755            # string "0o755"
hex: 0xFF               # string "0xFF"
underscore: 1_000       # string "1_000"
```

### Booleans

Only `true` and `false` are parsed as booleans. Everything else is a string.

```yaml
enabled: true
visible: false
active: yes             # string "yes"
on: ON                  # string "ON"
```

### Dates

Single ISO format only: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`

```yaml
created: 2024-01-15
updated: 2024-01-15T10:30:00Z
```

Other formats become strings:
```yaml
us_date: 01/15/2024      # string
euro_date: 15.01.2024    # string
text_date: Jan 15, 2024  # string
```

### Null

Empty values become null.

```yaml
description:      # null
avatar:           # null
```

### Arrays

Support both inline and block syntax.

```yaml
# Inline arrays
tags: [frontend, javascript, react]
numbers: [1, 2, 3]
mixed: [hello, 42, true]

# Block arrays
tags:
  - frontend
  - javascript
  - react

# Nested arrays
matrix:
  - [1, 2, 3]
  - [4, 5, 6]
  - [7, 8, 9]
```

### Objects

Block syntax only. No inline object support.

```yaml
# Valid block object
user:
  name: John Doe
  age: 30
  active: true

# Invalid inline object
user: {name: John, age: 30}  # becomes string
```

## Multi-line strings

When a value continues on the next line with increased indentation, it becomes a multi-line string.

```yaml
description:
  This is a multi-line
  string that preserves
  line breaks exactly
  as written.

# Result: "This is a multi-line\nstring that preserves\nline breaks exactly\nas written."
```

Multi-line strings preserve:
- Line breaks
- Indentation relative to the first line
- Trailing whitespace on each line
- Blank lines within the content

```yaml
code_example:
  function hello() {
    console.log('Hello')
  }

  hello()

# Preserves the blank line and indentation
```

## Property names

Property names can contain any characters, including colons and special characters. The parser looks for `: ` (colon followed by space) as the key-value separator.

```yaml
# Special characters in keys
/api/users/:id: getUserHandler
/api/posts: getPostsHandler
@media (max-width: 768px): mobile-styles
users[0].name: John
api:key: secret-value
with spaces: allowed
```

The only requirement is the `: ` separator:
```yaml
key:value              # invalid - no space after colon
key: value             # valid
key : value            # valid - extra spaces ok
complex:key: value     # valid - colon in key name
```

Nueyaml does not support quoted property names:
```yaml
"quoted key": value    # not supported
'single quotes': value # not supported
```

## Indentation and whitespace

Indentation must use spaces only. Tabs are not allowed for indentation.

```yaml
# Valid - consistent 2-space indentation
app:
  name: Test
  config:
    debug: true

# Valid - consistent 4-space indentation
app:
    name: Test
    config:
        debug: true

# Invalid - mixed indentation
app:
  name: Test
   config: mixed       # Error: not a multiple of 2
```

The parser detects indentation size from the first indented line and enforces consistent multiples throughout.

Whitespace rules:
- Trailing spaces are ignored
- Blank lines are allowed anywhere
- Tabs are permitted within string values
- Tabs cannot be used for structural indentation


## Comments
Use `#` for comments. Comments must be preceded by whitespace to avoid conflicts with values containing `#`.

```yaml
# Full-line comment
name: John Doe         # Inline comment
password: secret#123   # The # in password is not a comment
api_key: sk-1234#abcd  # Safe for cryptic values

# Multi-line comments need
# a # on each line
```

Comment detection:
```yaml
valid # comment        # Space before # makes it a comment
no#comment            # No space, so # is part of the value
also#not#comment      # Multiple # without spaces are kept
```

## Error handling

The parser provides clear error messages with line numbers:

```yaml
# Example errors:
user:
  name: John
   age: 30            # Error: Line 3: Inconsistent indentation

data:
  - item1
  item2              # Error: Line 3: Expected array item indicator (-)
```

## Limitations

### Not supported from YAML

- **Anchors and references** (`&anchor`, `*reference`)
- **Merge keys** (`<<: *defaults`)
- **Tags** (`!!str`, `!!timestamp`)
- **Multiple documents** (`---`, `...`)
- **Flow collections** spanning multiple lines
- **Block scalar indicators** (`|`, `>`, `|-`, `>+`)
- **Escaped sequences** (`\n`, `\t`, `\u0041`)
- **Alternative booleans** (`yes`, `no`, `on`, `off`, `YES`, `True`)
- **Multiple date formats**
- **Binary data**
- **Sets and ordered maps**
- **Directives** (`%YAML`, `%TAG`)

### Intentional restrictions

- Root must be an object (not array or scalar)
- No inline objects with `{}`
- No quoted property names
- No scientific notation
- No octal or hexadecimal numbers
- Tabs only for indentation (not content)
- Single date format only

## Complete example

```yaml
# Application configuration
app:
  name: My Application
  version: 1.2.0
  debug: false
  launched: 2024-01-15

# Database settings
database:
  host: localhost
  port: 5432
  credentials:
    username: admin
    password:           # null for environment variable

  connection_string:
    postgresql://admin@localhost:5432/myapp
    ?ssl=true&timeout=10

# API routes - special characters in keys
/api/users/:id: getUserHandler
/api/posts: getPostsHandler
/api/auth/login: loginHandler

# Security
api_keys:
  github: ghp_xxxxxxxxxxxxxxxxxxxx
  stripe: sk-test_#################
  aws: AKIA#############

# Features array
features: [auth, analytics, caching]
experimental:
  - new-dashboard
  - dark-mode
  - websockets

# Responsive design breakpoints
breakpoints:
  @media (max-width: 768px): mobile
  @media (max-width: 1024px): tablet
  @media (min-width: 1025px): desktop

# Multi-line content
welcome_message:
  Welcome to our application!

  This message spans multiple lines
  and preserves blank lines and
  indentation exactly as written.

# Server configuration
servers:
  - name: web-01
    ip: 192.168.1.10
    active: true
    roles: [web, api]

  - name: web-02
    ip: 192.168.1.11
    active: false
    roles: [web]

  - name: db-01
    ip: 192.168.1.20
    active: true
    roles: [database, cache]

# Metadata
_internal:              # Leading underscore is fine
  build_number: 4567
  commit: abc123def
  timestamp: 2024-01-15T10:30:00Z
```