import {ITablePerType} from "../../table-per-type";
import {pickOwnEnumerable} from "../../../type-util";
import {IsolableUpdateConnection, ExecutionUtil} from "../../../execution";
import * as ExprLib from "../../../expr-library";
import {updateAndFetchOneImpl} from "./update-and-fetch-one-impl";
import {invokeAssignmentDelegate} from "./invoke-assignment-delegate";
import {PrimaryKey_Input} from "../../../primary-key";
import {
    CustomAssignmentMap,
    AssignmentMapDelegate,
    UpdateAndFetchOneReturnType,
} from "./update-and-fetch-one-by-candidate-key";

export async function updateAndFetchOneByPrimaryKey<
    TptT extends ITablePerType,
    AssignmentMapT extends CustomAssignmentMap<TptT>
> (
    tpt : TptT,
    connection : IsolableUpdateConnection,
    primaryKey : PrimaryKey_Input<TptT["childTable"]>,
    assignmentMapDelegate : AssignmentMapDelegate<TptT, AssignmentMapT>
) : Promise<UpdateAndFetchOneReturnType<TptT, AssignmentMapT>> {
    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateAndFetchOneReturnType<TptT, AssignmentMapT>> => {
        const cleanedAssignmentMap = await invokeAssignmentDelegate(
            tpt,
            connection,
            () => ExprLib.eqPrimaryKey(
                tpt.childTable,
                primaryKey
            ) as any,
            assignmentMapDelegate
        );
        /**
         * @todo If `result` contains any primaryKey values,
         * then we will need to fetch the **current** primaryKey values,
         * before any `UPDATE` statements are executed.
         *
         * This function breaks if we try to update values
         * of columns that are foreign keys.
         *
         * I do not want to disable foreign key checks.
         */
        const updateAndFetchChildResult = await ExecutionUtil.updateAndFetchOneByPrimaryKey(
            tpt.childTable,
            connection,
            primaryKey,
            () => pickOwnEnumerable(
                cleanedAssignmentMap,
                tpt.childTable.mutableColumns
            ) as any
        );
        return updateAndFetchOneImpl(
            tpt,
            connection,
            cleanedAssignmentMap,
            updateAndFetchChildResult
        ) as Promise<UpdateAndFetchOneReturnType<TptT, AssignmentMapT>>;
    });
}
