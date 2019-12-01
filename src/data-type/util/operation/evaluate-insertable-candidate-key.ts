import * as tm from "type-mapping";
import {ITable, TableUtil} from "../../../table";
import {SelectConnection} from "../../../execution";
import {tryEvaluateColumns, EvaluateColumnsInputRow, TryEvaluateColumnsResult} from "./evaluate-columns";
import {tryEvaluatePrimaryKey} from "./evaluate-primary-key";
import {KeyUtil} from "../../../key";

export type EvaluateInsertableCandidateKeyInputRowImpl<
    TableT extends ITable,
    CandidateKeyT extends readonly string[]
> =
    CandidateKeyT extends readonly string[] ?
    (
        KeyUtil.IsSubKey<CandidateKeyT, TableUtil.InsertableColumnAlias<TableT>[]> extends true ?
        EvaluateColumnsInputRow<
            TableT,
            CandidateKeyT[number]
        > :
        never
    ) :
    never
;

export type TryEvaluateInsertableCandidateKeyResultImpl<
    TableT extends ITable,
    CandidateKeyT extends readonly string[]
> =
    CandidateKeyT extends readonly string[] ?
    (
        KeyUtil.IsSubKey<CandidateKeyT, TableUtil.InsertableColumnAlias<TableT>[]> extends true ?
        TryEvaluateColumnsResult<
            TableT,
            CandidateKeyT[number]
        > :
        never
    ) :
    never
;

/**
 * This allows custom data types
 */
export type EvaluateInsertableCandidateKeyInputRow<TableT extends ITable> =
    EvaluateInsertableCandidateKeyInputRowImpl<
        TableT,
        TableT["candidateKeys"][number]
    >
;

export type TryEvaluateInsertableCandidateKeyResult<
    TableT extends ITable
> =
    TryEvaluateInsertableCandidateKeyResultImpl<
        TableT,
        TableT["candidateKeys"][number]
    >
;

export async function tryEvaluateInsertableCandidateKey<
    TableT extends ITable
> (
    table : TableT,
    connection : SelectConnection,
    row : EvaluateInsertableCandidateKeyInputRow<TableT>
) : Promise<TryEvaluateInsertableCandidateKeyResult<TableT>> {
    const insertableColumnAliases = TableUtil.insertableColumnAlias(table);

    const mappingErrors : tm.MappingError[] = [];
    for (const candidateKey of table.candidateKeys) {
        if (!KeyUtil.isSubKey(candidateKey, insertableColumnAliases)) {
            continue;
        }
        const evaluateResult = await tryEvaluateColumns(
            table,
            connection,
            `${table.alias}.insertableCandidateKey`,
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
            `${table.alias}.insertableCandidateKey`,
            row,
            mappingErrors
        ),
    } as any;
}

export async function tryEvaluateInsertableCandidateKeyPreferPrimaryKey<
    TableT extends ITable
> (
    table : TableT,
    connection : SelectConnection,
    row : EvaluateInsertableCandidateKeyInputRow<TableT>
) : Promise<TryEvaluateInsertableCandidateKeyResult<TableT>> {
    if (table.primaryKey == undefined) {
        return tryEvaluateInsertableCandidateKey(table, connection, row);
    }

    if (table.primaryKey.every(columnAlias => TableUtil.isInsertableColumnAlias(table, columnAlias))) {
        const evaluatePrimaryKeyResult = await tryEvaluatePrimaryKey(
            table as any,
            connection,
            row
        );
        if (evaluatePrimaryKeyResult.success) {
            return evaluatePrimaryKeyResult as any;
        }
    }
    return tryEvaluateInsertableCandidateKey(table, connection, row);
}
