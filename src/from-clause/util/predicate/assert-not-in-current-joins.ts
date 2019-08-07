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
    AliasedTableT extends Pick<IAliasedTable, "tableAlias">
> = (
    FromClauseT["currentJoins"] extends readonly IJoin[] ?
    (
        Extract<
            AliasedTableT["tableAlias"],
            JoinArrayUtil.TableAlias<FromClauseT["currentJoins"]>
        > extends never ?
        unknown :
        CompileError<[
            "Table alias",
            Extract<
                AliasedTableT["tableAlias"],
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
    aliasedTable : Pick<IAliasedTable, "tableAlias">
) {
    if (fromClause.currentJoins != undefined) {
        if (fromClause.currentJoins.some(j => j.tableAlias == aliasedTable.tableAlias)) {
            throw new Error(`Table alias ${aliasedTable.tableAlias} already used in current query JOINs`);
        }
    }
}
