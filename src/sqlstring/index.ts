import * as tm from "type-mapping";
const ID_BACKTICK_GLOBAL_REGEXP     = /`/g;
const ID_DOUBLE_QUOTE_GLOBAL_REGEXP = /"/g;
const CHARS_GLOBAL_REGEXP = /[\0\b\t\n\r\x1a\"\'\\]/g; // eslint-disable-line no-control-regex
const CHARS_ESCAPE_MAP : (
    {
        [k : string] : string|undefined
    }
) = {
    "\0"   : "\\0",
    "\b"   : "\\b",
    "\t"   : "\\t",
    "\n"   : "\\n",
    "\r"   : "\\r",
    "\x1a" : "\\Z",
    "\""   : "\\\"",
    "\'"   : "\\\'",
    "\\"   : "\\\\",
};

/**
 * Escapes a MySQL identifier.
 *
 * For example,
 * + Database name
 * + Table name
 * + Column name
 * + Alias
 *
 * -----
 *
 * ```ts
 * escapeIdentifier("x") == "`x`"
 * escapeIdentifier("x.y") == "`x.y`"
 * escapeIdentifier("x`x.y") == "`x``x.y`"
 * ```
 *
 * @param rawIdentifier - The identifier to escape
 *
 * @todo Refactor this.
 * + MySQL uses backticks.
 * + PostgreSQL uses double quotes. (Following the same rules as MySQL)
 * + MySQL can be made to use double quotes by enabling `ANSI_QUOTES` but this is disabled by default
 *
 * Each database adapter will need to create their own `escaoeIdentifier` function
 * and pass it around.
 *
 * A pain in the butt. Necessary, however.
 *
 * -----
 *
 * Another option would be forcing the MySQL adapter to always run a SQL query
 * to enable `ANSI_QUOTES`...
 *
 * Definitely less of a hassle there.
 *
 * @deprecated Use the `Identifier` AST Node instead
 */
export function escapeIdentifierWithBackticks (rawIdentifier : string) : string {
    return (
        "`" +
        String(rawIdentifier).replace(ID_BACKTICK_GLOBAL_REGEXP, "``") +
        "`"
    );
}
export function escapeIdentifierWithDoubleQuotes (rawIdentifier : string) : string {
    return (
        "\"" +
        String(rawIdentifier).replace(ID_DOUBLE_QUOTE_GLOBAL_REGEXP, "\"\"") +
        "\""
    );
}

/**
 * Escapes a MySQL value.
 *
 * Does not handle `Date` as timezones are a pain.
 *
 * @param rawValue - The value to escape
 */
export function escapeValue (rawValue : null|boolean|number|bigint|Buffer) : string {
    if (rawValue === null) {
        return "NULL";
    }

    if (tm.TypeUtil.isBigInt(rawValue)) {
        /**
         * Max `BIGINT SIGNED` value: `SELECT 9223372036854775807+9223372036854775807`
         *
         * + MySQL      : `SELECT 9223372036854775807+9223372036854775807`; Error, out of range of bigint signed value
         * + PostgreSQL : `SELECT 9223372036854775807+9223372036854775807`; Error, out of range of bigint signed value
         * + SQLite     : `SELECT 9223372036854775807+9223372036854775807`; `18446744073709552000` (incorrect value)
         * + Expected   : `18446744073709551614`
         *
         * -----
         *
         * + MySQL      : `SELECT 18446744073709551615+18446744073709551615`; Error, out of range of bigint unsigned value
         * + PostgreSQL : `SELECT 18446744073709551615+18446744073709551615`; `36893488147419103230` (DECIMAL, not bigint unsigned)
         * + SQLite     : `SELECT 18446744073709551615+18446744073709551615`; `36893488147419103000` (incorrect value)
         * + Expected   : `36893488147419103230`
         *
         * PostgreSQL and SQLite do not support `BIGINT UNSIGNED`.
         * Selecting an integer larger than bigint signed in PostgreSQL will give you a `DECIMAL` value.
         *
         * @todo Fix this
         */
        return String(rawValue);
    }

    switch (typeof rawValue) {
        case "boolean": {
            return rawValue ?
                "TRUE" :
                "FALSE";
        }
        case "number": {
            if (!isFinite(rawValue)) {
                return "NULL";
            }
            const result = String(rawValue);
            if (result.indexOf("e") < 0) {
                /**
                 * We add `e0` at the end to signal to the DBMS that this is a double value.
                 * Not a `DECIMAL` value.
                 */
                /**
                 * + MySQL      : `SELECT 1e300`; `1e300`
                 * + PostgreSQL : `SELECT 1e300`; `1000000000...` (total 300 zeroes) (DECIMAL)
                 * + SQLite     : `SELECT 1e300`; `1e300`
                 *
                 * -----
                 *
                 * PostgreSQL:
                 * ```sql
                 *  SELECT
                 *      pg_typeof(1e19), -- numeric
                 *      pg_typeof(1e1),  -- numeric
                 *      pg_typeof(10)    -- integer
                 * ```
                 *
                 * SQLite:
                 * ```sql
                 *  SELECT
                 *      typeof(1e19), -- real
                 *      typeof(1e1),  -- real
                 *      typeof(10)    -- integer
                 * ```
                 */
                return result + "e0";
            } else {
                return result;
            }
        }
        case "object": {
            if (Buffer.isBuffer(rawValue)) {
                return bufferToString(rawValue);
            } else {
                throw new Error(`Don't know how to escape non-Buffer object`);
            }
        }
        default: {
            throw new Error(`Don't know how to escape ${typeof rawValue}`);
        }
    }
};

function bufferToString (buffer : Buffer) : string {
  return "X" + cStyleEscapeString(buffer.toString("hex"));
};

/**
 * Only MySQL supports C-style escapes (using the backslash character).
 */
export function cStyleEscapeString (rawString : string) : string {
    let result = "";
    let chunkIndex = CHARS_GLOBAL_REGEXP.lastIndex = 0;
    let match : RegExpExecArray | null = CHARS_GLOBAL_REGEXP.exec(rawString);

    while (match != undefined) {
        const escapedChar = CHARS_ESCAPE_MAP[match[0]];
        if (escapedChar == undefined) {
            throw new Error(`Unknown escapable character ${match[0]}`);
        }
        result += rawString.slice(chunkIndex, match.index) + escapedChar;
        chunkIndex = CHARS_GLOBAL_REGEXP.lastIndex;

        match = CHARS_GLOBAL_REGEXP.exec(rawString);
    }

    if (chunkIndex === 0) {
        //Nothing was escaped
        return "'" + rawString + "'";
    }

    if (chunkIndex < rawString.length) {
        return "'" + result + rawString.slice(chunkIndex) + "'";
    }

    return "'" + result + "'";
}

/**
 * PostgreSQL and SQLite use Pascal-style escapes
 */
export function pascalStyleEscapeString (rawString : string) : string {
    const result = rawString.replace(/\'/g, `''`);

    return "'" + result + "'";
}
