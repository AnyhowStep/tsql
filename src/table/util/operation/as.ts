import {ITable} from "../../table";
import {ColumnMapUtil} from "../../../column-map";
import {Table} from "../../table-impl";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type AsImpl<
    NewTableAliasT extends string,
    IsLateralT extends ITable["isLateral"],
    ColumnsT extends ITable["columns"],
    UsedRefT extends ITable["usedRef"],

    AutoIncrementT extends ITable["autoIncrement"],
    IdT extends ITable["id"],
    PrimaryKeyT extends ITable["primaryKey"],
    CandidateKeysT extends ITable["candidateKeys"],

    InsertEnabledT extends ITable["insertEnabled"],
    DeleteEnabledT extends ITable["deleteEnabled"],

    GeneratedColumnsT extends ITable["generatedColumns"],
    NullableColumnsT extends ITable["nullableColumns"],
    ExplicitDefaultValueColumnsT extends ITable["explicitDefaultValueColumns"],
    MutableColumnsT extends ITable["mutableColumns"],

    /**
     * @todo Remove this
     */
    ParentsT extends ITable["parents"]
> =
    Table<{
        isLateral : IsLateralT,
        alias : NewTableAliasT,
        columns : ColumnMapUtil.WithTableAlias<
            ColumnsT,
            NewTableAliasT
        >,
        usedRef : UsedRefT,

        autoIncrement : AutoIncrementT,
        id : IdT,
        primaryKey : PrimaryKeyT,
        candidateKeys : CandidateKeysT,

        insertEnabled : InsertEnabledT,
        deleteEnabled : DeleteEnabledT,

        generatedColumns : GeneratedColumnsT,
        nullableColumns : NullableColumnsT,
        explicitDefaultValueColumns : ExplicitDefaultValueColumnsT,
        mutableColumns : MutableColumnsT,

        parents : ParentsT,
    }>
;
export type As<TableT extends ITable, NewTableAliasT extends string> =
    AsImpl<
        NewTableAliasT,
        TableT["isLateral"],
        TableT["columns"],
        TableT["usedRef"],

        TableT["autoIncrement"],
        TableT["id"],
        TableT["primaryKey"],
        TableT["candidateKeys"],

        TableT["insertEnabled"],
        TableT["deleteEnabled"],

        TableT["generatedColumns"],
        TableT["nullableColumns"],
        TableT["explicitDefaultValueColumns"],
        TableT["mutableColumns"],

        TableT["parents"]
    >
;
/**
 * Aliases a table reference in a query.
 *
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      myTable AS aliasedTable
 * ```
 */
export function as<TableT extends ITable, NewTableAliasT extends string> (
    table : TableT,
    newTableAlias : NewTableAliasT
) : (
    As<TableT, NewTableAliasT>
) {
    const {
        isLateral,
        //alias,
        columns,
        usedRef,

        autoIncrement,
        id,
        primaryKey,
        candidateKeys,

        insertEnabled,
        deleteEnabled,

        generatedColumns,
        nullableColumns,
        explicitDefaultValueColumns,
        mutableColumns,

        parents,
    } = table;

    const result : As<TableT, NewTableAliasT> = new Table(
        {
            isLateral,
            alias : newTableAlias,
            columns : ColumnMapUtil.withTableAlias<TableT["columns"], NewTableAliasT>(
                columns,
                newTableAlias
            ),
            usedRef,

            autoIncrement,
            id,
            primaryKey,
            candidateKeys,

            insertEnabled,
            deleteEnabled,

            generatedColumns,
            nullableColumns,
            explicitDefaultValueColumns,
            mutableColumns,

            parents,
        },
        table.unaliasedAst
    );
    return result;
}
