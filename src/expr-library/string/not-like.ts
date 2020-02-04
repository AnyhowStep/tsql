import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator3} from "../factory/make-operator-3";
import {BuiltInExpr} from "../../built-in-expr";
import {ExprUtil} from "../../expr";
import {assertValidLikeEscapeChar} from "./like";

const notLikeEscapeImpl = makeOperator3<OperatorType.NOT_LIKE_ESCAPE, string, string, string, boolean>(
    OperatorType.NOT_LIKE_ESCAPE,
    tm.mysql.boolean(),
    TypeHint.STRING
);

/**
 * + The escape character must always be specified, with this unified library.
 * + The escape character must be of length `1`.
 *
 * -----
 *
 * Different databases, and collations, may cause the `LIKE` operator to handle case-sensitivity differently.
 *
 * -----
 *
 * This library requires the escape character to always be specified
 * because different databases have different defaults.
 *
 * Forcing an explicit escape character helps keep behaviour more consistent
 * across databases.
 *
 * Default escape characters per database,
 * + MySQL      : backslash (`\`)
 * + PostgreSQL : backslash (`\`)
 * + SQLite     : no-escape-character
 *
 * -----
 *
 * This library requires the escape character to have length `1` because
 * specifying the empty string has different behaviour on different databases,
 * + MySQL      : backslash (`\`) (Seems impossible to have no-escape-character)
 * + PostgreSQL : no-escape-character
 * + SQLite     : throws error (Use `x LIKE y` to have no-escape-character)
 *
 * @param str - The target of the search
 * @param pattern - The pattern to search for, may use wildcard characters like `%` and `_`
 * @param escapeChar - The escape character to use on the `pattern`
 */
export function notLike<
    StrT extends BuiltInExpr<string>,
    PatternT extends BuiltInExpr<string>
> (
    str : StrT,
    pattern : PatternT,
    escapeChar : string
) : (
    ExprUtil.Intersect<boolean, StrT|PatternT>
) {
    assertValidLikeEscapeChar(escapeChar);
    return notLikeEscapeImpl<StrT, PatternT, string>(
        str,
        pattern,
        escapeChar
    ) as ExprUtil.Intersect<boolean, StrT|PatternT>;
}
