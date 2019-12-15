import * as tm from "type-mapping";
import {DeletableTablePerType} from "../../table-per-type";
import {ExecutionUtil, IsolableDeleteConnection} from "../../../execution";
import {primaryKeyColumnAliases, findTableWithColumnAlias} from "../query";
import * as ExprLib from "../../../expr-library";
import {TableWithPrimaryKey} from "../../../table";
import {from} from "../execution-impl";
import {From} from "./from";
import {WhereDelegate} from "../../../where-clause";

export interface DeleteOneResult {
    deleteOneResults : (
        & ExecutionUtil.DeleteOneResult
        & {
            table : TableWithPrimaryKey,
        }
    )[],

    //Alias for affectedRows
    deletedRowCount : bigint;

    /**
     * @todo MySQL sometimes gives a `warningCount` value `> 0` for
     * `DELETE` statements. Recall why.
     */
    warningCount : bigint;
}

export async function deleteOneImpl<
    TptT extends DeletableTablePerType
> (
    tpt : TptT,
    connection : IsolableDeleteConnection,
    whereDelegate : WhereDelegate<From<TptT>["fromClause"]>
) : Promise<DeleteOneResult> {
    /**
     * @todo Add `assertDeletable()` or something
     */
    return connection.transactionIfNotInOne(async (connection) : Promise<DeleteOneResult> => {
        const primaryKeys = await ExecutionUtil.fetchOne(
            from(tpt)
                .where(whereDelegate)
                .select(() => primaryKeyColumnAliases(tpt).map(columnAlias => {
                    const table = findTableWithColumnAlias(tpt, columnAlias);
                    return table.columns[columnAlias];
                }) as any) as any,
            connection
        );

        const deleteChildResult = await ExecutionUtil.deleteOne(
            tpt.childTable,
            connection,
            () => ExprLib.eqPrimaryKey(
                tpt.childTable,
                primaryKeys as any
            )
        );
        const deleteOneResults : DeleteOneResult["deleteOneResults"] = [
            {
                ...deleteChildResult,
                table : tpt.childTable,
            },
        ];
        let deletedRowCount : bigint = deleteChildResult.deletedRowCount;
        let warningCount : bigint = deleteChildResult.warningCount;

        /**
         * We use `.reverse()` here to `DELETE` the parents
         * as we go up the inheritance hierarchy.
         */
        for(const parentTable of [...tpt.parentTables].reverse()) {
            const deleteParentResult = await ExecutionUtil.deleteOne(
                parentTable,
                connection,
                () => ExprLib.eqPrimaryKey(
                    parentTable,
                    primaryKeys as any
                )
            );
            deleteOneResults.push({
                ...deleteParentResult,
                table : parentTable,
            });
            deletedRowCount = tm.BigIntUtil.add(
                deletedRowCount,
                deleteParentResult.deletedRowCount
            );
            warningCount = tm.BigIntUtil.add(
                warningCount,
                deleteParentResult.warningCount
            );
        }

        return {
            deleteOneResults,

            deletedRowCount,

            warningCount,
        };
    });
}
