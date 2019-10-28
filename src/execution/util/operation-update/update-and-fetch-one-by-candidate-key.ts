import {ITable, TableUtil} from "../../../table";
import {IsolableUpdateConnection} from "../../connection";
import {AssignmentMapDelegate, AssignmentMap, UpdateUtil} from "../../../update";
import {CandidateKey_NonUnion, CandidateKeyUtil} from "../../../candidate-key";
import {StrictUnion, AssertNonUnion, Identity} from "../../../type-util";
import {UpdateOneResult, updateOne} from "./update-one";
import {AnyRawExpr, RawExprUtil, RawExprUsingColumnMap} from "../../../raw-expr";
import * as ExprLib from "../../../expr-library";

export type UpdatedAndFetchedRow<
    TableT extends ITable,
    AssignmentMapT extends AssignmentMap<TableT>
> =
    Identity<{
        readonly [columnAlias in TableUtil.ColumnAlias<TableT>] : (
            columnAlias extends keyof AssignmentMapT ?
            (
                AssignmentMapT[columnAlias] extends AnyRawExpr ?
                RawExprUtil.TypeOf<
                    /**
                     * @todo Investigate assignability issue
                     */
                    Exclude<AssignmentMapT[columnAlias], undefined>
                > :
                TableUtil.ColumnType<TableT, columnAlias>
            ) :
            TableUtil.ColumnType<TableT, columnAlias>
        )
    }>
;

export type UpdateAndFetchOneResult<
    TableT extends ITable,
    AssignmentMapT extends AssignmentMap<TableT>
> =
    Identity<
        & UpdateOneResult
        & {
            row : UpdatedAndFetchedRow<TableT, AssignmentMapT>,
        }
    >
;

export type UpdateAndFetchOneByCandidateKeyAssignmentMapImpl<
    TableT extends ITable,
    /**
     * Assumes this is not a union
     */
    CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<TableT>>
> =
    Identity<
        & {
            readonly [columnAlias in Exclude<TableT["mutableColumns"][number], Extract<keyof CandidateKeyT, string>>]? : (
                RawExprUsingColumnMap<
                    TableT["columns"],
                    ReturnType<
                        TableT["columns"][columnAlias]["mapper"]
                    >
                >
            )
        }
        & {
            readonly [columnAlias in Extract<TableT["mutableColumns"][number], Extract<keyof CandidateKeyT, string>>]? : (
                ReturnType<
                    TableT["columns"][columnAlias]["mapper"]
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
    TableT extends ITable,
    /**
     * Assumes this is not a union
     */
    CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<TableT>>
> =
    Extract<
        /**
         * @todo Investigate assignability
         */
        UpdateAndFetchOneByCandidateKeyAssignmentMapImpl<TableT, CandidateKeyT>,
        AssignmentMap<TableT>
    >
;
export async function updateAndFetchOneByCandidateKey<
    TableT extends ITable,
    CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<TableT>>,
    AssignmentMapT extends UpdateAndFetchOneByCandidateKeyAssignmentMap<TableT, CandidateKeyT>
> (
    connection : IsolableUpdateConnection,
    table : TableT,
    candidateKey : CandidateKeyT & AssertNonUnion<CandidateKeyT>,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> {
    candidateKey = CandidateKeyUtil.mapper(table)(
        `${table.alias}[candidateKey]`,
        candidateKey
    ) as any;
    const assignmentMap = UpdateUtil.set(table, assignmentMapDelegate);

    const newCandidateKey = {} as any;
    for(const candidateColumnAlias of Object.keys(candidateKey)) {
        const newValue = assignmentMap[candidateColumnAlias as keyof typeof assignmentMap];
        if (newValue === undefined) {
            /**
             * This `candidateKey` column's value will not be updated.
             */
            newCandidateKey[candidateColumnAlias] = candidateKey[candidateColumnAlias];
        } else {
            /**
             * This `candidateKey` column's value will be updated.
             * We need to know what its updated value will be.
             */
            newCandidateKey[candidateColumnAlias] = table.columns[candidateColumnAlias].mapper(
                `${table.alias}.${candidateColumnAlias}[newValue]`,
                newValue
            );
        }
    }

    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> => {
        const updateOneResult = await updateOne(
            connection,
            table,
            () => ExprLib.eqCandidateKey(
                table,
                candidateKey
            ) as any,
            () => assignmentMap
        );
        const row = await TableUtil.__fetchOneHelper(
            connection,
            table,
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
