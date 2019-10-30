export interface CandidateKeyMeta {
    /**
     * The name of the candidate key
     */
    candidateKeyName : string,
    /**
     * The columns that are part of this candidate key
     */
    columnAliases : readonly string[],
}
