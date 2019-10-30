import {ColumnMeta} from "./column-meta";
import {CandidateKeyMeta} from "./candidate-key-meta";

export interface TableMeta {
    tableAlias : string,

    columns : readonly ColumnMeta[],
    candidateKeys : readonly CandidateKeyMeta[],

    primaryKey : CandidateKeyMeta|undefined,
}
