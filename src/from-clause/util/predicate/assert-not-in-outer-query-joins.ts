import {IFromClause} from "../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {IJoin, JoinArrayUtil} from "../../../join";
import {CompileError} from "../../../compile-error";

/**
 * Problem: Duplicate table names in outer query `FROM/JOIN` clause and current `FROM/JOIN` clause not allowed
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      tableA --outerQueryJoins
 *  WHERE (
 *      EXISTS ( --This sub query says it requires outerQueryJoins `tableA`
 *          SELECT
 *              *
 *          FROM
 *              tableA --Error
 *          WHERE
 *              tableA.id > 0
 *      )
 *  )
 * ```
 *
 * Solution: Alias the duplicate table
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      tableA --outerQueryJoins
 *  WHERE (
 *      EXISTS ( --This sub query says it requires outerQueryJoins `tableA`
 *          SELECT
 *              *
 *          FROM
 *              tableA AS otherTableA --Error
 *          WHERE
 *              otherTableA.id > 0
 *      )
 *  )
 * ```
 */
export type AssertNotInOuterQueryJoins<
    FromClauseT extends IFromClause,
    AliasedTableT extends Pick<IAliasedTable, "tableAlias">
> = (
    FromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
    (
        Extract<
            AliasedTableT["tableAlias"],
            JoinArrayUtil.TableAlias<FromClauseT["outerQueryJoins"]>
        > extends never ?
        unknown :
        CompileError<[
            "Table alias",
            Extract<
                AliasedTableT["tableAlias"],
                JoinArrayUtil.TableAlias<FromClauseT["outerQueryJoins"]>
            >,
            "already used in outer query JOINs",
            JoinArrayUtil.TableAlias<FromClauseT["outerQueryJoins"]>
        ]>
    ) :
    unknown
);
export function assertNotInOuterQueryJoins (
    fromClause : IFromClause,
    aliasedTable : Pick<IAliasedTable, "tableAlias">
) {
    if (fromClause.outerQueryJoins != undefined) {
        if (fromClause.outerQueryJoins.some(j => j.tableAlias == aliasedTable.tableAlias)) {
            throw new Error(`Table alias ${aliasedTable.tableAlias} already used in outer query JOINs`);
        }
    }
}
