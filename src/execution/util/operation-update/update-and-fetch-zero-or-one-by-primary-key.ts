import * as tm from "type-mapping";
import {TableUtil, TableWithPrimaryKey} from "../../../table";
import {IsolableUpdateConnection} from "../../connection";
import {AssignmentMapDelegate} from "../../../update";
import {UpdateOneResult} from "./update-one";
import * as ExprLib from "../../../expr-library";
import {PrimaryKey_Input} from "../../../primary-key";
import {UpdateAndFetchOneByPrimaryKeyAssignmentMap, __updateAndFetchOneByPrimaryKeyHelper} from "./update-and-fetch-one-by-primary-key";
import {UpdateAndFetchZeroOrOneResult} from "./update-and-fetch-zero-or-one-by-candidate-key";
import {updateZeroOrOne, NotFoundUpdateResult} from "./update-zero-or-one";

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
            throw helperResult.rowNotFoundError;
        }
        const {
            curPrimaryKey,
            assignmentMap,
            newPrimaryKey,
        } = helperResult;

        const updateZeroOrOneResult = await updateZeroOrOne(
            table,
            connection,
            () => ExprLib.eqPrimaryKey(
                table,
                curPrimaryKey
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
                () => ExprLib.eqPrimaryKey(
                    table,
                    newPrimaryKey
                ) as any
            );
            return {
                ...updateOneResult,
                row,
            };
        }
    });
}
