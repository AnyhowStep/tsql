import {ITable, TableUtil} from "../../../../table";
import {AssertNullSafeComparableToCandidateKeysOfTable} from "./assert-null-safe-comparable-to-candidate-keys-of-table";

export type EqCandidateKeyOfTableDelegate<
    SrcT extends Pick<ITable, "columns">,
    DstT extends Pick<ITable, "columns"|"candidateKeys">,
    SrcColumnsT extends TableUtil.ColumnArraysFromCandidateKeys<SrcT, DstT>
> =
    (
        columns : Pick<
            SrcT["columns"],
            TableUtil.ExtractCandidateKeysWithColumnAliasInTable_Input<DstT, SrcT>[number]
        >
    ) => (
        & SrcColumnsT
        & AssertNullSafeComparableToCandidateKeysOfTable<
            SrcT,
            DstT,
            SrcColumnsT
        >
    )
;
