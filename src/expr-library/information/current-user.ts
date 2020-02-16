import * as tm from "type-mapping";
import {makeOperator0} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * On MySQL,
 * > Returns the user name and host name combination for the MySQL account
 * > that the server used to authenticate the current client.
 * > This account determines your access privileges.
 *
 * -----
 *
 * On PostgreSQL,
 * > the user identifier that is applicable for permission checking.
 * > The SQL standard draws a distinction between current_role and current_user,
 * > but PostgreSQL does not, since it unifies users and roles into a single kind of entity.
 *
 * -----
 *
 * SQLite does not have the concept of users.
 *
 * -----
 *
 * + https://dev.mysql.com/doc/refman/5.7/en/information-functions.html#function_current-user
 * + https://www.postgresql.org/docs/9.2/functions-info.html
 * + https://stackoverflow.com/questions/16658880/sqlite-user-password-security/28566503
 *
 * -----
 *
 * + MySQL      : `CURRENT_USER`
 *   + MySQL has a `USER()` function that does something different.
 * + PostgreSQL : `CURRENT_USER`
 * + SQLite     : None. It does not make sense to ask what the current user is.
 */
export const currentUser = makeOperator0<OperatorType.CURRENT_USER, string|null>(
    OperatorType.CURRENT_USER,
    tm.orNull(tm.string())
);
