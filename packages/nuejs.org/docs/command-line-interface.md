
# Command line interface
The command line interface documents itself with a `--help` option:


## Options

```sh
nue --help
```

This returns following output:

```md
Usage
  nue [command] [options] [file_matches]
  nue -v or --version
  nue -h or --help

Commands
  serve    Start development server (default command)
  build    Build the site under <root_dir>
  stats    Show site statistics (beta)

Options
  -r or --root          Source directory. Default "." (current working dir)
  -p or --production    Build production version / Show production stats
  -e or --environment   Read extra options to override defaults in site.yaml
  -s or --stats         Show site statistics after current command
  -I or --init          Force clear and initialize output directory
  -n or --dry-run       Show what would be built. Does not create outputs
  -b or --esbuild       Use esbuild. `npm install -g esbuild` required

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
  open https://nuejs.org/docs/cli

Less is more

 ┏━┓┏┓┏┳━━┓
 ┃┏┓┫┃┃┃┃━┫
 ┃┃┃┃┗┛┃┃━┫  nuejs.org
 ┗┛┗┻━━┻━━┛

```


## Examples
Few more usage examples:

```sh
# serve current directory
nue

# serve the production version (no hot-reloading)
nue --production

# build to production with custom settings
nue build -p --environment custom.yaml

# show production stats
nue -p stats

# show what will be built (without building)
nue build .js .ts .nue --dry-run
```

## How it looks

Here's an example output of `nue build` command. The operation usually takes less than 100 milliseconds to perform, even with hundreds of files.

[bunny-video]
  videoId: 45b73e3a-3edd-47af-bcd8-49039496b107
  width: 600
