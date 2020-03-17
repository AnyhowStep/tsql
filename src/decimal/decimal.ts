/**
 * This interface represents a SQL `DECIMAL` type.
 *
 * JavaScript does not have a built-in arbitrary precision decimal type.
 * So, we make do with a minimal interface.
 */
export interface Decimal {
    /**
     * This is the only method a `DECIMAL` type is expected to have.
     * You may use the string representation to convert to a `number|string|bigint`,
     * or use a library implementing arbitrary precision decimal types.
     */
    toString () : string;
    /**
     * A brand that marks this as a SQL `DECIMAL` type.
     * This property will not exist during run-time.
     */
    $isDecimal : void;
}
