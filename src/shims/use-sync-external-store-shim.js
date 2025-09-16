// Shim for use-sync-external-store with-selector export issue
// Create a manual implementation that provides the expected export
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useMemo, useRef } from 'react';

// Manual implementation of useSyncExternalStoreWithSelector
// Based on the React team's implementation
export function useSyncExternalStoreWithSelector(
  subscribe,
  getSnapshot,
  getServerSnapshot,
  selector,
  isEqual
) {
  // Use the basic useSyncExternalStore with our selector
  const instRef = useRef(null);

  const [getSelection, getServerSelection] = useMemo(() => {
    // Create memoized selector functions
    let hasMemo = false;
    let memoizedSnapshot;
    let memoizedSelection;

    const memoizedSelector = (nextSnapshot) => {
      if (!hasMemo) {
        hasMemo = true;
        memoizedSnapshot = nextSnapshot;
        const nextSelection = selector(nextSnapshot);
        if (isEqual !== undefined) {
          if (isEqual(memoizedSelection, nextSelection)) {
            return memoizedSelection;
          }
        }
        return (memoizedSelection = nextSelection);
      }

      const prevSnapshot = memoizedSnapshot;
      const prevSelection = memoizedSelection;

      if (Object.is(prevSnapshot, nextSnapshot)) {
        return prevSelection;
      }

      const nextSelection = selector(nextSnapshot);

      if (isEqual !== undefined && isEqual(prevSelection, nextSelection)) {
        return prevSelection;
      }

      memoizedSnapshot = nextSnapshot;
      memoizedSelection = nextSelection;
      return nextSelection;
    };

    const getSnapshotWithSelector = () => memoizedSelector(getSnapshot());
    const getServerSnapshotWithSelector = getServerSnapshot == null
      ? null
      : () => memoizedSelector(getServerSnapshot());

    return [getSnapshotWithSelector, getServerSnapshotWithSelector];
  }, [getSnapshot, getServerSnapshot, selector, isEqual]);

  return useSyncExternalStore(subscribe, getSelection, getServerSelection);
}

// Also export as default for compatibility
export default useSyncExternalStoreWithSelector;