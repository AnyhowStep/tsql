import {Key} from "../../key";

/**
 * https://github.com/microsoft/TypeScript/issues/32540#issuecomment-514931644
 *
 * This works and I have no idea why.
 * Please don't kill me.
 *
 * If `A` is a subkey of `B`, it returns `A`.
 * Otherwise, it returns `never`.
 */
export type ExtractSubKey<
    A extends Key,
    B extends Key
> = (
    A extends Key ?
    (
        B extends Key ?
        (
            A[number] extends Extract<B[number], A[number]> ?
            A :
            never
        ) :
        never
    ) :
    never
);
