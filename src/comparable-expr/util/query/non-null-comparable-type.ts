import {NonNullComparableExpr} from "../../comparable-expr";

export type NonNullComparableType<T extends NonNullComparableExpr> = (
    T extends bigint ?
    bigint :
    T extends number ?
    number :
    T extends string ?
    string :
    T extends boolean ?
    boolean :
    //Date|Buffer|Decimal do not have literal types
    T
);
