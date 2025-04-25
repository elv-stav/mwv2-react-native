/**
 * Returns a Promise that will invoke [producer] until it gives a non-null non-undefined result,
 * then resolves the promise with it.
 * @param producer The callback that will be invoked every [interval]
 * @param pollInterval How frequently to poll [producer]
 */
export default function waitFor<T>(producer: () => (T | undefined), pollInterval = 30): Promise<T> {
  return new Promise<T>((resolve) => {
    (function wait() {
      const value = producer();
      if (value != null) {
        resolve(value);
      } else {
        setTimeout(wait, pollInterval);
      }
    })();
  });
}
