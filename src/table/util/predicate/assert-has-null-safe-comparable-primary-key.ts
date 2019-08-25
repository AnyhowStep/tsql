import {ColumnMap, ColumnMapUtil} from "../../../column-map";
import {TableWithPrimaryKey} from "../../table";
import {HasNullSafeComparablePrimaryKey, hasNullSafeComparablePrimaryKey as hasNullSafeComparablePrimaryKey} from "./has-null-safe-comparable-primary-key";
import {CompileError} from "../../../compile-error";
import {TypeMapUtil} from "../../../type-map";
import {Writable, DistributePick} from "../../../type-util";

/**
 * Returns `unknown` if all primary key columns of `TableT`
 * are **null-safe** comparable with columns in `ColumnMapT` that have the same name
 *
 * Assumes `TableT` is not a union
 */
export type AssertHasNullSafeComparablePrimaryKey<
    TableT extends Pick<TableWithPrimaryKey, "columns"|"primaryKey">,
    ColumnMapT extends ColumnMap
> = (
    HasNullSafeComparablePrimaryKey<TableT, ColumnMapT> extends true ?
    unknown :
    CompileError<[
        Writable<
            TypeMapUtil.FromColumnMap<
                DistributePick<TableT["columns"], TableT["primaryKey"][number]>
            >
        >,
        "is not null-safe comparable to",
        Writable<
            TypeMapUtil.FromColumnMap<
                Pick<ColumnMapT, Extract<TableT["primaryKey"][number], keyof ColumnMapT>>
            >
        >
    ]>
);

export function assertHasNullSafeComparablePrimaryKey (
    table : Pick<TableWithPrimaryKey, "columns"|"primaryKey">,
    columnMap : ColumnMap
) {
    if (!hasNullSafeComparablePrimaryKey(table, columnMap)) {
        const myTableAlias = ColumnMapUtil.tableAlias(table.columns);
        const myPrimaryKey = table.primaryKey.join(",");

        const otherTableAlias = ColumnMapUtil.tableAlias(columnMap);
        const otherColumnAliases = table.primaryKey
            .filter(
                pk => (
                    Object.prototype.hasOwnProperty.call(columnMap, pk) &&
                    Object.prototype.propertyIsEnumerable.call(columnMap, pk)
                )
            )
            .join(",");

        throw new Error(`${myTableAlias} primary key (${myPrimaryKey}) is not null-safe comparable to ${otherTableAlias} (${otherColumnAliases})`);
    }
}
