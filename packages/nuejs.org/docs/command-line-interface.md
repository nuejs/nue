
# Command line interface
The command line interface documents itself with a `--help` option:


## Options

```sh
nue --help
```

This returns the following output:

```md
Usage
  nue [command] [options] [file_matches]
  nue -v or --version
  nue -h or --help

Commands
  serve    Start development server (default command)
  build    Build the site under <root_dir>
  init     Re-initialize Nue system directory
  create   Create a new website with a starter template. See installation docs.

Options
  -r or --root          Source directory. Default "." (current working dir)
  -p or --production    Build production version
  -e or --environment   Read extra options to override defaults in site.yaml
  -I or --init          Force clear and initialize output directory
  -n or --dry-run       Show what would be built. Does not create outputs
  -b or --esbuild       Use esbuild as bundler. Please install it manually
  -P or --port          Port to serve the site on

File matches
  Only build files that match the rest of the arguments. For example:
  "nue build .ts .css" will build all TypeScript and CSS files

Examples
  # serve current directory
  nue

  # build everything
  nue build

  # build everything to production with extra config
  nue build --production --environment staging.yaml

  # build all Markdown and CSS files
  nue build .md .css

  # more examples
  open https://nuejs.org/docs/command-line-interface.html

 ┏━┓┏┓┏┳━━┓
 ┃┏┓┫┃┃┃┃━┫
 ┃┃┃┃┗┛┃┃━┫  nuejs.org
 ┗┛┗┻━━┻━━┛
```

## Examples
A few more usage examples:

```sh
# serve current directory
nue

# serve the production version (no hot-reloading)
nue --production

# build to production with custom settings
nue build -p --environment custom.yaml

# show what will be built (without building)
nue build .js .ts .nue --dry-run

# create a website to a custom output directory
nue create simple-blog --root dirname
```

## How it looks

Here's an example output of `nue build` command. The operation usually takes less than 100 milliseconds to perform, even with hundreds of files.

[bunny-video]
  videoId: 45b73e3a-3edd-47af-bcd8-49039496b107
  width: 600
