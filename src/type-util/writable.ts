export type Writable<T> = (
    T extends any ?
    {
        -readonly [k in keyof T] : T[k]
    } :
    never
);