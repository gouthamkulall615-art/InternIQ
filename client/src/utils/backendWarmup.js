const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

let isBackendReady = false;
let ongoingPing = null;
const readinessListeners = new Set();

const notifyListeners = (status) => {
  readinessListeners.forEach((fn) => {
    try {
      fn(status);
    } catch {
      // ignore listener errors
    }
  });
};

/**
 * Returns current known readiness state (boolean).
 */
export const isBackendAwake = () => isBackendReady;

/**
 * Subscribe to backend readiness changes.
 * Returns an unsubscribe function.
 */
export const onBackendReadinessChange = (callback) => {
  readinessListeners.add(callback);
  return () => {
    readinessListeners.delete(callback);
  };
};

/**
 * Lightweight warmup helper: sends a GET /api/health request.
 * Fails silently and never blocks rendering.
 * Resolves to boolean (true if status === 'ok', false otherwise).
 */
export const warmUpBackend = async () => {
  if (isBackendReady) return true;
  if (ongoingPing) return ongoingPing;

  ongoingPing = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        const data = await response.json().catch(() => null);
        if (data?.status === 'ok') {
          isBackendReady = true;
          notifyListeners(true);
          return true;
        }
      }
    } catch {
      // Fails silently as required
    } finally {
      ongoingPing = null;
    }
    return isBackendReady;
  })();

  return ongoingPing;
};

