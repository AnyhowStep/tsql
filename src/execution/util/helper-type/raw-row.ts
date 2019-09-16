/**
 * A row in the middle of processing.
 */
export type RawRow = {
    [tableAlias : string] : (
        | undefined
        | {
            [columnAlias : string] : unknown
        }
    )
};
