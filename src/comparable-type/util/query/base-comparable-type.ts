import {ComparableType} from "../../comparable-type";
import {BaseNonNullComparableType} from "./base-non-null-comparable-type";

export type BaseComparableType<T extends ComparableType> = (
    (
        null extends T ?
        null :
        never
    ) |
    BaseNonNullComparableType<Exclude<T, null>>
);
