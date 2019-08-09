import {PrimitiveExpr} from "../../primitive-expr";
import {NonNullPrimitiveType} from "./non-null-primitive-type";

export type PrimitiveType<T extends PrimitiveExpr> = (
    (
        null extends T ?
        null :
        never
    ) |
    NonNullPrimitiveType<Exclude<T, null>>
);
