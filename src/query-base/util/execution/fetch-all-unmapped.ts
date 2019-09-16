/**
 * @todo CLEAN THIS UP
 */
import {AfterSelectClause, NonCorrelated} from "../helper-type";
import {ColumnRefUtil, ColumnRef} from "../../../column-ref";
import {TypeRefUtil, TypeRef} from "../../../type-ref";
import {IConnection} from "../../../execution";
import {AstUtil, Sqlfier} from "../../../ast";
//import {SelectClauseUtil} from "../../../select-clause";
import {SEPARATOR} from "../../../constants";
import {IJoin, JoinArrayUtil} from "../../../join";
import {Merge} from "../../../type-util";

type SomeMap<
    RefT extends TypeRef,
    JoinsT extends readonly IJoin[],
    TableAliasT extends string
> = Merge<
    & {
        readonly [columnName in Extract<
            keyof RefT[TableAliasT],
            keyof JoinArrayUtil.ExtractWithTableAlias<JoinsT, TableAliasT>["columns"]
        >] : (
            //Get the real data type
            ReturnType<
                JoinArrayUtil.ExtractWithTableAlias<
                    JoinsT,
                    TableAliasT
                >["columns"][columnName]["mapper"]
            >
        )
    }
    & {
        readonly [columnName in Exclude<
            keyof RefT[TableAliasT],
            keyof JoinArrayUtil.ExtractWithTableAlias<JoinsT, TableAliasT>["columns"]
        >] : (
            //Get the real data type
            RefT[TableAliasT][columnName]
        )
    }
>;
/**
 * @todo Rename
 */
export type ApplyNullableJoins<
    RefT extends TypeRef,
    JoinsT extends readonly IJoin[]
> = Merge<
    //Required
    & {
        readonly [
            tableAlias in Extract<
                JoinArrayUtil.NonNullableTableAlias<JoinsT>,
                keyof RefT
            >
        ] : (
            SomeMap<RefT, JoinsT, tableAlias>
        )
    }
    //Optional
    & {
        readonly [
            tableAlias in Extract<
                JoinArrayUtil.NullableTableAlias<JoinsT>,
                keyof RefT
            >
        ]? : (
            SomeMap<RefT, JoinsT, tableAlias>
        )
    }
    //Extras (Like __aliased)
    & {
        readonly [
            tableAlias in Exclude<
                keyof RefT,
                JoinArrayUtil.TableAlias<JoinsT>
            >
        ] : (
            RefT[tableAlias]
        )
    }
>;
export type UnmappedFetchRow<
    QueryT extends AfterSelectClause & NonCorrelated
> =
    ApplyNullableJoins<
        TypeRefUtil.FromColumnRef<
            ColumnRefUtil.FromSelectClause<QueryT["selectClause"]>
        >,
        (
            QueryT["fromClause"]["currentJoins"] extends readonly IJoin[] ?
            QueryT["fromClause"]["currentJoins"] :
            []
        )
    >
;
export type FetchAllUnmappedResult<
    QueryT extends AfterSelectClause & NonCorrelated
> = (
    UnmappedFetchRow<QueryT>[]
);
export async function fetchAllUnmapped<
    QueryT extends AfterSelectClause & NonCorrelated
>(
    query : QueryT,
    sqlfier : Sqlfier,
    connection : IConnection
) : Promise<FetchAllUnmappedResult<QueryT>> {
    const sql = AstUtil.toSql(query, sqlfier);
    const rawResult = await connection.select(sql);

    //const hasDuplicateColumnName = SelectClauseUtil.duplicateColumnAlias(query.selectClause).length > 0;
    const hasNullableJoins = (query.fromClause.currentJoins == undefined) ?
        false :
        query.fromClause.currentJoins.some(j => j.nullable);
    const ref : ColumnRef = ColumnRefUtil.fromSelectClause(query.selectClause);

    type Row = Record<
        //tableAlias
        string,
        (
            | undefined
            | Record<
                //columnAlias
                string,
                //value
                unknown
            >
        )
    >;
    const rows : Row[] = [];
    for (const rawRow of rawResult.rows) {
        const row : Row = {};
        for (const k of Object.keys(rawRow)) {
            const parts = k.split(SEPARATOR);
            const tableAlias = parts[0];
            const columnAlias = parts[1];

            const value = ref[tableAlias][columnAlias].mapper(
                `${tableAlias}.${columnAlias}`,
                rawRow[k]
            );
            let table = row[tableAlias];
            if (table == undefined) {
                table = {};
                row[tableAlias] = table;
            }
            table[columnAlias] = value;
        }
        if (hasNullableJoins) {
            for (const tableAlias of Object.keys(row)) {
                if (
                    query.fromClause.currentJoins != undefined &&
                    query.fromClause.currentJoins.findIndex(
                        j => j.tableAlias == tableAlias
                    ) < 0
                ) {
                    //Probably `__aliased`
                    continue;
                }
                const map = row[tableAlias];
                if (map == undefined) {
                    continue;
                }
                const allNull = Object.keys(map)
                    .every(columnAlias => map[columnAlias] === null);
                if (allNull) {
                    row[tableAlias] = undefined;
                }
            }
        }
        rows.push(row);
    }
    return rows as FetchAllUnmappedResult<QueryT>;
}
