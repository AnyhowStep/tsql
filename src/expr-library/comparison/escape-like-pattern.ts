import {assertValidEscapeChar} from "./like";

//TODO-FEATURE Create a version using MySQL/PostgreSQL/SQLite queries
//REGEXP_REPLACE(pattern, '(\\%|\\_)', '\\$1', 1, 0, 'm') or something
/**
 * With `LIKE` you can use the following two wildcard characters in the pattern:
 *
 * + `%` matches any number of characters, even zero characters.
 * + `_` matches exactly one character.
 *
 * This function just prepends `escapeChar` to each of the above characters.
 * It also prepends `escapeChar` to itself.
 *
 * If no `escapeChar` is given, backslash is assumed.
 */
export function escapeLikePattern (pattern : string, escapeChar : string = "\\") {
    assertValidEscapeChar(escapeChar);
    /**
     * Escape occurrences of the `escapeChar`
     */
    pattern = pattern.split(escapeChar).join(escapeChar + escapeChar);
    /**
     * Escape wildcard characters
     */
    return pattern.replace(/(\%|\_)/g, s => escapeChar + s);
}
