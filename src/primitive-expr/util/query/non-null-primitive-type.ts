import {NonNullPrimitiveExpr} from "../../primitive-expr";

export type NonNullPrimitiveType<T extends NonNullPrimitiveExpr> = (
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
