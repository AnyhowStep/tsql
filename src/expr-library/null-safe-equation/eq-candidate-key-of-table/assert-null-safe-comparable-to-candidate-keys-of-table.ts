import {ITable, TableUtil} from "../../../table";
import {ColumnMapUtil} from "../../../column-map";
import {KeyUtil} from "../../../key";
import {UnionToIntersection, PickMulti, pickOwnEnumerable} from "../../../type-util";
import {CompileError} from "../../../compile-error";
import {IColumn} from "../../../column";

export type AssertNullSafeComparableToCandidateKeysOfTableImpl<
    SrcT extends Pick<ITable, "columns">,
    DstT extends Pick<ITable, "columns"|"candidateKeys">,
    SrcColumnsT extends readonly IColumn[]//TableUtil.ColumnArraysFromCandidateKeys<SrcT, DstT>
> =
    KeyUtil.ExcludeIfInKeyArray<
        KeyUtil.FromColumnArray<SrcColumnsT>,
        TableUtil.ExtractCandidateKeysWithColumnAliasInOneOfColumnArray<
            DstT,
            SrcColumnsT
        >[]
        //TableUtil.ExtractCandidateKeysWithColumnAliasInTable<DstT, SrcT>[]
    > extends never ?
    Extract<
        UnionToIntersection<
            SrcColumnsT extends SrcColumnsT ?
            [
                ColumnMapUtil.AssertIsNullSafeComparableIfSameOwnEnumerableKeys_NonUnion<
                    ColumnMapUtil.FromColumnArray<SrcColumnsT>,
                    PickMulti<
                        DstT["columns"],
                        KeyUtil.ExtractIfInKeyArray<
                            KeyUtil.FromColumnArray<SrcColumnsT>,
                            TableUtil.ExtractCandidateKeysWithColumnAliasInOneOfColumnArray<
                                DstT,
                                SrcColumnsT
                            >[]
                            //TableUtil.ExtractCandidateKeysWithColumnAliasInTable<DstT, SrcT>[]
                        >
                    >
                >
            ] :
            never
        >,
        [unknown]
    >[0] :
    CompileError<[
        KeyUtil.ToErrorMessageFriendlyType<
            KeyUtil.ExcludeIfInKeyArray<
                KeyUtil.FromColumnArray<SrcColumnsT>,
                TableUtil.ExtractCandidateKeysWithColumnAliasInOneOfColumnArray<
                    DstT,
                    SrcColumnsT
                >[]
                //TableUtil.ExtractCandidateKeysWithColumnAliasInTable<DstT, SrcT>[]
            >
        >,
        "is invalid candidate key; expecting one of",
        KeyUtil.ToErrorMessageFriendlyType<
            /*TableUtil.ExtractCandidateKeysWithColumnAliasInOneOfColumnArray<
                DstT,
                SrcColumnsT
            >*/
            /**
             * We use this type for better error message reporting.
             */
            TableUtil.ExtractCandidateKeysWithColumnAliasInTable_Input<DstT, SrcT>
        >
    ]>
;

/**
 * + Assumes `SrcT` may be a union
 * + Assumes `DstT` may be a union
 * + Assumes `SrcColumnsT` may be a union
 * + Assumes `SrcColumnsT` is only ever built by using the arguments of `EqCandidateKeyOfTableDelegate`
 */
export type AssertNullSafeComparableToCandidateKeysOfTable<
    SrcT extends Pick<ITable, "columns">,
    DstT extends Pick<ITable, "columns"|"candidateKeys">,
    SrcColumnsT extends TableUtil.ColumnArraysFromCandidateKeys<SrcT, DstT>
> =
    AssertNullSafeComparableToCandidateKeysOfTableImpl<SrcT, DstT, SrcColumnsT>
;

export function assertNullSafeComparableToCandidateKeysOfTable<
    SrcT extends Pick<ITable, "columns">,
    DstT extends Pick<ITable, "columns"|"candidateKeys">,
    SrcColumnsT extends TableUtil.ColumnArraysFromCandidateKeys<SrcT, DstT>
> (
    src : SrcT,
    dst : DstT,
    srcColumns : SrcColumnsT,
) : (
    DstT["candidateKeys"][number]
) {
    const candidateKeys = TableUtil.extractCandidateKeysWithColumnAliasInTable<DstT, SrcT>(dst, src);
    const srcColumnAliases = srcColumns.map(column => column.columnAlias);
    const dstCandidateKey = candidateKeys.find(
        candidateKey => KeyUtil.isEqual(candidateKey, srcColumnAliases)
    );
    if (dstCandidateKey == undefined) {
        throw new Error(`${ColumnMapUtil.tableAlias(src.columns)} (${srcColumnAliases.join(",")}) cannot be used to compare with candidate keys of ${ColumnMapUtil.tableAlias(dst.columns)}`);
    }
    ColumnMapUtil.assertIsNullSafeComparable(
        ColumnMapUtil.fromColumnArray(srcColumns),
        pickOwnEnumerable(
            dst.columns,
            dstCandidateKey
        )
    );
    return dstCandidateKey;
}
