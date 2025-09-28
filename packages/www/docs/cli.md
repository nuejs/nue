
# Command line interface
Nuekit provides a simple command line interface for developing and building websites. The CLI follows UNIX conventions with short flags, long options, and predictable behavior.

## Installation

```bash
bun install --global nuekit
```

The `nue` command becomes available globally after installation.

## Basic usage

```bash
nue [command] [options] [file_matches]
```

If no command is specified, `dev` is used by default:

```bash
nue                    # same as "nue dev"
nue --port 8080        # serve on port 8080 (default 4000)
nue build              # build production site
nue preview            # preview built site
```

## Commands

### dev (default)
Start the development server with hot reloading:

```bash
nue dev
nue serve              # alias to dev
nue                    # short alias
nue --port 8080        # serve on specific port
```

The development server starts at http://localhost:4000 (by default)


### build
Build the production site:

```bash
nue build              # build entire site
nue build --clean      # clean output directory first
nue build --dry-run    # show what would be built
nue build --init       # build Nue runtime files (rare need)
```

Built files go to the `.dist` directory by default.

### preview

Preview the production build locally:

```bash
nue preview              # preview on default port (4000)
nue preview --port 8080  # preview on specific port
```

This serves the built files from `.dist` directory.

### create

Create a new project from a starter template:

```bash
# minimal, blog, spa, or full
nue create blog
```

This extracts downloaded template creates a new directory and cd's to it. Issue `nue` and the newly created site is served at http://localhost:4000


## Global options

### -p, --port

Set the port for serve or preview:

```bash
nue --port 3000        # serve on port 3000
nue preview --port 8080 # preview on port 8080
```

### -h, --help

Show help information:

```bash
nue --help
nue -h
```

### -v, --version

Show version information:

```bash
nue --version
nue -v
```

Displays both Nue and Bun versions.

### -s, --silent

Suppress output messages:

```bash
nue build --silent     # build without progress messages
```

### --verbose

Show detailed output:

```bash
nue build --verbose    # detailed build information
```

## Build options

### -n, --dry-run

Show what would be built without actually building:

```bash
nue build --dry-run    # preview build process
```

Useful for testing build configuration.

### -i, --init

Build Nue runtime files to `.dist/@nue` directory:

```bash
nue build --init
```

This creates the minified JavaScript files needed for client-side functionality. This is done automatically on the first build, or if the Nue version changes. This is mostly for the developers of Nue so you rarely need to do this.

### --clean

Clean the output directory before building:

```bash
nue build --clean      # remove .dist then build
```

## File matching

Target specific file types by adding patterns:

```bash
nue build .md          # build only Markdown files
nue build .css .js     # build CSS and JavaScript files
nue .html              # serve only HTML files
```

Patterns match file extensions. Multiple patterns are combined with OR logic.

### Examples

```bash
# Build only content files
nue build .md .yaml

# Serve only stylesheets
nue .css

# Build everything except specific types
nue build --verbose

# Preview with custom port
nue preview --port 5000
```

## Configuration

The CLI reads configuration from `site.yaml`. See [Configuration reference](/docs/configuration) for all available options.

## Troubleshooting

### Command not found

If `nue` command is not found after installation:

```bash
# Check if Bun is in PATH
which bun

# Install globally
bun install --global nuekit
```

### Permission denied
On some systems you may need to make the binary executable:

```bash
chmod +x node_modules/.bin/nue
```

### Port already in use
If the default port is taken, specify a different one:

```bash
nue --port 3001
```

