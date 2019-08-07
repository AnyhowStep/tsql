import {IFromClause} from "../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {IJoin, JoinArrayUtil} from "../../../join";
import {CompileError} from "../../../compile-error";

/**
 * Problem: Duplicate table names in current `FROM/JOIN` clause not allowed
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      tableA
 *  JOIN
 *      tableA
 * ```
 *
 * Solution: Alias the duplicate table
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      tableA
 *  JOIN
 *      tableA AS otherTableA
 * ```
 */
export type AssertNotInCurrentJoins<
    FromClauseT extends IFromClause,
    AliasedTableT extends Pick<IAliasedTable, "alias">
> = (
    FromClauseT["currentJoins"] extends readonly IJoin[] ?
    (
        Extract<
            AliasedTableT["alias"],
            JoinArrayUtil.TableAlias<FromClauseT["currentJoins"]>
        > extends never ?
        unknown :
        CompileError<[
            "Table alias",
            Extract<
                AliasedTableT["alias"],
                JoinArrayUtil.TableAlias<FromClauseT["currentJoins"]>
            >,
            "already used in current query JOINs",
            JoinArrayUtil.TableAlias<FromClauseT["currentJoins"]>
        ]>
    ) :
    unknown
);
export function assertNotInCurrentJoins (
    fromClause : IFromClause,
    aliasedTable : Pick<IAliasedTable, "alias">
) {
    if (fromClause.currentJoins != undefined) {
        if (fromClause.currentJoins.some(j => j.tableAlias == aliasedTable.alias)) {
            throw new Error(`Table alias ${aliasedTable.alias} already used in current query JOINs`);
        }
    }
}
