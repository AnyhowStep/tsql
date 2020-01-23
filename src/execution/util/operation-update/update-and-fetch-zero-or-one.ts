import {ITable, TableUtil} from "../../../table";
import {IsolableUpdateConnection} from "../../connection";
import {AssignmentMapDelegate} from "../../../update";
import * as ExprLib from "../../../expr-library";
import {UpdateAndFetchZeroOrOneResult, updateAndFetchZeroOrOneImpl} from "./update-and-fetch-zero-or-one-impl";
import {WhereDelegate} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {__updateAndFetchOneHelper, UpdateAndFetchOneAssignmentMap} from "./update-and-fetch-one";

export async function updateAndFetchZeroOrOne<
    TableT extends ITable,
    AssignmentMapT extends UpdateAndFetchOneAssignmentMap<TableT>
> (
    table : TableT & TableUtil.AssertHasCandidateKey<TableT>,
    connection : IsolableUpdateConnection,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<UpdateAndFetchZeroOrOneResult<TableT, AssignmentMapT>> {
    return updateAndFetchZeroOrOneImpl<
        TableT,
        AssignmentMapT
    >(
        table,
        connection,
        async (connection) => {
            const helperResult = await __updateAndFetchOneHelper<
                TableT,
                AssignmentMapT
            >(
                table,
                connection,
                whereDelegate,
                assignmentMapDelegate
            );
            if (!helperResult.success) {
                return helperResult;
            }
            const {
                curCandidateKey,
                assignmentMap,
                newCandidateKey,
            } = helperResult;
            return {
                success : true,
                updateWhereDelegate : () => ExprLib.eqCandidateKey(
                    table,
                    curCandidateKey
                ) as any,
                fetchWhereDelegate : () => ExprLib.eqCandidateKey(
                    table,
                    newCandidateKey
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
