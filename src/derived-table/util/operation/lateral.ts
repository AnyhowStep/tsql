import {AliasedTableData} from "../../../aliased-table";
import {DerivedTable} from "../../derived-table-impl";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type LateralImpl<
    TableAliasT extends AliasedTableData["alias"],
    ColumnsT extends AliasedTableData["columns"],
    UsedRefT extends AliasedTableData["usedRef"]
> = (
    DerivedTable<{
        isLateral : true,
        alias : TableAliasT,
        columns : ColumnsT,
        usedRef : UsedRefT,
    }>
);
export type Lateral<
    DerivedTableT extends DerivedTable<AliasedTableData>
> = (
    LateralImpl<
        DerivedTableT["alias"],
        DerivedTableT["columns"],
        DerivedTableT["usedRef"]
    >
);
/**
 * Makes a derived table a `LATERAL` derived table.
 *
 * -----
 *
 * Normally, a derived table cannot use a column from a preceding table in the same `FROM` clause,
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      myTable
 *  CROSS JOIN
 *      (
 *          SELECT
 *              --Error, cannot reference `myTable.x`; it is a column in the same `FROM` clause
 *              myTable.x + otherTable.y AS z
 *          FROM
 *              otherTable
 *      ) AS tmpTable
 * ```
 *
 * However, a `LATERAL` derived table can,
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      myTable
 *  CROSS JOIN
 *      LATERAL (
 *          SELECT
 *              --OK! `LATERAL` derived tables can access columns in the same `FROM` clause
 *              myTable.x + otherTable.y AS z
 *          FROM
 *              otherTable
 *      ) AS tmpTable
 * ```
 *
 * Note:
 * + Not supported in MySQL 5.7
 * + Supported as of MySQL 8.0.14
 */
export function lateral<
    DerivedTableT extends DerivedTable<AliasedTableData>
> (
    derivedTable : DerivedTableT
) : (
    Lateral<DerivedTableT>
) {
    const result : Lateral<DerivedTableT> = new DerivedTable(
        {
            isLateral : true,
            alias : derivedTable.alias,
            columns : derivedTable.columns,
            usedRef : derivedTable.usedRef,
        },
        derivedTable.unaliasedAst
    );
    return result;
}
