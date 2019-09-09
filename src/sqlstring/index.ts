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
export function escapeValue (rawValue : null|boolean|number|bigint|string|Buffer) : string {
    if (rawValue === null) {
        return "NULL";
    }

    switch (typeof rawValue) {
        case "boolean": {
            return rawValue ?
                "TRUE" :
                "FALSE";
        }
        case "number": {
            return String(rawValue);
        }
        case "bigint": {
            return String(rawValue);
        }
        case "string": {
            return escapeString(rawValue);
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
  return "X" + escapeString(buffer.toString("hex"));
};

function escapeString (rawString : string) : string {
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
