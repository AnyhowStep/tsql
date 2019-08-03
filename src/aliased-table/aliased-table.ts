import {ColumnMap} from "../column-map";
import {Ast} from "../ast";
import {IUsedRef} from "../used-ref";

export interface AliasedTableData {
    readonly lateral : boolean;
    readonly tableAlias : string;
    readonly columns : ColumnMap;
    readonly usedRef : IUsedRef;
}

export interface IAliasedTable<DataT extends AliasedTableData=AliasedTableData> {
    /**
     * + Not in MySQL 5.7
     * + New in MySQL 8.0
     *
     * In MySQL 5.7, a derived table could not reference tables
     * in the same `FROM/JOIN` clause.
     *
     * ```sql
     *  SELECT
     *      *
     *  FROM
     *      sameFromClauseTable
     *  JOIN
     *      --This derived table references `sameFromClauseTable.sameFromClauseColumn`
     *      --This is not allowed
     *      (
     *          SELECT
     *              *
     *          FROM
     *              innerTable
     *          WHERE
     *              --This expression references `sameFromClauseTable.sameFromClauseColumn`
     *              sameFromClauseTable.sameFromClauseColumn > innerTable.innerColumn
     *      ) AS derivedTable
     * ```
     *
     * -----
     *
     * In MySQL 8.0, the `LATERAL` keyword was introduced that allows
     * derived tables to reference tables in the same `FROM/JOIN` clause.
     *
     * ```sql
     *  SELECT
     *      *
     *  FROM
     *      sameFromClauseTable
     *  JOIN
     *      --This derived table references `sameFromClauseTable.sameFromClauseColumn`
     *      --This is allowed because of `LATERAL`
     *      LATERAL (
     *          SELECT
     *              *
     *          FROM
     *              innerTable
     *          WHERE
     *              --This expression references `sameFromClauseTable.sameFromClauseColumn`
     *              sameFromClauseTable.sameFromClauseColumn > innerTable.innerColumn
     *      ) AS derivedTable
     * ```
     */
    readonly lateral : DataT["lateral"];

    /**
     * The alias of the table.
     *
     * ```sql
     * SELECT
     *  *
     * FROM
     *  --The `tableAlias` is `myAlias`
     *  (
     *      SELECT
     *          *
     *      FROM
     *          myTable
     *  ) AS myAlias
     * ```
     */
    readonly tableAlias : DataT["tableAlias"];

    /**
     * The columns of this table
     */
    readonly columns : DataT["columns"];

    /**
     * The columns used by this expression.
     * ```sql
     * SELECT
     *  *
     * FROM
     *  myTable
     * CROSS JOIN LATERAL
     *  --The `usedRef` of this table is `myTable.myColumn`,
     *  --an outer query column
     *  (
     *     SELECT
     *          (myTable.myColumn + otherTable.otherColumn)
     *     FROM
     *          otherTable
     *     WHERE
     *          myTable.id = otherTable.id
     *  ) AS tmpTable
     * ```
     *
     * For now, derived tables cannot have columns in `usedRef`
     *
     * @todo Implement `LATERAL` joins?
     */
    readonly usedRef : DataT["usedRef"];

    /**
     * Given the following,
     *
     * ```sql
     *  (
     *      SELECT
     *          RAND() AS randomNumber,
     *          UTC_TIMESTAMP() AS timeNow
     *  ) AS tmpTable --This is an `AliasedTable`
     * ```
     *
     * The unaliased AST is,
     * ```sql
     *  (
     *      SELECT
     *          RAND() AS randomNumber,
     *          UTC_TIMESTAMP() AS timeNow
     *  )
     * ```
     *
     */
    readonly unaliasedAst : Ast;
}

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
 *  ) AS tmpTable --This is an `AliasedTable`
 * ```
 *
 * -----
 *
 * A table can be aliased,
 *
 * ```sql
 * SELECT
 *  *
 * FROM
 *  myTable
 * CROSS JOIN
 *  (
 *      myTable
 *  ) AS otherTable --This is an `AliasedTable`
 * ```
 */
export class AliasedTable<DataT extends AliasedTableData> implements IAliasedTable<DataT> {
    readonly lateral : DataT["lateral"];
    readonly tableAlias : DataT["tableAlias"];
    readonly columns : DataT["columns"];
    readonly usedRef : DataT["usedRef"];

    readonly unaliasedAst : Ast;

    constructor (
        data : DataT,
        unaliasedAst : Ast
    ) {
        this.lateral = data.lateral;
        this.tableAlias = data.tableAlias;
        this.columns = data.columns;
        this.usedRef = data.usedRef;

        this.unaliasedAst = unaliasedAst;
    }
}
