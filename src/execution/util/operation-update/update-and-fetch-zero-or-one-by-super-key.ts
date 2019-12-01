import * as tm from "type-mapping";
import {ITable, TableUtil} from "../../../table";
import {IsolableUpdateConnection} from "../../connection";
import {AssignmentMapDelegate} from "../../../update";
import {AssertNonUnion} from "../../../type-util";
import {UpdateOneResult} from "./update-one";
import * as ExprLib from "../../../expr-library";
import {SuperKey_Input} from "../../../super-key";
import {UpdateAndFetchOneBySuperKeyAssignmentMap, __updateAndFetchOneBySuperKeyHelper} from "./update-and-fetch-one-by-super-key";
import {UpdateAndFetchZeroOrOneResult} from "./update-and-fetch-zero-or-one-by-candidate-key";
import {updateZeroOrOne, NotFoundUpdateResult} from "./update-zero-or-one";

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
    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateAndFetchZeroOrOneResult<TableT, AssignmentMapT>> => {
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
            curSuperKey,
            assignmentMap,
            newSuperKey,
        } = helperResult;

        const updateZeroOrOneResult = await updateZeroOrOne(
            table,
            connection,
            () => ExprLib.eqSuperKey(
                table,
                curSuperKey
            ) as any,
            () => assignmentMap
        );
        if (tm.BigIntUtil.equal(updateZeroOrOneResult.foundRowCount, tm.BigInt(0))) {
            const notFoundUpdateResult = updateZeroOrOneResult as NotFoundUpdateResult;
            return {
                ...notFoundUpdateResult,
                row : undefined,
            };
        } else {
            const updateOneResult = updateZeroOrOneResult as UpdateOneResult;
            const row = await TableUtil.__fetchOneHelper(
                table,
                connection,
                () => ExprLib.eqSuperKey(
                    table,
                    newSuperKey
                ) as any
            );
            return {
                ...updateOneResult,
                row,
            };
        }
    });
}
