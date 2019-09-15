import {IFromClause} from "../../from-clause";
import {IJoin} from "../../../join";

/**
 * A correlated subquery is a subquery that uses columns from outer queries.
 *
 * This is really intended to be used as a convenience function,
 * ```ts
 *  tsql
 *      .from(myTable)
 *      //@todo Implement this usage where necessary
 *      .where((_columns, query) => tsql.nullSafeEq(
 *          query
 *              .correlate()
 *              .from(otherTable)
 *              .whereEqOuterQueryPrimaryKey(
 *                  tables => tables.otherTable,
 *                  outerTables => outerTables.myTable
 *              )
 *              .select(columns => [columns.otherValue])
 *              .limit(1),
 *          45
 *      ));
 * ```
 *
 * The equivalent, without the convenience function,
 * ```ts
 *  const myCorrelatedSubquery = tsql
 *      .requireOuterQueryJoins(myTable)
 *      .from(otherTable)
 *      .whereEqOuterQueryPrimaryKey(
 *          tables => tables.otherTable,
 *          outerTables => outerTables.myTable
 *      )
 *      .select(columns => [columns.otherValue])
 *      .limit(1);
 *
 *  tsql
 *      .from(myTable)
 *      .where(() => tsql.nullSafeEq(
 *          myCorrelatedSubquery,
 *          45
 *      ));
 * ```
 *
 * Both generate the following SQL (For SQLite),
 * ```sql
 *  FROM
 *      "myTable"
 *  where
 *      (
 *          SELECT
 *              "otherTable"."otherValue"
 *          FROM
 *              "otherTable"
 *          WHERE
 *              "otherTable"."myTablePk" IS "myTable"."myTablePk"
 *          LIMIT
 *              1
 *      ) IS 45
 * ```
 *
 * For more composable queries, you **SHOULD NOT** use the convenience function.
 *
 * The convenience function is only really useful for prototyping/single-use correlated subqueries.
 * When you start building more complex applications, you should split expressions out
 * into smaller, more modular chunks.
 */
export type Correlate<FromClauseT extends IFromClause> =
    IFromClause<{
        /**
         * @todo It seems like a huge waste to make `outerQueryJoins` an entire `IJoin` object.
         * We probably only ever use `tableAlias`, `columns`, `primaryKey` and `candidateKeys`.
         *
         * It **might** be possible to trim away `nullable`, `originalColumns`, `deleteEnabled`,
         * and `mutableColumns`
         */
        outerQueryJoins : (
            FromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
            readonly (
                | FromClauseT["outerQueryJoins"][number]
                | Extract<FromClauseT["currentJoins"], readonly IJoin[]>[number]
            )[] :
            FromClauseT["currentJoins"] extends readonly IJoin[] ?
            readonly (
                Extract<FromClauseT["currentJoins"], readonly IJoin[]>[number]
            )[] :
            undefined
        ),
        currentJoins : undefined,
    }>
;

export function correlate<
    FromClauseT extends IFromClause
> (
    fromClause : FromClauseT
) : (
    Correlate<FromClauseT>
) {
    return {
        outerQueryJoins : (
            fromClause.outerQueryJoins == undefined && fromClause.currentJoins == undefined ?
            undefined :
            [
                ...(
                    fromClause.outerQueryJoins == undefined ?
                    [] :
                    fromClause.outerQueryJoins
                ),
                ...(
                    fromClause.currentJoins == undefined ?
                    [] :
                    fromClause.currentJoins
                ),
            ]
        ) as Correlate<FromClauseT>["outerQueryJoins"],
        currentJoins : undefined,
    };
}
