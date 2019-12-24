import * as tm from "type-mapping";
import {TableWithPrimaryKey} from "../../../table";
import {IsolableUpdateConnection} from "../../connection";
import {AssignmentMapDelegate} from "../../../update";
import * as ExprLib from "../../../expr-library";
import {PrimaryKey_Input} from "../../../primary-key";
import {UpdateAndFetchOneByPrimaryKeyAssignmentMap, __updateAndFetchOneByPrimaryKeyHelper} from "./update-and-fetch-one-by-primary-key";
import {UpdateAndFetchZeroOrOneResult, updateAndFetchZeroOrOneImpl} from "./update-and-fetch-zero-or-one-impl";

export async function updateAndFetchZeroOrOneByPrimaryKey<
    TableT extends TableWithPrimaryKey,
    AssignmentMapT extends UpdateAndFetchOneByPrimaryKeyAssignmentMap<TableT>
> (
    table : TableT,
    connection : IsolableUpdateConnection,
    primaryKey : PrimaryKey_Input<TableT>,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<UpdateAndFetchZeroOrOneResult<TableT, AssignmentMapT>> {
    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateAndFetchZeroOrOneResult<TableT, AssignmentMapT>> => {
        const helperResult = await __updateAndFetchOneByPrimaryKeyHelper<
            TableT,
            AssignmentMapT
        >(
            table,
            connection,
            primaryKey,
            assignmentMapDelegate
        );
        if (!helperResult.success) {
            return {
                query : {
                    sql : helperResult.rowNotFoundError.sql,
                },

                //Alias for affectedRows
                foundRowCount : tm.BigInt(0) as 0n,

                //Alias for changedRows
                updatedRowCount : tm.BigInt(0) as 0n,

                /**
                 * May be the duplicate row count, or some other value.
                 */
                warningCount : tm.BigInt(0),
                /**
                 * An arbitrary message.
                 * May be an empty string.
                 */
                message : "",

                row : undefined,
            };
        }
        const {
            curPrimaryKey,
            assignmentMap,
            newPrimaryKey,
        } = helperResult;

        return updateAndFetchZeroOrOneImpl<
            TableT,
            AssignmentMapT
        >(
            table,
            connection,
            () => ExprLib.eqPrimaryKey(
                table,
                curPrimaryKey
            ) as any,
            () => ExprLib.eqPrimaryKey(
                table,
                newPrimaryKey
            ) as any,
            /**
             * This cast is unsound.
             * What we have is not `AssignmentMapT`.
             *
             * We have a `BuiltInExpr` version of `AssignmentMapT`,
             * with some parts possibly being evaluated to a value expression.
             *
             * However, this will not affect the correctness of
             * our results.
             */
            assignmentMap as any
        );
    });
}
