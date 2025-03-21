/**
 * Minimalist Event Sourcing Implementation
 *
 * IMPORTANT NOTE: This is an intentionally simplified implementation designed
 * to demonstrate core event sourcing concepts. Production systems would include
 * additional capabilities described in the documentation below.
 *
 * HOW EVENT SOURCING WORKS IN PRODUCTION:
 *
 * 1. Event Storage Pattern
 *    - All domain changes are stored as immutable events (UserCreated, OrderPlaced, etc.)
 *    - Events are append-only and never modified after creation
 *    - The complete event stream becomes the authoritative source of truth
 *    - Current state is a temporal projection derived from processing events
 *
 * 2. Optimized Chunking Strategies
 *    - Events are typically grouped into time-based chunks (monthly/quarterly)
 *    - Historical chunks become completely immutable and can be cached aggressively
 *    - CDNs can serve historical chunks with long-lived cache headers
 *    - Only recent chunks need to be fetched during subsequent application loads
 *
 * 3. Advanced Loading Techniques
 *    - Initial load fetches relevant historical chunks (possibly in parallel)
 *    - Subsequent loads only fetch chunks that might contain new events
 *    - Snapshots can avoid replaying the entire event history
 *    - Progressive loading can prioritize most recent/relevant events first
 *
 * 4. State Rebuilding Approaches
 *    - Domain models reconstruct themselves by processing relevant events
 *    - Different projections can be built from the same event stream
 *    - Time-travel debugging becomes possible by stopping event replay at any point
 *    - Multiple read models can serve different application needs
 *
 * 5. Performance Considerations
 *    - WebAssembly can process large event streams with near-native performance
 *    - Complex event processing can be moved to Web Workers for UI responsiveness
 *    - Local storage/IndexedDB can persist events for offline support
 *    - Optimistic UI updates can be reconciled with server events
 */
import { fetchWithAuth } from './auth.js'

/**
 * Loads event chunks from the server.
 *
 * This implementation uses a simple timestamp-based approach:
 * - Initial load fetches the base chunk (chunk-0)
 * - Subsequent loads fetch incremental events since last sync (chunk-1?ts=timestamp)
 *
 * In production, a more sophisticated chunking strategy would be used,
 * typically based on time periods (monthly/quarterly chunks) for better caching.
 *
 * @returns {Promise<Array>} Array of event chunks
 */
export async function loadChunks(use_rust) {
  const chunks = [await loadChunk()]
  const ts = localStorage.getItem('_ts') || 0
  if (ts) chunks.push(await loadChunk(ts))
  localStorage.setItem('_ts', Date.now())
  return chunks
}

/**
 * Loads a single chunk of events.
 *
 * In production systems, chunk loading would include:
 * - Retry logic for network failures
 * - Proper error handling and reporting
 * - Respect for HTTP caching headers
 * - Possibly streaming responses for large chunks
 *
 * @param {number} ts - Timestamp to fetch events after
 * @returns {Promise<Array>} Array of events in the chunk
 */
async function loadChunk(ts) {
  const base = sessionStorage.rust ? 'big-chunk' : 'chunk'
  return await fetchWithAuth(ts ? `${base}-1.json?ts=${ts}` : `${base}-0.json`, true)
}

