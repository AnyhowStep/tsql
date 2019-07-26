/**
 * The direction to sort the result set
 */
export namespace SortDirection {
    /**
     * Sorts the result set in ascending order
     */
    export const ASC = "ASC";
    export type ASC = typeof ASC;

    /**
     * Sorts the result set in descending order
     */
    export const DESC = "DESC";
    export type DESC = typeof DESC;
};

export type SortDirection = (
    | typeof SortDirection.ASC
    | typeof SortDirection.DESC
);