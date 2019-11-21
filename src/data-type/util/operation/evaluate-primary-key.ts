import {TableWithPrimaryKey} from "../../../table";
import {SelectConnection} from "../../../execution";
import {tryEvaluateColumns, EvaluateColumnsInputRow, TryEvaluateColumnsResult} from "./evaluate-columns";

/**
 * This allows custom data types
 */
export type EvaluatePrimaryKeyInputRow<TableT extends TableWithPrimaryKey> =
    EvaluateColumnsInputRow<
        TableT,
        TableT["primaryKey"][number]
    >
;

export type TryEvaluatePrimaryKeyResult<
    TableT extends TableWithPrimaryKey
> =
    TryEvaluateColumnsResult<
        TableT,
        TableT["primaryKey"][number]
    >
;

export async function tryEvaluatePrimaryKey<
    TableT extends TableWithPrimaryKey
> (
    table : TableT,
    connection : SelectConnection,
    row : EvaluatePrimaryKeyInputRow<TableT>
) : Promise<TryEvaluatePrimaryKeyResult<TableT>> {
    return tryEvaluateColumns(
        table,
        connection,
        `${table.alias}.primaryKey`,
        table.primaryKey,
        row
    );
}
