import * as tm from "type-mapping";
import {TableWithPrimaryKey, ITable, TableUtil} from "../../../table";
import {Expr} from "../../../expr";
import {UsedRefUtil} from "../../../used-ref";
import {and} from "../logical";
import {nullSafeEq} from "./null-safe-eq";

/**
 * Convenience function for,
 * ```ts
 *  myQuery
 *      .where(() => tsql.and(
 *          tsql.nullSafeEq(src.dstPk0, dst.dstPk0),
 *          tsql.nullSafeEq(src.dstPk1, dst.dstPk1),
 *          tsql.nullSafeEq(src.dstPk2, dst.dstPk2),
 *          //etc.
 *      ));
 * ```
 * -----
 *
 * + The `src` does not need to have keys.
 * + The `dst` must have a primary key.
 * + The `src` must have columns **null-safe** comparable to columns of `dst`'s primary key.
 *
 * -----
 *
 * Uses `nullSafeEq()` internally because `src.dstPkX` may have nullable columns.
 *
 * @param src - A table that does not need keys
 * @param dst - The table with a primary key to compare against
 */
export type EqPrimaryKeyOfTable =
    <
        SrcT extends Pick<ITable, "columns">,
        DstT extends Pick<TableWithPrimaryKey, "columns"|"primaryKey">
    > (
        src : SrcT,
        dst : (
            & DstT
            & TableUtil.AssertHasNullSafeComparablePrimaryKey<DstT, SrcT["columns"]>
        )
    ) => (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<SrcT["columns"]|DstT["columns"]>
        }>
    )
;
export const eqPrimaryKeyOfTable : EqPrimaryKeyOfTable = (
    <
        SrcT extends Pick<ITable, "columns">,
        DstT extends Pick<TableWithPrimaryKey, "columns"|"primaryKey">
    > (
        src : SrcT,
        dst : (
            & DstT
            /**
             * @todo Investigate
             * Possibly related to,
             * https://github.com/microsoft/TypeScript/issues/32442
             */
            //& TableUtil.AssertHasNullSafeComparablePrimaryKey<DstT, SrcT["columns"]>
        )
    ) : (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<SrcT["columns"]|DstT["columns"]>
        }>
    ) => {
        TableUtil.assertHasNullSafeComparablePrimaryKey(dst, src.columns);

        /**
         * No need to `.sort()`, just use `primaryKey` and the order
         * the user set.
         */
        const arr = dst.primaryKey.map((columnAlias) => {
            /**
             * We use `nullSafeEq` because `src.dstPkX` may have nullable columns.
             */
            const expr = nullSafeEq(
                src.columns[columnAlias],
                dst.columns[columnAlias]
            );
            return expr as Expr<{
                mapper : tm.SafeMapper<boolean>,
                usedRef : UsedRefUtil.FromColumnMap<SrcT["columns"]|DstT["columns"]>
            }>;
        });
        const result = and(...arr);
        return result as Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<SrcT["columns"]|DstT["columns"]>
        }>;
    }
);
