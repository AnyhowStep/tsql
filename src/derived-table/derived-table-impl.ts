import {AliasedTableData, IAliasedTable} from "../aliased-table";
import {Ast} from "../ast";
import * as DerivedTableUtil from "./util";

/**
 * A query can be aliased,
 *
 * ```sql
 * SELECT
 *  *
 * FROM
 *  myTable
 * CROSS JOIN
 *  (
 *      SELECT
 *          RAND() AS randomNumber,
 *          UTC_TIMESTAMP() AS timeNow
 *  ) AS tmpTable --This is a `DerivedTable`
 * ```
 *
 */
export class DerivedTable<DataT extends AliasedTableData> implements IAliasedTable<DataT> {
    readonly isLateral : DataT["isLateral"];
    readonly alias : DataT["alias"];
    readonly columns : DataT["columns"];
    readonly usedRef : DataT["usedRef"];

    readonly unaliasedAst : Ast;

    constructor (
        data : DataT,
        unaliasedAst : Ast
    ) {
        this.isLateral = data.isLateral;
        this.alias = data.alias;
        this.columns = data.columns;
        this.usedRef = data.usedRef;

        this.unaliasedAst = unaliasedAst;
    }

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
    lateral () : DerivedTableUtil.Lateral<this> {
        return DerivedTableUtil.lateral(this);
    }
}
