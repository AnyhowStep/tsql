import {IFromClause} from "../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {IJoin, JoinArrayUtil} from "../../../join";
import {CompileError} from "../../../compile-error";

/**
 * Problem: Duplicate table names in parent `FROM/JOIN` clause and current `FROM/JOIN` clause not allowed
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      tableA --parentJoins
 *  WHERE (
 *      EXISTS ( --This sub query says it requires parentJoins `tableA`
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
 *      tableA --parentJoins
 *  WHERE (
 *      EXISTS ( --This sub query says it requires parentJoins `tableA`
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
export type AssertNotInParentJoins<
    FromClauseT extends IFromClause,
    AliasedTableT extends IAliasedTable,
    TrueT
> = (
    FromClauseT["parentJoins"] extends readonly IJoin[] ?
    (
        Extract<
            AliasedTableT["tableAlias"],
            JoinArrayUtil.TableAliases<FromClauseT["parentJoins"]>
        > extends never ?
        TrueT :
        CompileError<[
            "Table alias",
            Extract<
                AliasedTableT["tableAlias"],
                JoinArrayUtil.TableAliases<FromClauseT["parentJoins"]>
            >,
            "already used in parent query JOINs",
            JoinArrayUtil.TableAliases<FromClauseT["parentJoins"]>
        ]>
    ) :
    TrueT
);
export function assertAliasedTableNotInParentJoins (
    fromClause : IFromClause,
    aliasedTable : IAliasedTable
) {
    if (fromClause.parentJoins != undefined) {
        if (fromClause.parentJoins.some(j => j.tableAlias == aliasedTable.tableAlias)) {
            throw new Error(`Table alias ${aliasedTable.tableAlias} already used in parent query JOINs`);
        }
    }
}
