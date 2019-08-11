import * as tm from "type-mapping";
import {TableWithPrimaryKey} from "../../../table";
import {PrimaryKey, PrimaryKeyUtil} from "../../../primary-key";
import {UnionToIntersection} from "../../../type-util";
import {Expr} from "../../../expr";
import {UsedRefUtil} from "../../../used-ref";
import {eq} from "./eq";
import {and} from "../logical";

/**
 * Convenience function for,
 * ```ts
 *  tsql.and(
 *      tsql.eq(primaryKeyColumn0, value0),
 *      tsql.eq(primaryKeyColumn1, value1),
 *      tsql.eq(primaryKeyColumn2, value2)
 *      //etc.
 *  );
 * ```
 *
 * Uses `eq()` internally because the primary key of a table
 * cannot have nullable columns.
 *
 * @param table - The table with a primary key
 * @param primaryKey - The primary key values to compare against
 */
export function eqPrimaryKey<
    TableT extends Pick<TableWithPrimaryKey, "columns"|"primaryKey">
> (
    table : TableT,
    primaryKey : UnionToIntersection<PrimaryKey<TableT>>
) : (
    Expr<{
        mapper : tm.SafeMapper<boolean>,
        usedRef : UsedRefUtil.FromColumnMap<TableT["columns"]>
    }>
) {
    PrimaryKeyUtil.mapper(table)(`${table}.primaryKey`, primaryKey);

    const arr = table.primaryKey.map((columnAlias) => {
        /**
         * We use `eq` because the primary key of a table cannot have
         * nullable columns.
         */
        const expr = eq(
            table.columns[columnAlias],
            primaryKey[columnAlias as keyof UnionToIntersection<PrimaryKey<TableT>>]
        );
        return expr as Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<TableT["columns"]>
        }>;
    });
    const result = and(...arr);
    return result as Expr<{
        mapper : tm.SafeMapper<boolean>,
        usedRef : UsedRefUtil.FromColumnMap<TableT["columns"]>
    }>;
}
