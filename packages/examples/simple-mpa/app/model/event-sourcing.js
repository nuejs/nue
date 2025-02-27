
import { fetchData } from './auth.js'

export async function loadChunks() {
  const chunks = [await loadChunk()]

  const ts = localStorage.getItem('_ts') || 0

  if (ts) chunks.push(await loadChunk(ts))
  localStorage.setItem('_ts', Date.now())

  return chunks
}

async function loadChunk(ts) {
  return await fetchData(ts ? `chunk-1.json?ts=${ts}` : 'chunk-0.json', true)
}