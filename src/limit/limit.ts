/**
 * May be used for the `LIMIT` clause or `UNION`'s `LIMIT` clause.
 *
 * @todo Consider forcing `bigint` only?
 * A `maxRowCount/offset` of `3.141` would be weird.
 */
export interface LimitData {
    /**
     * This is called `**max**RowCount` and not `rowCount` (like MySQL calls it)
     * because we can say we want a `maxRowCount` of `10` and only get `3` rows.
     * Or a `maxRowCount` of `1` and get `0` rows.
     */
    readonly maxRowCount : number|bigint,
    /**
     * The offset of the initial row is `0`.
     * (Remember, arrays start from zero!)
     */
    readonly offset : number|bigint,
}
