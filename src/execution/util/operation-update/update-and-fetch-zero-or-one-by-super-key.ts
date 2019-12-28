import {ITable} from "../../../table";
import {IsolableUpdateConnection} from "../../connection";
import {AssignmentMapDelegate} from "../../../update";
import {AssertNonUnion} from "../../../type-util";
import * as ExprLib from "../../../expr-library";
import {SuperKey_Input} from "../../../super-key";
import {UpdateAndFetchOneBySuperKeyAssignmentMap, __updateAndFetchOneBySuperKeyHelper} from "./update-and-fetch-one-by-super-key";
import {UpdateAndFetchZeroOrOneResult, updateAndFetchZeroOrOneImpl} from "./update-and-fetch-zero-or-one-impl";

export async function updateAndFetchZeroOrOneBySuperKey<
    TableT extends ITable,
    SuperKeyT extends SuperKey_Input<TableT>,
    AssignmentMapT extends UpdateAndFetchOneBySuperKeyAssignmentMap<TableT>
> (
    table : TableT,
    connection : IsolableUpdateConnection,
    superKey : SuperKeyT & AssertNonUnion<SuperKeyT>,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<UpdateAndFetchZeroOrOneResult<TableT, AssignmentMapT>> {
    return updateAndFetchZeroOrOneImpl<
        TableT,
        AssignmentMapT
    >(
        table,
        connection,
        async (connection) => {
            const helperResult = await __updateAndFetchOneBySuperKeyHelper<
                TableT,
                SuperKeyT,
                AssignmentMapT
            >(
                table,
                connection,
                superKey,
                assignmentMapDelegate
            );
            if (!helperResult.success) {
                return helperResult;
            }
            const {
                curSuperKey,
                assignmentMap,
                newSuperKey,
            } = helperResult;
            return {
                success : true,
                updateWhereDelegate : () => ExprLib.eqSuperKey(
                    table,
                    curSuperKey
                ) as any,
                fetchWhereDelegate : () => ExprLib.eqSuperKey(
                    table,
                    newSuperKey
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
