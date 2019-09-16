/**
 * ```ts
 * declare const t;
 *
 * //TypeOfAwait<typeof t>;
 * const x = await t;
 * ```
 */
export type TypeOfAwait<T> =
    T extends PromiseLike<infer U> ?
    U :
    T
;
