import {NonNullBuiltInValueExpr} from "../../built-in-value-expr";

export type BaseNonNullBuiltInType<T extends NonNullBuiltInValueExpr> = (
    T extends bigint ?
    bigint :
    T extends number ?
    number :
    T extends string ?
    string :
    T extends boolean ?
    boolean :
    //Date|Uint8Array do not have literal types
    T
);
