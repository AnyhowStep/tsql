import {IQuery} from "../../query";
import {IAliasedTable} from "../../../aliased-table";
import {IJoin, JoinArrayUtil} from "../../../join";
import {CompileError} from "../../../compile-error";

/**
 * Problem: Duplicate table names in required `_parentJoins` and `FROM/JOIN` clause not allowed
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      tableA --_parentJoins
 *  WHERE (
 *      EXISTS ( --This sub query says it requires _parentJoins `tableA`
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
 *      tableA --_parentJoins
 *  WHERE (
 *      EXISTS ( --This sub query says it requires _parentJoins `tableA`
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
export type AssertAliasedTableNotInParentJoins<
    QueryT extends IQuery,
    AliasedTableT extends IAliasedTable,
    TrueT
> = (
    QueryT["_parentJoins"] extends readonly IJoin[] ?
    (
        Extract<
            AliasedTableT["alias"],
            JoinArrayUtil.TableAliases<QueryT["_parentJoins"]>
        > extends never ?
        TrueT :
        CompileError<[
            "Alias",
            Extract<
                AliasedTableT["alias"],
                JoinArrayUtil.TableAliases<QueryT["_parentJoins"]>
            >,
            "already used in parent JOINs",
            JoinArrayUtil.TableAliases<QueryT["_parentJoins"]>
        ]>
    ) :
    TrueT
);
export function assertAliasedTableNotInParentJoins (
    query : IQuery,
    aliasedTable : IAliasedTable
) {
    if (query._parentJoins != undefined) {
        if (query._parentJoins.some(j => j.aliasedTable.alias == aliasedTable.alias)) {
            throw new Error(`Alias ${aliasedTable.alias} already used in parent JOINs`);
        }
    }
}
