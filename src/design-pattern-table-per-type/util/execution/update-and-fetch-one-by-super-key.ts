import {ITablePerType} from "../../table-per-type";
import {pickOwnEnumerable} from "../../../type-util";
import {IsolableUpdateConnection, ExecutionUtil} from "../../../execution";
import {UpdateAndFetchOneReturnType} from "./update-and-fetch-one-by-candidate-key";
import {SuperKey} from "../query";
import {eqSuperKey} from "../operation";
import {invokeAssignmentDelegate, updateAndFetchOneImpl} from "../execution-impl";
import {CustomAssignmentMap, AssignmentMapDelegate} from "./assignment-map";
import {IsolationLevel} from "../../../isolation-level";

export async function updateAndFetchOneBySuperKey<
    TptT extends ITablePerType,
    AssignmentMapT extends CustomAssignmentMap<TptT>
> (
    tpt : TptT,
    connection : IsolableUpdateConnection,
    superKey : SuperKey<TptT>,
    assignmentMapDelegate : AssignmentMapDelegate<TptT, AssignmentMapT>
) : Promise<UpdateAndFetchOneReturnType<TptT, AssignmentMapT>> {
    return connection.transactionIfNotInOne(IsolationLevel.REPEATABLE_READ, async (connection) : Promise<UpdateAndFetchOneReturnType<TptT, AssignmentMapT>> => {
        const cleanedAssignmentMap = await invokeAssignmentDelegate(
            tpt,
            connection,
            () => eqSuperKey(
                tpt,
                superKey
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
        const updateAndFetchChildResult = await ExecutionUtil.updateAndFetchOneByCandidateKey(
            tpt.childTable,
            connection,
            /**
             * We have already used the `superKey` to "clean" our assignment map.
             * So, we can be reasonably sure that the `superKey` itself
             * refers to exactly one row that exists.
             *
             * Now, we can pretend this `superKey` is a `candidateKey`,
             * discarding all non-key columns.
             *
             * This should not introduce any bugs.
             */
            superKey,
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
