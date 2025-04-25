import { useEffect } from "react";
import { autorun } from "mobx";

/**
 * Returns [observable], and kicks off [fetchFunction] on mount, if provided.
 * The [fetchFunction] doesn't need to return the item type, just make sure to save it in an observable field.
 */
export default function useObservable<T>(observable: T, fetchFunction: () => void): T {
  useEffect(() => {
    let disposer;
    if (fetchFunction) {
      disposer = autorun(fetchFunction);
    }
    return disposer;
  }, []);
  return observable;
}
