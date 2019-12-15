import {ITablePerType} from "../../table-per-type";
import {CandidateKey_NonUnion} from "../../../candidate-key";
import {StrictUnion, Identity, pickOwnEnumerable} from "../../../type-util";
import {IsolableUpdateConnection, ExecutionUtil} from "../../../execution";
import {MutableColumnAlias, ColumnType, ColumnAlias} from "../query";
import {CustomExpr_MapCorrelatedOrUndefined, CustomExprUtil} from "../../../custom-expr";
import {ColumnRefUtil} from "../../../column-ref";
import {ColumnUtil} from "../../../column";
import * as ExprLib from "../../../expr-library";
import {updateAndFetchOneImpl, UpdateAndFetchOneResult} from "./update-and-fetch-one-impl";
import {invokeAssignmentDelegate} from "./invoke-assignment-delegate";

export type CustomAssignmentMap<
    TptT extends ITablePerType
> =
    Identity<
        & {
            readonly [columnAlias in MutableColumnAlias<TptT>]? : (
                CustomExpr_MapCorrelatedOrUndefined<
                    (
                        | TptT["childTable"]["columns"]
                        | TptT["parentTables"][number]["columns"]
                    ),
                    ColumnType<TptT, columnAlias>
                >
            )
        }
        & {
            readonly [
                columnAlias in Exclude<
                    ColumnAlias<TptT>,
                    MutableColumnAlias<TptT>
                >
            ]? : undefined
        }
    >
;

export type AssignmentMapDelegate<
    TptT extends ITablePerType,
    AssignmentMapT extends CustomAssignmentMap<TptT>
> =
    (
        columns : ColumnRefUtil.FromColumnArray<
            ColumnUtil.FromColumnMap<
                | TptT["childTable"]["columns"]
                | TptT["parentTables"][number]["columns"]
            >[]
        >
    ) => AssignmentMapT
;

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
    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateAndFetchOneReturnType<TptT, AssignmentMapT>> => {
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
