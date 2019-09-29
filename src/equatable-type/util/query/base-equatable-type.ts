import {EquatableType} from "../../equatable-type";
import {BaseNonNullEquatableType} from "./base-non-null-equatable-type";

export type BaseEquatableType<T extends EquatableType> = (
    (
        null extends T ?
        null :
        never
    ) |
    BaseNonNullEquatableType<Exclude<T, null>>
);
