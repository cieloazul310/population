export function removeMultiple<T = unknown>(arr: T[], keyFunc: (item: T) => string | number): T[] {
  return arr.reduce<T[]>((accum, curr) => (accum.map((d) => keyFunc(d)).includes(keyFunc(curr)) ? accum : [...accum, curr]), []);
}
