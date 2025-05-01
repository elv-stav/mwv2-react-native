// This didn't work. I'm not sure why honestly
// export {};
//
// declare module 'zod' {
//   interface ZodType<Output, Def extends ZodTypeDef, Input> {
//     nullishToOptional: () => ZodOptional<this>;
//   }
// }
//
// ZodType.prototype.nullishToOptional = function () {
//   return this.nullish().transform(x => x ?? undefined).optional();
// };

/**
 * Takes in nullish values (null or undefined) and transforms them to optional values (undefined).
 * This is because the backend is very loosey-goosey with optional/missing values.
 */
export function nullToUndefined<T>(t: T | undefined | null): T | undefined {
  return t ?? undefined;
}
