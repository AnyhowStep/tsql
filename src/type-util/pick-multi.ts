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
