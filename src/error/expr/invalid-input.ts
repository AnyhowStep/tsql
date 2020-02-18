import {SqlError, SqlErrorArgs} from "../sql-error";

/**
 * This error happens when you do something like,
 * + `'qwerty'::timestamp` (PostgreSQL)
 * + General input errors
 *
 * + MySQL      : `ER_INVALID_JSON_TEXT_IN_PARAM` (`CAST('qwerty' AS JSON)`), etc.
 * + PostgreSQL : `invalid input syntax for type`
 */
export class InvalidInputError extends SqlError {
    constructor (args : SqlErrorArgs) {
        super(args);
        Object.setPrototypeOf(this, InvalidInputError.prototype);
    }
}
InvalidInputError.prototype.name = "InvalidInputError";
