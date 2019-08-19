import * as tm from "type-mapping";
import {ITable, TableUtil} from "../../../../table";
import {Expr} from "../../../../expr";
import {UsedRefUtil} from "../../../../used-ref";
import {and} from "../../logical";
import {NullSafeComparison} from "../make-null-safe-comparison";
import {pickOwnEnumerable} from "../../../../type-util";
import {assertNullSafeComparableToCandidateKeysOfTable} from "./assert-null-safe-comparable-to-candidate-keys-of-table";
import {EqCandidateKeyOfTableDelegate} from "./eq-candidate-keys-of-table-delegate";
import {EqCandidateKeyOfTable} from "./eq-candidate-keys-of-table";

export function makeEqCandidateKeyOfTable (
    nullSafeEq : NullSafeComparison
) : (
    EqCandidateKeyOfTable
) {
    const result : EqCandidateKeyOfTable = <
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
    };
    return result;
}
