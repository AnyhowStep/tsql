import * as tm from "type-mapping";
import {ITablePerType} from "../../table-per-type";
import {pickOwnEnumerable} from "../../../type-util";
import {IsolableUpdateConnection, ExecutionUtil} from "../../../execution";
import {TableWithPrimaryKey} from "../../../table";
import {UpdateOneResult} from "../../../execution/util";
import {absorbRow} from "./absorb-row";
import {IsolationLevel} from "../../../isolation-level";

export interface UpdateAndFetchOneResult<RowT> {
    updateOneResults : (
        & UpdateOneResult
        & {
            table : TableWithPrimaryKey,
        }
    )[],

    //Alias for affectedRows
    foundRowCount : bigint;

    /**
     * You cannot trust this number for SQLite.
     * SQLite thinks that all found rows are updated, even if you set `x = x`.
     *
     * @todo Consider renaming this to `unreliableUpdatedRowCount`?
     */
    //Alias for changedRows
    updatedRowCount : bigint;

    /**
     * May be the duplicate row count, or some other value.
     */
    warningCount : bigint;

    row : RowT,
}

/**
 * Not meant to be called externally
 */
export async function updateAndFetchOneImpl<
    TptT extends ITablePerType
> (
    tpt : TptT,
    connection : IsolableUpdateConnection,
    cleanedAssignmentMap : Record<string, unknown>,
    updateAndFetchChildResult : ExecutionUtil.UpdateAndFetchOneResult<any, any>
) : Promise<UpdateAndFetchOneResult<Record<string, unknown>>> {
    return connection.transactionIfNotInOne(IsolationLevel.REPEATABLE_READ, async (connection) : Promise<UpdateAndFetchOneResult<Record<string, unknown>>> => {
        const updateOneResults : UpdateAndFetchOneResult<any>["updateOneResults"] = [
            {
                ...updateAndFetchChildResult,
                table : tpt.childTable,
            },
        ];
        let updatedRowCount : bigint = updateAndFetchChildResult.updatedRowCount;
        let warningCount : bigint = updateAndFetchChildResult.warningCount;

        const result : Record<string, unknown> = updateAndFetchChildResult.row;

        /**
         * We use `.reverse()` here to `UPDATE` the parents
         * as we go up the inheritance hierarchy.
         */
        for(const parentTable of [...tpt.parentTables].reverse()) {
            const updateAndFetchParentResult = await ExecutionUtil.updateAndFetchOneByPrimaryKey(
                parentTable,
                connection,
                /**
                 * The `result` should contain the primary key values we are interested in
                 */
                result,
                () => pickOwnEnumerable(
                    cleanedAssignmentMap,
                    parentTable.mutableColumns
                )
            );
            updateOneResults.push({
                ...updateAndFetchParentResult,
                table : parentTable,
            });
            updatedRowCount = tm.BigIntUtil.add(
                updatedRowCount,
                updateAndFetchParentResult.updatedRowCount
            );
            warningCount = tm.BigIntUtil.add(
                warningCount,
                updateAndFetchParentResult.warningCount
            );

            absorbRow(result, parentTable, updateAndFetchParentResult.row);
        }

        return {
            updateOneResults,
            /**
             * +1 for the `childTable`.
             */
            foundRowCount : tm.BigInt(tpt.parentTables.length + 1),
            updatedRowCount,

            warningCount,

            row : result as Record<string, unknown>,
        };
    });
}
