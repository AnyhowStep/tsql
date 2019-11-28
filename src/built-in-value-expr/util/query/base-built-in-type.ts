import {BuiltInValueExpr} from "../../built-in-value-expr";
import {BaseNonNullBuiltInType} from "./base-non-null-built-in-type";

export type BaseBuiltInType<T extends BuiltInValueExpr> = (
    (
        null extends T ?
        null :
        never
    ) |
    BaseNonNullBuiltInType<Exclude<T, null>>
);
