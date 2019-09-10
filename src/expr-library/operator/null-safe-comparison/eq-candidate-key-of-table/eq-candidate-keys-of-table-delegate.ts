import {ITable, TableUtil} from "../../../../table";
import {AssertNullSafeComparableToCandidateKeysOfTable} from "./assert-null-safe-comparable-to-candidate-keys-of-table";
import {Merge} from "../../../../type-util";

export type EqCandidateKeyOfTableDelegate<
    SrcT extends Pick<ITable, "columns">,
    DstT extends Pick<ITable, "columns"|"candidateKeys">,
    SrcColumnsT extends TableUtil.ColumnArraysFromCandidateKeys<SrcT, DstT>
> =
    (
        columns : Merge<Pick<
            SrcT["columns"],
            TableUtil.ExtractCandidateKeysWithColumnAliasInTable_Input<DstT, SrcT>[number]
        >>
    ) => (
        & SrcColumnsT
        & AssertNullSafeComparableToCandidateKeysOfTable<
            SrcT,
            DstT,
            SrcColumnsT
        >
    )
;
