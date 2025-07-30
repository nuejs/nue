
import { version } from './system'

const HELP = `
Usage
  nue [command] [options] [file_matches]
  nue -v or --version
  nue -h or --help

Commands
  serve    Start development server (default command)
  build    Build the site
  create   Use a project starter template
  init     Re-generate @nue system files


Options
  -r or --root          Source directory. Default "." (current working dir)
  -p or --production    Build production version
  -n or --dry-run       Show what would be built. Does not create outputs
  -P or --port          Serves the site on the specified port

File matches
  Only build files that match the rest of the arguments. For example:
  "nue build .ts .css" will build all TypeScript and CSS files

Examples
  # serve current directory
  nue

  # build everything to production
  nue build --production

  # build all Markdown and CSS files
  nue build .md .css

  # more examples
  https://nuejs.org/docs/cli

 ┏━┓┏┓┏┳━━┓
 ┃┏┓┫┃┃┃┃━┫  ${version}
 ┃┃┃┃┗┛┃┃━┫  nuejs.org
 ┗┛┗┻━━┻━━┛
`

const colors = {
  boldwhite: str => `\x1b[1;37m${str}\x1b[0m`,
  gray: str => `\x1b[90m${str}\x1b[0m`,
  green: str => `\x1b[32m${str}\x1b[0m`,
  cyan: str => `\x1b[36m${str}\x1b[0m`,
}

function format(line) {
  return line.match(/^\w[\w ]+$/) ? colors.boldwhite(line) // titles
    : '┏┃┗'.includes(line.trim()[0]) ? colors.green(line) // ascii art
    : line.includes('#') ? colors.cyan(line) // comments
    : colors.gray(line)
}

export function printHelp() {
  console.info(HELP.split('\n').map(format).join('\n'))
}

