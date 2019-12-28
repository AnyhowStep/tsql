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
    return updateAndFetchZeroOrOneImpl<
        TableT,
        AssignmentMapT
    >(
        table,
        connection,
        async (connection) => {
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
                return helperResult;
            }
            const {
                curPrimaryKey,
                assignmentMap,
                newPrimaryKey,
            } = helperResult;
            return {
                success : true,
                updateWhereDelegate : () => ExprLib.eqPrimaryKey(
                    table,
                    curPrimaryKey
                ) as any,
                fetchWhereDelegate : () => ExprLib.eqPrimaryKey(
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
                assignmentMap : assignmentMap as AssignmentMapT,
            };
        }
    );
}
