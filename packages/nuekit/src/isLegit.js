/** Returns a function that will check if a file is not ignored and is legit.*/
export function makeIsLegit(ignores = []) {
    const IGNORE = ['node_modules', 'package.json', 'bun.lockb', 'pnpm-lock.yaml', ...ignores]  
  
    function ignore(name='') {
      return '._'.includes(name[0]) || IGNORE.includes(name)
    }
    
    function isLegit(file) {
      return !ignore(file.name) && !ignore(file.dir)
    }
    
    // TODO: real symdir detection
    return isLegit
  }