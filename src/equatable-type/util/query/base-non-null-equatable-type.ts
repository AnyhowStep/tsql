import {NonNullEquatableType} from "../../equatable-type";

export type BaseNonNullEquatableType<T extends NonNullEquatableType> =
    T extends bigint ?
    bigint :
    T extends number ?
    number :
    T extends string ?
    string :
    T extends boolean ?
    boolean :
    //Date|Uint8Array|Decimal|CustomEquatableType do not have literal types
    T
;
