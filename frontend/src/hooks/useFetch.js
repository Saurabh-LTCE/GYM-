import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * GET helper: fetches a URL path (appended to api baseURL).
 *
 * @param {string} path - e.g. '/api/members'
 * @param {object} [options]
 * @param {boolean} [options.enabled=true] - skip fetch when false
 */
export function useFetch(path, options = {}) {
  const { enabled = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(enabled && path));
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!path) {
      setData(null);
      setLoading(false);
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(path);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      console.error('useFetch error:', path, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    if (!enabled || !path) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(path);
        if (!cancelled) {
          setData(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          console.error('useFetch error:', path, err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [path, enabled]);

  return { data, loading, error, refetch };
}
