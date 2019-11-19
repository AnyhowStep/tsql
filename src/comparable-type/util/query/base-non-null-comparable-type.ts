import {NonNullComparableType} from "../../comparable-type";

export type BaseNonNullComparableType<T extends NonNullComparableType> = (
    T extends bigint ?
    bigint :
    T extends number ?
    number :
    T extends string ?
    string :
    T extends boolean ?
    boolean :
    //Date|Uint8Array|Decimal|CustomComparableType do not have literal types
    T
);
