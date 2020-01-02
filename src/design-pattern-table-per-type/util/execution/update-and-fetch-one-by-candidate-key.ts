import {ITablePerType} from "../../table-per-type";
import {CandidateKey_NonUnion} from "../../../candidate-key";
import {StrictUnion, Identity, pickOwnEnumerable} from "../../../type-util";
import {IsolableUpdateConnection, ExecutionUtil} from "../../../execution";
import {ColumnType, ColumnAlias} from "../query";
import {CustomExprUtil} from "../../../custom-expr";
import * as ExprLib from "../../../expr-library";
import {
    invokeAssignmentDelegate,
    updateAndFetchOneImpl,
    UpdateAndFetchOneResult,
} from "../execution-impl";
import {CustomAssignmentMap, AssignmentMapDelegate} from "./assignment-map";
import {IsolationLevel} from "../../../isolation-level";

export type UpdatedAndFetchedRow<
    TptT extends ITablePerType,
    AssignmentMapT extends CustomAssignmentMap<TptT>
> =
    Identity<{
        readonly [columnAlias in ColumnAlias<TptT>] : (
            columnAlias extends keyof AssignmentMapT ?
            (
                undefined extends AssignmentMapT[columnAlias] ?
                ColumnType<TptT, columnAlias> :
                CustomExprUtil.TypeOf<
                    AssignmentMapT[columnAlias]
                >
            ) :
            ColumnType<TptT, columnAlias>
        )
    }>
;

export type UpdateAndFetchOneReturnType<
    TptT extends ITablePerType,
    AssignmentMapT extends CustomAssignmentMap<TptT>
> =
    Identity<
        UpdateAndFetchOneResult<
            UpdatedAndFetchedRow<TptT, AssignmentMapT>
        >
    >
;

export async function updateAndFetchOneByCandidateKey<
    TptT extends ITablePerType,
    CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<TptT["childTable"]>>,
    AssignmentMapT extends CustomAssignmentMap<TptT>
> (
    tpt : TptT,
    connection : IsolableUpdateConnection,
    /**
     * @todo Try and recall why I wanted `AssertNonUnion<>`
     * I didn't write compile-time tests for it...
     */
    candidateKey : CandidateKeyT,// & AssertNonUnion<CandidateKeyT>,
    assignmentMapDelegate : AssignmentMapDelegate<TptT, AssignmentMapT>
) : Promise<UpdateAndFetchOneReturnType<TptT, AssignmentMapT>> {
    return connection.transactionIfNotInOne(IsolationLevel.REPEATABLE_READ, async (connection) : Promise<UpdateAndFetchOneReturnType<TptT, AssignmentMapT>> => {
        const cleanedAssignmentMap = await invokeAssignmentDelegate(
            tpt,
            connection,
            () => ExprLib.eqCandidateKey(
                tpt.childTable,
                candidateKey
            ),
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
            candidateKey,
            () => pickOwnEnumerable(
                cleanedAssignmentMap,
                tpt.childTable.mutableColumns
            )
        );
        return updateAndFetchOneImpl(
            tpt,
            connection,
            cleanedAssignmentMap,
            updateAndFetchChildResult
        ) as Promise<UpdateAndFetchOneReturnType<TptT, AssignmentMapT>>;
    });
}
