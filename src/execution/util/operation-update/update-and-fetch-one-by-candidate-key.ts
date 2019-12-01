import {ITable, TableUtil} from "../../../table";
import {IsolableUpdateConnection, SelectConnection} from "../../connection";
import {AssignmentMapDelegate, CustomAssignmentMap} from "../../../update";
import {CandidateKey_NonUnion, CandidateKeyUtil, CandidateKey_Input} from "../../../candidate-key";
import {StrictUnion, AssertNonUnion, Identity} from "../../../type-util";
import {UpdateOneResult, updateOne} from "./update-one";
import {BuiltInExprUtil} from "../../../built-in-expr";
import {CustomExpr_MapCorrelated, CustomExprUtil} from "../../../custom-expr";
import * as ExprLib from "../../../expr-library";
import {RowNotFoundError} from "../../../error";

export type UpdatedAndFetchedRow<
    TableT extends ITable,
    AssignmentMapT extends CustomAssignmentMap<TableT>
> =
    Identity<{
        readonly [columnAlias in TableUtil.ColumnAlias<TableT>] : (
            columnAlias extends keyof AssignmentMapT ?
            (
                undefined extends AssignmentMapT[columnAlias] ?
                TableUtil.ColumnType<TableT, columnAlias> :
                CustomExprUtil.TypeOf<
                    AssignmentMapT[columnAlias]
                >
            ) :
            TableUtil.ColumnType<TableT, columnAlias>
        )
    }>
;

export type UpdateAndFetchOneResult<
    TableT extends ITable,
    AssignmentMapT extends CustomAssignmentMap<TableT>
> =
    Identity<
        & UpdateOneResult
        & {
            row : UpdatedAndFetchedRow<TableT, AssignmentMapT>,
        }
    >
;

export type UpdateAndFetchOneByCandidateKeyAssignmentMapImpl<
    TableT extends ITable
> =
    Identity<
        & {
            readonly [columnAlias in TableT["mutableColumns"][number]]? : (
                CustomExpr_MapCorrelated<
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

export type UpdateAndFetchOneByCandidateKeyAssignmentMap<
    TableT extends ITable
> =
    Extract<
        /**
         * @todo Investigate assignability
         */
        UpdateAndFetchOneByCandidateKeyAssignmentMapImpl<TableT>,
        CustomAssignmentMap<TableT>
    >
;

/**
 * Not meant to be called externally
 *
 * @todo Better name
 */
export async function __updateAndFetchOneByCandidateKeyHelper<
    TableT extends ITable,
    CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<TableT>>,
    AssignmentMapT extends UpdateAndFetchOneByCandidateKeyAssignmentMap<TableT>
> (
    table : TableT,
    connection : SelectConnection,
    candidateKey : CandidateKeyT & AssertNonUnion<CandidateKeyT>,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<
    | {
        success : false,
        rowNotFoundError : RowNotFoundError,
    }
    | {
        success : true,
        curCandidateKey : StrictUnion<CandidateKey_Input<TableT>>,
        assignmentMap : UpdateAndFetchOneByCandidateKeyAssignmentMap<TableT>,
        newCandidateKey : StrictUnion<CandidateKey_Input<TableT>>,
    }
> {
    candidateKey = CandidateKeyUtil.mapperPreferPrimaryKey(table)(
        `${table.alias}[candidateKey]`,
        candidateKey
    ) as any;
    const assignmentMap : (
        UpdateAndFetchOneByCandidateKeyAssignmentMap<TableT>
    ) = assignmentMapDelegate(table.columns);

    const newCandidateKey = {} as any;
    for(const candidateColumnAlias of Object.keys(candidateKey)) {
        const newCustomExpr = (
            (
                Object.prototype.hasOwnProperty.call(assignmentMap, candidateColumnAlias) &&
                Object.prototype.propertyIsEnumerable.call(assignmentMap, candidateColumnAlias)
            ) ?
            assignmentMap[candidateColumnAlias as keyof typeof assignmentMap] :
            undefined
        );
        if (newCustomExpr === undefined) {
            /**
             * This `candidateKey` column's value will not be updated.
             */
            newCandidateKey[candidateColumnAlias] = candidateKey[candidateColumnAlias];
        } else {
            if (table.mutableColumns.indexOf(candidateColumnAlias) < 0) {
                throw new Error(`${table.alias}.${candidateColumnAlias} is not a mutable candidate key column`);
            }
            /**
             * This `candidateKey` column's value will be updated.
             * We need to know what its updated value will be.
             */
            if (BuiltInExprUtil.isAnyNonValueExpr(newCustomExpr)) {
                const evaluatedNewValue = await TableUtil.fetchValue(
                    table,
                    connection,
                    () => ExprLib.eqCandidateKey(
                        table,
                        candidateKey as any
                    ) as any,
                    () => newCustomExpr as any
                ).catch((err) => {
                    if (err instanceof RowNotFoundError) {
                        return err;
                    } else {
                        throw err;
                    }
                }) as any;
                if (evaluatedNewValue instanceof RowNotFoundError) {
                    return {
                        success : false,
                        rowNotFoundError : evaluatedNewValue,
                    };
                }
                newCandidateKey[candidateColumnAlias] = table.columns[candidateColumnAlias].mapper(
                    `${table.alias}.${candidateColumnAlias}[newValue]`,
                    evaluatedNewValue
                );
            } else {
                newCandidateKey[candidateColumnAlias] = table.columns[candidateColumnAlias].mapper(
                    `${table.alias}.${candidateColumnAlias}[newValue]`,
                    newCustomExpr
                );
            }
            /**
             * If it was an expression, it is now a value.
             */
            assignmentMap[candidateColumnAlias as keyof typeof assignmentMap] = (
                newCandidateKey[candidateColumnAlias] as any
            );
        }
    }

    return {
        success : true,
        curCandidateKey : candidateKey,
        assignmentMap,
        newCandidateKey,
    };
}

export async function updateAndFetchOneByCandidateKey<
    TableT extends ITable,
    CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<TableT>>,
    AssignmentMapT extends UpdateAndFetchOneByCandidateKeyAssignmentMap<TableT>
> (
    table : TableT,
    connection : IsolableUpdateConnection,
    candidateKey : CandidateKeyT & AssertNonUnion<CandidateKeyT>,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> {
    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> => {
        const helperResult = await __updateAndFetchOneByCandidateKeyHelper<
            TableT,
            CandidateKeyT,
            AssignmentMapT
        >(
            table,
            connection,
            candidateKey,
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

        const updateOneResult = await updateOne(
            table,
            connection,
            () => ExprLib.eqCandidateKey(
                table,
                curCandidateKey
            ) as any,
            () => assignmentMap
        );
        const row = await TableUtil.__fetchOneHelper(
            table,
            connection,
            () => ExprLib.eqCandidateKey(
                table,
                newCandidateKey
            ) as any
        );
        return {
            ...updateOneResult,
            row,
        };
    });
}
