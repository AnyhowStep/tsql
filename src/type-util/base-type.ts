export type BaseType<T extends unknown> = (
    T extends bigint ?
    bigint :
    T extends number ?
    number :
    T extends string ?
    string :
    T extends boolean ?
    boolean :
    //Everything else does not have a literal type
    T
);
