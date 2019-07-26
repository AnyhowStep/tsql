import {NonNullPrimitiveExpr} from "../../primitive-expr";

export type ToNonNullableSuperType<T extends NonNullPrimitiveExpr> = (
    T extends bigint ?
    bigint :
    T extends number ?
    number :
    T extends string ?
    string :
    T extends boolean ?
    boolean :
    //Date|Buffer do not have literal types
    T
);
