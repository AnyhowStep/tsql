/**
 * https://github.com/microsoft/TypeScript/issues/33457
 *
 * Like `ReturnType<>`.
 * But better.
 */
export type BetterReturnType<T extends (...args : never) => any> =
    T extends (...args : never) => infer R ?
    R :
    never
;
