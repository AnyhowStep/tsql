/**
 * This error happens when you do something like,
 * + `MAX_BIGINT_SIGNED + 1`
 * + `MIN_BIGINT_SIGNED - 1`
 * + General overflow errors
 *
 * + MySQL      : `ER_DATA_OUT_OF_RANGE`
 * + PostgreSQL : `out of range`
 */
export class DataOutOfRangeError extends Error {
    constructor (message : string) {
        super(message);
        Object.setPrototypeOf(this, DataOutOfRangeError.prototype);
    }
}
DataOutOfRangeError.prototype.name = "DataOutOfRangeError";
