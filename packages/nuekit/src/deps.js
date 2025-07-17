import { Glob } from 'bun'

const DEFAULT_LIB = ['@system', './view', './components']

function resolvePath(pattern, contextPath) {
  if (!pattern.startsWith('./')) return pattern
  const pathParts = contextPath.split('/').slice(0, -1)
  const dir = pathParts.length > 0 ? pathParts.join('/') : ''
  return pattern.replace('./', dir ? dir + '/' : '')
}

function matchPaths(paths, pattern, lib, contextPath) {
  // Try exact glob matching first
  const glob = new Glob(pattern)
  let matches = paths.filter(file => glob.match(file))

  // Try with lib prefixes for path patterns
  if (matches.length == 0 && (pattern.includes('/') || pattern.includes('*'))) {
    for (const libPath of lib) {
      const resolvedLib = resolvePath(libPath, contextPath)
      const libPattern = resolvedLib + '/' + pattern
      const libGlob = new Glob(libPattern)
      matches = [...matches, ...paths.filter(file => libGlob.match(file))]
    }
  }

  // Fuzzy matching for simple names
  if (matches.length == 0 && !pattern.includes('/') && !pattern.includes('*')) {
    matches = paths.filter(file => {
      const filename = file.split('/').pop()
      return filename.includes(pattern)
    })
  }

  return [...new Set(matches)]
}

export function filterByLib(path, lib = DEFAULT_LIB, paths) {
  return paths.filter(file =>
    lib.some(libPath => {
      const resolved = resolvePath(libPath, path)
      return file.startsWith(resolved + '/')
    })
  )
}

export function applyUsePatterns(path, { use, paths, lib = DEFAULT_LIB }) {
  let result = []

  for (const pattern of use) {
    const resolved = resolvePath(pattern, path)

    if (resolved.startsWith('!')) {
      const exclude = resolved.slice(1)
      const toExclude = matchPaths(paths, exclude, lib, path)
      result = result.filter(file => !toExclude.includes(file))
    } else {
      const matched = matchPaths(paths, resolved, lib, path)
      result = [...result, ...matched]
    }
  }

  return [...new Set(result)]
}

function addDirFiles(contentPath, allFiles, use_local_css) {
  const dir = contentPath.split('/').slice(0, -1).join('/')
  const extensions = ['.html', '.js', '.ts']
  if (use_local_css) extensions.push('.css')

  return allFiles.filter(file => {
    const fileDir = file.split('/').slice(0, -1).join('/')
    return fileDir == dir && extensions.some(ext => file.endsWith(ext))
  })
}


export function listDependencies(path, { paths, lib, use, use_local_css }) {
  let arr = filterByLib(path, lib, paths)

  if (!use_local_css) {
    arr = arr.filter(file => !file.endsWith('.css') || file.startsWith('@system/'))
  }

  arr = applyUsePatterns(path, { use, lib, paths: arr })

  arr.push(...addDirFiles(path, paths, use_local_css))

  return [...new Set(arr)]
}