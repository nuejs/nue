import { Glob } from 'bun'

const DEFAULT_LIB = ['@system', './view', './components']

function resolvePath(pattern, contextPath) {
  if (!pattern.startsWith('./')) return pattern
  const pathParts = contextPath.split('/').slice(0, -1)
  const dir = pathParts.length > 0 ? pathParts.join('/') : ''
  return pattern.replace('./', dir ? dir + '/' : '')
}

function matchPaths(paths, pattern, lib, contextPath) {

  // exact glob matching first
  const glob = new Glob(pattern)
  let matches = paths.filter(path => glob.match(path))

  // try with lib prefixes for path patterns
  if (matches.length == 0 && (pattern.includes('/') || pattern.includes('*'))) {
    for (const libPath of lib) {
      const resolvedLib = resolvePath(libPath, contextPath)
      const libPattern = resolvedLib + '/' + pattern
      const libGlob = new Glob(libPattern)
      matches = [...matches, ...paths.filter(path => libGlob.match(path))]
    }
  }

  // fuzzy matching for simple names
  if (matches.length == 0 && !pattern.includes('/') && !pattern.includes('*')) {
    matches = paths.filter(path => {
      const filename = path.split('/').pop()
      return filename.includes(pattern)
    })
  }

  return [...new Set(matches)]
}

export function filterByLib(filepath, lib = DEFAULT_LIB, paths) {
  return paths.filter(path =>
    lib.some(libPath => {
      const resolved = resolvePath(libPath, filepath)
      return path.startsWith(resolved + '/')
    })
  )
}

export function applyUsePatterns(filepath, { use, paths, lib = DEFAULT_LIB }) {
  let result = []

  for (const pattern of use) {
    const resolved = resolvePath(pattern, filepath)

    if (resolved.startsWith('!')) {
      const toExclude = matchPaths(paths, resolved.slice(1), lib, filepath)
      result = result.filter(path => !toExclude.includes(path))

    } else {
      const matched = matchPaths(paths, resolved, lib, filepath)
      result = [...result, ...matched]
    }
  }

  return [...new Set(result)]
}

function addDirFiles(filepath, allFiles, use_local_css) {
  const dir = filepath.split('/').slice(0, -1).join('/')
  const extensions = ['.html', '.js', '.ts']
  if (use_local_css) extensions.push('.css')

  return allFiles.filter(path => {

    // exclude self
    // if (filepath == path) return false

    const fileDir = path.split('/').slice(0, -1).join('/')
    return fileDir == dir && extensions.some(ext => path.endsWith(ext))
  })
}


export function listDependencies(filepath, { paths, lib, use, use_local_css }) {
  let arr = filterByLib(filepath, lib, paths)

  if (!use_local_css) {
    arr = arr.filter(path => !path.endsWith('.css') || path.startsWith('@system/'))
  }

  arr = applyUsePatterns(filepath, { use, lib, paths: arr })

  arr.push(...addDirFiles(filepath, paths, use_local_css))

  return [...new Set(arr)]
}