/*
 * This is actually broken,
 * + https://github.com/pirix-gh/ts-toolbelt/issues/97
 * + https://github.com/microsoft/TypeScript/issues/37314
 */
/*
export type IsStrictSameType<A1 extends any, A2 extends any> =
    (<A>() => A extends A1 ? true : false) extends (<A>() => A extends A2 ? true : false)
    ? true
    : false
;
*/
export type IsStrictSameType<A1 extends any, A2 extends any> =
    [A1] extends [A2] ?
    (
        [A2] extends [A1] ?
        true :
        false
    ) :
    false
;
export type ExtractStrictSameType<
    A1,
    A2
> =
    A1 extends any ?
    (
        IsStrictSameType<A1, A2> extends true ?
        A1 :
        never
    ) :
    never
;
/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-521819804
 *
 * @todo Support both `A1` and `A2` being union types
 * At the moment, it only works right if `A2` is not a union
 */
export type TryReuseExistingType<
    A1,
    A2
> =
    ExtractStrictSameType<A1, A2> extends never ?
    //Could not reuse anything in `A1`
    A2 :
    //We can reuse something in `A1`
    ExtractStrictSameType<A1, A2>
;
