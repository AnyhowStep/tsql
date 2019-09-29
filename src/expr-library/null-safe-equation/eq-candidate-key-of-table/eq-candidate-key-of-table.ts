import * as tm from "type-mapping";
import {ITable, TableUtil} from "../../../table";
import {Expr} from "../../../expr";
import {UsedRefUtil} from "../../../used-ref";
import {and} from "../../logical";
import {pickOwnEnumerable} from "../../../type-util";
import {assertNullSafeComparableToCandidateKeysOfTable} from "./assert-null-safe-comparable-to-candidate-keys-of-table";
import {EqCandidateKeyOfTableDelegate} from "./eq-candidate-keys-of-table-delegate";
import {nullSafeEq} from "../null-safe-eq";

/**
 * Convenience function for,
 * ```ts
 *  myQuery
 *      .where(() => tsql.and(
 *          tsql.nullSafeEq(src.dstCk0, dst.dstCk0),
 *          tsql.nullSafeEq(src.dstCk1, dst.dstCk1),
 *          tsql.nullSafeEq(src.dstCk2, dst.dstCk2),
 *          //etc.
 *      ));
 * ```
 * -----
 *
 * + The `src` does not need to have keys.
 * + The `dst` must have at least one candidate key.
 * + The `src` must have columns **null-safe** comparable to columns of `dst`'s candidate key.
 *
 * -----
 *
 * Uses `nullSafeEq()` internally because `src.dstCkX` and `dst.dstCkX` may have nullable columns.
 *
 * @param src - A table that does not need keys
 * @param dst - The table with at least one candidate key to compare against
 * @param eqCandidateKeyofTableDelegate - A function that returns columns from `src` matching columns of `dst`
 */
export type EqCandidateKeyOfTable =
    <
        SrcT extends Pick<ITable, "columns">,
        DstT extends Pick<ITable, "columns"|"candidateKeys">,
        SrcColumnsT extends TableUtil.ColumnArraysFromCandidateKeys<SrcT, DstT>
    > (
        src : SrcT,
        dst : DstT,
        eqCandidateKeyofTableDelegate : EqCandidateKeyOfTableDelegate<SrcT, DstT, SrcColumnsT>
    ) => (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<SrcT["columns"]|DstT["columns"]>
        }>
    )
;

export const eqCandidateKeyOfTable : EqCandidateKeyOfTable = (
    <
        SrcT extends Pick<ITable, "columns">,
        DstT extends Pick<ITable, "columns"|"candidateKeys">,
        SrcColumnsT extends TableUtil.ColumnArraysFromCandidateKeys<SrcT, DstT>
    > (
        src : SrcT,
        dst : DstT,
        eqCandidateKeyofTableDelegate : EqCandidateKeyOfTableDelegate<SrcT, DstT, SrcColumnsT>
    ) : (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<SrcT["columns"]|DstT["columns"]>
        }>
    ) => {
        const candidateKeys = TableUtil.extractCandidateKeysWithColumnAliasInTable<DstT, SrcT>(dst, src);
        const columnAliases : string[] = [];
        for (const key of candidateKeys) {
            columnAliases.push(...key);
        }

        const columns : (
            Pick<
                SrcT["columns"],
                TableUtil.ExtractCandidateKeysWithColumnAliasInTable_Input<DstT, SrcT>[number]
            >
        ) = pickOwnEnumerable(
            src.columns,
            columnAliases
        );
        const srcColumns : SrcColumnsT = eqCandidateKeyofTableDelegate(columns);
        const dstCandidateKey = assertNullSafeComparableToCandidateKeysOfTable(
            src,
            dst,
            srcColumns
        );

        /**
         * No need to `.sort()`, just use `candidateKey` and the order
         * the user set.
         */
        const arr = dstCandidateKey.map((columnAlias) => {
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
