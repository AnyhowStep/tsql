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
    AliasedTableT extends Pick<IAliasedTable, "alias">
> = (
    FromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
    (
        Extract<
            AliasedTableT["alias"],
            JoinArrayUtil.TableAlias<FromClauseT["outerQueryJoins"]>
        > extends never ?
        unknown :
        CompileError<[
            "Table alias",
            Extract<
                AliasedTableT["alias"],
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
    aliasedTable : Pick<IAliasedTable, "alias">
) {
    if (fromClause.outerQueryJoins != undefined) {
        if (fromClause.outerQueryJoins.some(j => j.tableAlias == aliasedTable.alias)) {
            throw new Error(`Table alias ${aliasedTable.alias} already used in outer query JOINs`);
        }
    }
}
