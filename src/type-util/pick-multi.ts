import {Identity} from "./identity";

/**
 * + Assumes `T` is not a union
 * + Lets `KeyT` be a union
 */
export type PickMulti<
    T,
    KeyT extends readonly (keyof T)[]
> = (
    KeyT extends readonly (keyof T)[] ?
    Pick<T, KeyT[number]> :
    never
);

/**
 * + Assumes `T` may be union
 * + Assumes `KeyT` may not be key of all elements of `T`
 */
export type DistributePick<
    T,
    KeyT extends PropertyKey
> =
    T extends any ?
    Pick<T, Extract<KeyT, keyof T>> :
    never
;

export type ReadOnlyPick<T, K extends keyof T> =
    Identity<{
        readonly [k in K] : T[k]
    }>
;

export type ExpandPick<T, K extends keyof T> =
    Identity<{
        [k in K] : T[k]
    }>
;
