import {SqlError, SqlErrorArgs} from "../sql-error";

/**
 * This error happens when you do something like,
 * + `1 / 0`
 * + `0 / 0`
 *
 * + MySQL      : -NA- (Returns `null`)
 * + PostgreSQL : `division by zero`
 */
export class DivideByZeroError extends SqlError {
    constructor (args : SqlErrorArgs) {
        super(args);
        Object.setPrototypeOf(this, DivideByZeroError.prototype);
    }
}
DivideByZeroError.prototype.name = "DivideByZeroError";
