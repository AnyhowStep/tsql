import {IQuery} from "../../query";
import {IAliasedTable} from "../../../aliased-table";
import {IJoin, JoinArrayUtil} from "../../../join";
import {CompileError} from "../../../compile-error";

/**
 * Problem: Duplicate table names in `FROM/JOIN` clause not allowed
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
export type AssertAliasedTableNotInJoins<
    QueryT extends IQuery,
    AliasedTableT extends IAliasedTable,
    TrueT
> = (
    QueryT["_joins"] extends readonly IJoin[] ?
    (
        Extract<
            AliasedTableT["alias"],
            JoinArrayUtil.TableAliases<QueryT["_joins"]>
        > extends never ?
        TrueT :
        CompileError<[
            "Alias",
            Extract<
                AliasedTableT["alias"],
                JoinArrayUtil.TableAliases<QueryT["_joins"]>
            >,
            "already used in previous JOINs",
            JoinArrayUtil.TableAliases<QueryT["_joins"]>
        ]>
    ) :
    TrueT
);
export function assertAliasedTableNotInJoins (
    query : IQuery,
    aliasedTable : IAliasedTable
) {
    if (query._joins != undefined) {
        if (query._joins.some(j => j.aliasedTable.alias == aliasedTable.alias)) {
            throw new Error(`Alias ${aliasedTable.alias} already used in previous JOINs`);
        }
    }
}