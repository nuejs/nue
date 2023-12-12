
import { colors } from './util.js'

const HELP = `
Usage
  nue [command] [options] [file_matches]
  nue -v or --version
  nue -h or --help

Commands
  serve    Start development server (default command)
  build    Build the site under <root_dir>
  stats    Show site statistics

Options
  -r or --root          Source directory. Default "." (current working dir)
  -p or --production    Build production version / Show production stats
  -e or --environment   Read extra options to override defaults in site.yaml

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

`

const commands = ['serve', 'build', 'stats']

function formatLine(line) {
  const { gray, magenta, cyan, green } = colors
  const l = line.trim()
  const i = l.indexOf(' ')
  const word = l.slice(0, i)
  const rest = gray(l.slice(i))

  return word == '#' ? green(line) :
    l == 'nue' ? magenta(line) :
    word == 'nue' ? '  ' + magenta(word) + rest :
    commands.includes(word) ? '  ' + cyan(word) + rest :
    l.includes('://') ? cyan(line) :
    gray(line)
}

export function getHelp() {
  return !process.env.TERM ? HELP : HELP.split('\n').map(line => {
    return line[0] === ' ' ? formatLine(line) : line
  }).join('\n')
}



