import { useState, useEffect, useRef } from 'react';

/**
 * In-memory request deduplication cache.
 * Prevents duplicate GET requests for the same URL within a session.
 * Cleared on page reload (in-memory only, no localStorage).
 */
const requestCache = new Map();

/**
 * Prefetch a URL into the cache without triggering a React render.
 * Call this to warm the cache before a component mounts.
 * @param {string} url
 */
export function prefetch(url) {
  if (!requestCache.has(url)) {
    var promise = fetch(url).then(function(r) { return r.json(); });
    requestCache.set(url, promise);
  }
}

/**
 * Invalidate a cached URL so the next useFetchWithCache call re-fetches.
 * @param {string} url
 */
export function invalidateCache(url) {
  requestCache.delete(url);
}

/**
 * Hook that fetches JSON from a URL with in-memory deduplication.
 * Identical URLs return the same promise (no duplicate network requests).
 * @param {string|null} url - URL to fetch, or null to skip
 * @returns {{ data: any, error: Error|null, loading: boolean, refetch: function }}
 */
export default function useFetchWithCache(url) {
  var mountedRef = useRef(true);
  var _s = useState(function() {
    if (url && requestCache.has(url)) {
      return { data: null, error: null, loading: true, resolved: false };
    }
    return { data: null, error: null, loading: !!url, resolved: false };
  });
  var state = _s[0];
  var setState = _s[1];

  useEffect(function() {
    mountedRef.current = true;
    return function() { mountedRef.current = false; };
  }, []);

  useEffect(function() {
    if (!url) {
      setState({ data: null, error: null, loading: false, resolved: true });
      return;
    }

    setState(function(prev) {
      return { data: prev.data, error: null, loading: true, resolved: false };
    });

    var promise;
    if (requestCache.has(url)) {
      promise = requestCache.get(url);
    } else {
      promise = fetch(url).then(function(r) {
        if (!r.ok) throw new Error('Fetch failed: ' + r.status);
        return r.json();
      });
      requestCache.set(url, promise);
    }

    promise
      .then(function(d) {
        if (mountedRef.current) {
          setState({ data: d, error: null, loading: false, resolved: true });
        }
      })
      .catch(function(e) {
        requestCache.delete(url);
        if (mountedRef.current) {
          setState({ data: null, error: e, loading: false, resolved: true });
        }
      });
  }, [url]);

  function refetch() {
    if (url) {
      requestCache.delete(url);
      var p = fetch(url).then(function(r) {
        if (!r.ok) throw new Error('Fetch failed: ' + r.status);
        return r.json();
      });
      requestCache.set(url, p);
      setState(function(prev) {
        return { data: prev.data, error: null, loading: true, resolved: false };
      });
      p.then(function(d) {
        if (mountedRef.current) {
          setState({ data: d, error: null, loading: false, resolved: true });
        }
      }).catch(function(e) {
        requestCache.delete(url);
        if (mountedRef.current) {
          setState({ data: null, error: e, loading: false, resolved: true });
        }
      });
    }
  }

  return { data: state.data, error: state.error, loading: state.loading, refetch: refetch };
}
