import * as tm from "type-mapping";
import {ITable} from "../../../table";
import {SelectConnection} from "../../../execution";
import {tryEvaluateColumns, EvaluateColumnsInputRow, TryEvaluateColumnsResult} from "./evaluate-columns";
import {tryEvaluatePrimaryKey} from "./evaluate-primary-key";

export type EvaluateCandidateKeyInputRowImpl<
    TableT extends ITable,
    CandidateKeyT extends readonly string[]
> =
    CandidateKeyT extends readonly string[] ?
    EvaluateColumnsInputRow<
        TableT,
        CandidateKeyT[number]
    > :
    never
;

export type TryEvaluateCandidateKeyResultImpl<
    TableT extends ITable,
    CandidateKeyT extends readonly string[]
> =
    CandidateKeyT extends readonly[] ?
    TryEvaluateColumnsResult<
        TableT,
        CandidateKeyT[number]
    > :
    never
;

/**
 * This allows custom data types
 */
export type EvaluateCandidateKeyInputRow<TableT extends ITable> =
    EvaluateCandidateKeyInputRowImpl<
        TableT,
        TableT["candidateKeys"][number]
    >
;

export type TryEvaluateCandidateKeyResult<
    TableT extends ITable
> =
    TryEvaluateCandidateKeyResultImpl<
        TableT,
        TableT["candidateKeys"][number]
    >
;

export async function tryEvaluateCandidateKey<
    TableT extends ITable
> (
    table : TableT,
    connection : SelectConnection,
    row : EvaluateCandidateKeyInputRow<TableT>
) : Promise<TryEvaluateCandidateKeyResult<TableT>> {
    const mappingErrors : tm.MappingError[] = [];
    for (const candidateKey of table.candidateKeys) {
        const evaluateResult = await tryEvaluateColumns(
            table,
            connection,
            `${table.alias}.candidateKey`,
            candidateKey,
            row
        );
        if (evaluateResult.success) {
            return evaluateResult as any;
        }
        if (tm.ErrorUtil.isMappingError(evaluateResult.error)) {
            mappingErrors.push(evaluateResult.error);
        }
    }
    return {
        success : false,
        error : tm.ErrorUtil.makeNormalizedUnionError(
            `${table.alias}.candidateKey`,
            row,
            mappingErrors
        ),
    } as any;
}

export async function tryEvaluateCandidateKeyPreferPrimaryKey<
    TableT extends ITable
> (
    table : TableT,
    connection : SelectConnection,
    row : EvaluateCandidateKeyInputRow<TableT>
) : Promise<TryEvaluateCandidateKeyResult<TableT>> {
    if (table.primaryKey == undefined) {
        return tryEvaluateCandidateKey(table, connection, row);
    }

    const evaluatePrimaryKeyResult = await tryEvaluatePrimaryKey(
        table as any,
        connection,
        row
    );
    if (evaluatePrimaryKeyResult.success) {
        return evaluatePrimaryKeyResult as any;
    }
    return tryEvaluateCandidateKey(table, connection, row);
}
