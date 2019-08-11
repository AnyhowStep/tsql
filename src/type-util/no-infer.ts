/**
 * https://github.com/microsoft/TypeScript/issues/14829#issuecomment-504042546
 *
 * Sometimes, we use a generic type parameter twice.
 * However, we only want inference on the first usage and not the second.
 *
 * This is a workaround.
 */
export type NoInfer<T> = [T][T extends any ? 0 : never];

/**
 * https://github.com/microsoft/TypeScript/issues/14829#issuecomment-320833603
 *
 * Sometimes, we use a generic type parameter twice.
 * However, we only want inference on the first usage and not the second.
 *
 * This is a workaround.
 *
 * Unusable if `T` may be `null` or `undefined`,
 * https://github.com/microsoft/TypeScript/issues/14829#issuecomment-322267089
 */
export type InferLast<T> = T & {};
