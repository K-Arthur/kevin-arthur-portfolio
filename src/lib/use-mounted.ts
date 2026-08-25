import { useSyncExternalStore } from 'react';

// No-op subscription: these hooks are used to read a value that is only known
// on the client (after mount). There is nothing to subscribe to; we only need
// the server/client snapshot split that useSyncExternalStore provides.
const noopSubscribe = () => () => {};

/**
 * Returns `true` only after the component has mounted on the client.
 *
 * Safe, hydration-friendly replacement for the common
 * `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), []);`
 * pattern, which triggers `react-hooks/set-state-in-effect`.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

/**
 * Reads a value that is only available on the client (e.g. `window`,
 * `localStorage`, matchMedia) without calling `setState` inside an effect.
 *
 * `getClientValue` runs on the client; `serverFallback` is used during SSR and
 * the first client render to avoid hydration mismatches.
 */
export function useClientValue<T>(getClientValue: () => T, serverFallback: T): T {
  return useSyncExternalStore(
    noopSubscribe,
    getClientValue,
    () => serverFallback
  );
}
