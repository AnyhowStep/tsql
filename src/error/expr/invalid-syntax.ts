/**
 * This error happens when you do something like,
 * + `'qwerty'::timestamp` (PostgreSQL)
 * + General string syntax errors
 *
 * + MySQL      : `ER_SYNTAX_ERROR`
 * + PostgreSQL : `invalid input syntax for type`
 */
export class InvalidSyntaxError extends Error {
    constructor (message : string) {
        super(message);
        Object.setPrototypeOf(this, InvalidSyntaxError.prototype);
    }
}
InvalidSyntaxError.prototype.name = "InvalidSyntaxError";
