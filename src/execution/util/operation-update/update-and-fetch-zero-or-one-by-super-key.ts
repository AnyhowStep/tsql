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
    AssignmentMapT extends UpdateAndFetchOneBySuperKeyAssignmentMap<TableT, SuperKeyT>
> (
    connection : IsolableUpdateConnection,
    table : TableT,
    superKey : SuperKeyT & AssertNonUnion<SuperKeyT>,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<UpdateAndFetchZeroOrOneResult<TableT, AssignmentMapT>> {
    const {
        curSuperKey,
        assignmentMap,
        newSuperKey,
    } = __updateAndFetchOneBySuperKeyHelper<
        TableT,
        SuperKeyT,
        AssignmentMapT
    >(
        table,
        superKey,
        assignmentMapDelegate
    );

    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateAndFetchZeroOrOneResult<TableT, AssignmentMapT>> => {
        const updateZeroOrOneResult = await updateZeroOrOne(
            connection,
            table,
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
                connection,
                table,
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
