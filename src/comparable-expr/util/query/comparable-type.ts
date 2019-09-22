import {ComparableExpr} from "../../comparable-expr";
import {NonNullComparableType} from "./non-null-comparable-type";

export type ComparableType<T extends ComparableExpr> = (
    (
        null extends T ?
        null :
        never
    ) |
    NonNullComparableType<Exclude<T, null>>
);
