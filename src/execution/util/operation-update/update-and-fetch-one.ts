import {ITable, TableUtil} from "../../../table";
import {IsolableUpdateConnection, SelectConnection} from "../../connection";
import {AssignmentMapDelegate, CustomAssignmentMap} from "../../../update";
import {Identity, StrictUnion} from "../../../type-util";
import {CustomExpr_MapCorrelatedOrUndefined} from "../../../custom-expr";
import * as ExprLib from "../../../expr-library";
import {RowNotFoundError} from "../../../error";
import {updateAndFetchOneImpl, UpdateAndFetchOneResult} from "./update-and-fetch-one-impl";
import {WhereDelegate} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {CandidateKey_Input} from "../../../candidate-key";
import {QueryUtil} from "../../../unified-query";
import {ExecutionUtil} from "../..";
import {__updateAndFetchOneByCandidateKeyHelper} from "./update-and-fetch-one-by-candidate-key";

export type UpdateAndFetchOneAssignmentMapImpl<
    TableT extends Pick<ITable, "columns"|"mutableColumns">
> =
    Identity<
        & {
            readonly [columnAlias in TableT["mutableColumns"][number]]? : (
                CustomExpr_MapCorrelatedOrUndefined<
                    TableT["columns"],
                    ReturnType<
                        TableT["columns"][columnAlias]["mapper"]
                    >
                >
            )
        }
        & {
            readonly [
                columnAlias in Exclude<
                    TableUtil.ColumnAlias<TableT>,
                    TableT["mutableColumns"][number]
                >
            ]? : undefined
        }
    >
;

export type UpdateAndFetchOneAssignmentMap<
    TableT extends Pick<ITable, "columns"|"mutableColumns">
> =
    Extract<
        /**
         * @todo Investigate assignability
         */
        UpdateAndFetchOneAssignmentMapImpl<TableT>,
        CustomAssignmentMap<TableT>
    >
;

/**
 * Not meant to be called externally
 *
 * @todo Better name
 */
export async function __updateAndFetchOneHelper<
    TableT extends ITable,
    AssignmentMapT extends UpdateAndFetchOneAssignmentMap<TableT>
> (
    table : TableT & TableUtil.AssertHasCandidateKey<TableT>,
    connection : SelectConnection,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<
    | {
        success : false,
        rowNotFoundError : RowNotFoundError,
    }
    | {
        success : true,
        curCandidateKey : StrictUnion<CandidateKey_Input<TableT>>,
        assignmentMap : UpdateAndFetchOneAssignmentMap<TableT>,
        newCandidateKey : StrictUnion<CandidateKey_Input<TableT>>,
    }
> {
    TableUtil.assertHasCandidateKey(table);

    /**
     * Prefer `primaryKey`
     */
    const candidateKeyColumnAliases = table.primaryKey != undefined ?
        table.primaryKey :
        table.candidateKeys[0];
    const curCandidateKeyOrError = await ExecutionUtil
        .fetchOne(
            QueryUtil.newInstance()
                .from(
                    table as unknown as (
                        & TableT
                        & QueryUtil.AssertValidCurrentJoin<QueryUtil.NewInstance, TableT>
                    )
                )
                .where(whereDelegate)
                .select((columns) => candidateKeyColumnAliases.map(
                    columnAlias => columns[columnAlias as keyof typeof columns]) as any
                ) as any,
            connection
        )
        .then(
            (curCandidateKey) => {
                return curCandidateKey;
            },
            (err) => {
                if (err instanceof RowNotFoundError) {
                    return err;
                } else {
                    throw err;
                }
            }
        );
    if (curCandidateKeyOrError instanceof RowNotFoundError) {
        return {
            success : false,
            rowNotFoundError : curCandidateKeyOrError,
        } as const;
    } else {
        return __updateAndFetchOneByCandidateKeyHelper<
            TableT,
            any,
            AssignmentMapT
        >(
            table,
            connection,
            curCandidateKeyOrError as any,
            assignmentMapDelegate
        );
    }
}

export async function updateAndFetchOne<
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
) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> {
    return updateAndFetchOneImpl<
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
                throw helperResult.rowNotFoundError;
            }
            const {
                curCandidateKey,
                assignmentMap,
                newCandidateKey,
            } = helperResult;
            return {
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
