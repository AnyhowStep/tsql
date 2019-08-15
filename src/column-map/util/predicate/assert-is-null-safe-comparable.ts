import {ColumnMap} from "../../column-map";
import {IsNullSafeComparable, isNullSafeComparable} from "./is-null-safe-comparable";
import {CompileError} from "../../../compile-error";
import {TypeMapUtil} from "../../../type-map";
import * as TypeUtil from "../../../type-util";
import {tableAlias} from "../query";
import {Writable} from "../../../type-util";

/**
 * Returns `unknown` if all columns of `A`
 * are **null-safe** comparable with columns in `B` that have the same name
 *
 * The column aliases of `A` must be a subset of the column aliases of `B`,
 * or the result will never `extends unknown`
 *
 * + Assumes `A` is not a union
 * + Assumes `B` is not a union
 */
export type AssertIsNullSafeComparable<
    A extends ColumnMap,
    B extends ColumnMap
> = (
    IsNullSafeComparable<A, B> extends true ?
    unknown :
    CompileError<[
        Writable<TypeMapUtil.FromColumnMap<A>>,
        "is not null-safe comparable to",
        Writable<TypeMapUtil.FromColumnMap<B>>
    ]>
);

export function assertIsNullSafeComparable (
    a : ColumnMap,
    b : ColumnMap
) {
    if (!isNullSafeComparable(a, b)) {
        const myTableAlias = tableAlias(a);
        const myColumnAliases = Object.keys(a).join(",");

        const otherTableAlias = tableAlias(b);
        const otherColumnAliases = Object.keys(a)
            .filter(
                myColumnAlias => (
                    Object.prototype.hasOwnProperty.call(b, myColumnAlias) &&
                    Object.prototype.propertyIsEnumerable.call(b, myColumnAlias)
                )
            )
            .join(",");

        throw new Error(`${myTableAlias} (${myColumnAliases}) is not null-safe comparable to ${otherTableAlias} (${otherColumnAliases})`);
    }
}
