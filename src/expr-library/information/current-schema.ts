import * as tm from "type-mapping";
import {makeOperator0, Operator0} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * Returns the default (current) schema name as a string.
 * If there is no default schema, returns `NULL`.
 *
 * -----
 *
 * MySQL does not make a distinction between "database" and "schema".
 * PostgreSQL does.
 *
 * -----
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_database
 * + https://www.postgresql.org/docs/9.2/functions-info.html
 * + https://www.sqlite.org/lang_attach.html
 *
 * -----
 *
 * + MySQL      : `DATABASE()`
 * + PostgreSQL : `CURRENT_SCHEMA`
 * + SQLite     : `'main'` should always be the current database.
 *   + There's also `'temp'`, I guess
 */
export const currentSchema : Operator0<string|null> = makeOperator0<OperatorType.CURRENT_SCHEMA, string|null>(
    OperatorType.CURRENT_SCHEMA,
    tm.orNull(tm.string())
);
