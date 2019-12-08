import {ITable} from "../../table";
import {columnAlias} from "./column-alias";
import {ExplicitAutoIncrement, isExplicitAutoIncrement} from "./explicit-auto-increment";

export type OptionalColumnAlias<TableT extends ITable> =
    | ExplicitAutoIncrement<TableT>
    | Exclude<
        (
            | TableT["nullableColumns"][number]
            | TableT["explicitDefaultValueColumns"][number]
        ),
        (
            | TableT["generatedColumns"][number]
        )
    >
;
export function isOptionalColumnAlias<TableT extends ITable> (
    table : TableT,
    columnAlias : string
) : columnAlias is OptionalColumnAlias<TableT> {
    return (
        isExplicitAutoIncrement(table, columnAlias) ||
        (
            (
                table.nullableColumns.indexOf(columnAlias) >= 0 ||
                table.explicitDefaultValueColumns.indexOf(columnAlias) >= 0
            ) &&
            table.generatedColumns.indexOf(columnAlias) < 0
        )
    );
}
export function optionalColumnAlias<TableT extends ITable> (
    table : TableT
) : OptionalColumnAlias<TableT>[] {
    return (columnAlias(table) as string[]).filter<OptionalColumnAlias<TableT>>(
        (columnAlias) : columnAlias is OptionalColumnAlias<TableT> => (
            isOptionalColumnAlias(table, columnAlias)
        )
    );
}
