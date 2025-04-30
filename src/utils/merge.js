/**
 * Merges two objects, giving priority to the first object.
 */
export function merge(obj1, obj2) {
  if (!obj1 && !obj2) return null;
  if (!obj1) return obj2;
  if (!obj2) return obj1;
  const result = {};
  const keys = [...new Set([...Object.keys(obj1), ...Object.keys(obj2)])];
  keys.forEach(key => {
    result[key] = obj1[key] || obj2[key];
  });
  return result;
}
