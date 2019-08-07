import {ColumnMap} from "../column-map";
import {Ast} from "../ast";
import {IUsedRef} from "../used-ref";

export interface AliasedTableData {
    readonly isLateral : boolean;
    /**
     * This has to be called `alias` and not `tableAlias`.
     *
     * `IExprSelectItem` has `tableAlias` and `alias`.
     * When the SQL is generated, it should look like, `tableAlias--alias`.
     *
     * When an `IQueryBase` is aliased, it can be,
     * + `DerivedTable`
     *   ```sql
     *      SELECT
     *          *
     *      FROM
     *          (
     *              SELECT
     *                  *
     *              FROM
     *                  myTable
     *          ) AS q
     *   ```
     * + `DerivedTable` & `IExprSelectItem`
     *    The below SQL snippet can be used as both a derived table
     *    and a correlated subquery!
     *    ```sql
     *      (SELECT myColumn FROM myTable LIMIT 1) AS q
     *    ```
     *
     * When we have `DerivedTable` & `IExprSelectItem`,
     * + `tableAlias` will be set to `typeof ALIASED`
     * + `alias` will be set to `q` (given the above example)
     *
     * So, the `alias` of `DerivedTable` must also be `q`.
     */
    readonly alias : string;
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
    readonly isLateral : DataT["isLateral"];

    /**
     * The alias of the table.
     *
     * ```sql
     * SELECT
     *  *
     * FROM
     *  --The `alias` is `myAlias`
     *  (
     *      SELECT
     *          *
     *      FROM
     *          myTable
     *  ) AS myAlias
     * ```
     */
    readonly alias : DataT["alias"];

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
 *
 * For aliasing a query (derived tables), @see {@link DerivedTable}
 */
export class AliasedTable<DataT extends AliasedTableData> implements IAliasedTable<DataT> {
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
}
