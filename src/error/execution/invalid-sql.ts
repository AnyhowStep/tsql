import {SqlError, SqlErrorArgs} from "../sql-error";

/**
 * This error happens when the database is unable to parse the SQL string.
 *
 * + MySQL      : `ER_SYNTAX_ERROR`, `ER_PARSE_ERROR`
 * + PostgreSQL : `syntax error at`
 */
export class InvalidSqlError extends SqlError {
    constructor (args : SqlErrorArgs) {
        super(args);
        Object.setPrototypeOf(this, InvalidSqlError.prototype);
    }
}
InvalidSqlError.prototype.name = "InvalidSqlError";
