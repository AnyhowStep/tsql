/**
 * It's called `OperatorType` but also contains function names.
 * A function is just an operator with different syntax.
 *
 * -----
 *
 * **EVERY** new `OperatorType` added is a **BREAKING CHANGE**.
 * Make sure to bump the **MAJOR** version number.
 */
export enum OperatorType {
    /*
        Comparison Functions and Operators
        https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html
    */

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_between
     * + https://www.postgresql.org/docs/9.1/functions-comparison.html
     * + https://www.sqlite.org/lang_expr.html#between
     *
     * -----
     *
     * + MySQL        : `BETWEEN ... AND ...`
     * + PostgreSQL   : `BETWEEN ... AND ...`
     * + SQLite       : `BETWEEN ... AND ...`
     */
    BETWEEN_AND = "BETWEEN_AND",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#function_coalesce
     * + https://www.postgresql.org/docs/9.5/functions-conditional.html
     * + https://www.sqlite.org/lang_expr.html#between
     *
     * -----
     *
     * + MySQL        : `COALESCE(x, ...)`
     * + PostgreSQL   : `COALESCE(x, ...)`
     * + SQLite       : `COALESCE(x, ...)`
     */
    COALESCE = "COALESCE",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_equal
     * + https://www.postgresql.org/docs/9.1/functions-comparison.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * -----
     *
     * + MySQL        : `=`
     * + PostgreSQL   : `=`
     * + SQLite       : `=`
     */
    EQUAL = "EQUAL",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_equal-to
     * + https://www.postgresql.org/docs/9.1/functions-comparison.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * -----
     *
     * + MySQL        : `<=>`
     * + PostgreSQL   : `IS NOT DISTINCT FROM`
     * + SQLite       : `IS`
     */
    NULL_SAFE_EQUAL = "NULL_SAFE_EQUAL",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_greater-than
     * + https://www.postgresql.org/docs/9.1/functions-comparison.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * -----
     *
     * + MySQL        : `>`
     * + PostgreSQL   : `>`
     * + SQLite       : `>`
     */
    GREATER_THAN = "GREATER_THAN",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_greater-than-or-equal
     * + https://www.postgresql.org/docs/9.1/functions-comparison.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * -----
     *
     * + MySQL        : `>=`
     * + PostgreSQL   : `>=`
     * + SQLite       : `>=`
     */
    GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#function_greatest
     * + https://www.postgresql.org/docs/8.4/functions-conditional.html#AEN15322
     * + https://www.sqlite.org/lang_corefunc.html#maxoreunc
     *
     * -----
     *
     * + MySQL        : `GREATEST(x, y, ...)` //Requires 2 args
     *   + `NULL` values cause return value of `NULL`
     * + PostgreSQL   : `GREATEST(x, ...)`    //Requires 1 arg
     *   + Ignores `NULL` values
     * + SQLite       : `MAX(x, ...)`         //Requires 1 arg
     *   + `NULL` values cause return value of `NULL`
     */
    GREATEST = "GREATEST",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_in
     * + https://www.postgresql.org/docs/9.0/functions-subquery.html#AEN16806
     * + https://www.sqlite.org/lang_expr.html#in_op
     *
     * -----
     *
     * + MySQL        : `IN`
     * + PostgreSQL   : `IN`
     * + SQLite       : `IN`
     */
    IN_ARRAY = "IN_ARRAY",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_in
     * + https://www.postgresql.org/docs/9.0/functions-subquery.html#AEN16806
     * + https://www.sqlite.org/lang_expr.html#in_op
     *
     * -----
     *
     * + MySQL        : `IN`
     * + PostgreSQL   : `IN`
     * + SQLite       : `IN`
     */
    IN_QUERY = "IN_QUERY",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#function_interval
     */
    //INTERVAL = "INTERVAL",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is
     * + https://www.postgresql.org/docs/9.0/functions-comparison.html
     * + https://www.sqlite.org/lang_expr.html#isisnot
     *
     * -----
     *
     * + MySQL        : `IS TRUE`
     * + PostgreSQL   : `IS TRUE`
     * + SQLite       : `<NULL_SAFE_EQUAL> TRUE`
     */
    IS_TRUE = "IS_TRUE",
    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is
     * + https://www.postgresql.org/docs/9.0/functions-comparison.html
     * + https://www.sqlite.org/lang_expr.html#isisnot
     *
     * -----
     *
     * + MySQL        : `IS FALSE`
     * + PostgreSQL   : `IS FALSE`
     * + SQLite       : `<NULL_SAFE_EQUAL> FALSE`
     */
    IS_FALSE = "IS_FALSE",
    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is
     * + https://www.postgresql.org/docs/9.0/functions-comparison.html
     * + https://www.sqlite.org/lang_expr.html#isisnot
     *
     * -----
     *
     * This does not refer to the TypeScript `unknown`.
     * It refers to the three-valued logic `unknown`.
     *
     * It generally has a value equivalent to `NULL`.
     *
     * -----
     *
     * + MySQL        : `IS UNKNOWN`
     * + PostgreSQL   : `IS UNKNOWN`
     * + SQLite       : `<NULL_SAFE_EQUAL> UNKNOWN`
     */
    IS_UNKNOWN = "IS_UNKNOWN",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is
     * + https://www.postgresql.org/docs/9.0/functions-comparison.html
     * + https://www.sqlite.org/lang_expr.html#isisnot
     *
     * -----
     *
     * + MySQL        : `IS NOT TRUE`
     * + PostgreSQL   : `IS NOT TRUE`
     * + SQLite       : `<NOT_NULL_SAFE_EQUAL> TRUE`
     */
    IS_NOT_TRUE = "IS_NOT_TRUE",
    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is
     * + https://www.postgresql.org/docs/9.0/functions-comparison.html
     * + https://www.sqlite.org/lang_expr.html#isisnot
     *
     * -----
     *
     * + MySQL        : `IS NOT FALSE`
     * + PostgreSQL   : `IS NOT FALSE`
     * + SQLite       : `<NOT_NULL_SAFE_EQUAL> FALSE`
     */
    IS_NOT_FALSE = "IS_NOT_FALSE",
    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is
     * + https://www.postgresql.org/docs/9.0/functions-comparison.html
     * + https://www.sqlite.org/lang_expr.html#isisnot
     *
     * -----
     *
     * This does not refer to the TypeScript `unknown`.
     * It refers to the three-valued logic `unknown`.
     *
     * It generally has a value equivalent to `NULL`.
     *
     * -----
     *
     * + MySQL        : `IS NOT UNKNOWN`
     * + PostgreSQL   : `IS NOT UNKNOWN`
     * + SQLite       : `<NOT_NULL_SAFE_EQUAL> UNKNOWN`
     */
    IS_NOT_UNKNOWN = "IS_NOT_UNKNOWN",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is-not-null
     * + https://www.postgresql.org/docs/9.0/functions-comparison.html
     * + https://www.sqlite.org/lang_expr.html#isisnot
     *
     * -----
     *
     * + MySQL        : `IS NOT NULL`
     * + PostgreSQL   : `IS NOT NULL`
     * + SQLite       : `<NOT_NULL_SAFE_EQUAL> NULL`
     */
    IS_NOT_NULL = "IS_NOT_NULL",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is-not-null
     * + https://www.postgresql.org/docs/9.0/functions-comparison.html
     * + https://www.sqlite.org/lang_expr.html#isisnot
     *
     * -----
     *
     * + MySQL        : `IS NULL`
     * + PostgreSQL   : `IS NULL`
     * + SQLite       : `<NULL_SAFE_EQUAL> NULL`
     */
    IS_NULL = "IS_NULL",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#function_isnull
     */
    //ISNULL = "ISNULL",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#function_least
     * + https://www.postgresql.org/docs/8.4/functions-conditional.html#AEN15322
     * + https://www.sqlite.org/lang_corefunc.html#minoreunc
     *
     * -----
     *
     * + MySQL        : `LEAST(x, y, ...)` //Requires 2 args
     * + PostgreSQL   : `LEAST(x, ...)`    //Requires 1 arg
     * + SQLite       : `MIN(x, ...)`         //Requires 1 arg
     */
    LEAST = "LEAST",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_less-than
     * + https://www.postgresql.org/docs/9.1/functions-comparison.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * -----
     *
     * + MySQL        : `<`
     * + PostgreSQL   : `<`
     * + SQLite       : `<`
     */
    LESS_THAN = "LESS_THAN",
    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_less-than
     * + https://www.postgresql.org/docs/9.1/functions-comparison.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * -----
     *
     * + MySQL        : `<=`
     * + PostgreSQL   : `<=`
     * + SQLite       : `<=`
     */
    LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",

    /*
     * + https://dev.mysql.com/doc/refman/8.0/en/string-comparison-functions.html#operator_like
     * + https://www.postgresql.org/docs/9.0/functions-matching.html#FUNCTIONS-LIKE
     * + https://www.sqlite.org/lang_expr.html#like
     *
     * -----
     *
     * + MySQL        : `LIKE`
     * + PostgreSQL   : `LIKE`
     * + SQLite       : `LIKE`
     */
    /*
     * The `LIKE` operator has different default escape behaviours across databases.
     * By default, SQLite does not have an escape character.
     * By default, MySQL's is the backslash.
     */
    //LIKE = "LIKE",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-comparison-functions.html#operator_like
     * + https://www.postgresql.org/docs/9.0/functions-matching.html#FUNCTIONS-LIKE
     * + https://www.sqlite.org/lang_expr.html#like
     *
     * -----
     *
     * + MySQL        : `LIKE ... ESCAPE ...`
     * + PostgreSQL   : `LIKE ... ESCAPE ...`
     * + SQLite       : `LIKE ... ESCAPE ...`
     */
    LIKE_ESCAPE = "LIKE_ESCAPE",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_not-between
     * + https://www.postgresql.org/docs/9.1/functions-comparison.html
     * + https://www.sqlite.org/lang_expr.html#between
     *
     * -----
     *
     * + MySQL        : `NOT BETWEEN ... AND ...`
     * + PostgreSQL   : `NOT BETWEEN ... AND ...`
     * + SQLite       : `NOT BETWEEN ... AND ...`
     */
    NOT_BETWEEN_AND = "NOT_BETWEEN_AND",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_not-equal
     * + https://www.postgresql.org/docs/9.1/functions-comparison.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * -----
     *
     * + MySQL        : `<>`
     * + PostgreSQL   : `<>`
     * + SQLite       : `<>`
     */
    NOT_EQUAL = "NOT_EQUAL",
    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_equal-to
     * + https://www.postgresql.org/docs/9.1/functions-comparison.html
     * + https://www.sqlite.org/lang_expr.html#isisnot
     *
     * -----
     *
     * + MySQL        : `<NOT> (x <NULL_SAFE_EQUAL>)`
     * + PostgreSQL   : `IS DISTINCT FROM`
     * + SQLite       : `IS NOT`
     */
    NOT_NULL_SAFE_EQUAL = "NOT_NULL_SAFE_EQUAL",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_not-in
     * + https://www.postgresql.org/docs/9.0/functions-subquery.html#AEN16831
     * + https://www.sqlite.org/lang_expr.html#in_op
     *
     * -----
     *
     * + MySQL        : `NOT IN`
     * + PostgreSQL   : `NOT IN`
     * + SQLite       : `NOT IN`
     */
    NOT_IN_ARRAY = "NOT_IN_ARRAY",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_not-in
     * + https://www.postgresql.org/docs/9.0/functions-subquery.html#AEN16831
     * + https://www.sqlite.org/lang_expr.html#in_op
     *
     * -----
     *
     * + MySQL        : `NOT IN`
     * + PostgreSQL   : `NOT IN`
     * + SQLite       : `NOT IN`
     */
    NOT_IN_QUERY = "NOT_IN_QUERY",

    /*
     * + https://dev.mysql.com/doc/refman/8.0/en/string-comparison-functions.html#operator_not-like
     * + https://www.postgresql.org/docs/9.0/functions-matching.html#FUNCTIONS-LIKE
     * + https://www.sqlite.org/lang_expr.html#like
     *
     * -----
     *
     * + MySQL        : `NOT LIKE`
     * + PostgreSQL   : `NOT LIKE`
     * + SQLite       : `NOT LIKE`
     */
    /*
     * The `LIKE` operator has different default escape behaviours across databases.
     * By default, SQLite does not have an escape character.
     * By default, MySQL's is the backslash.
     */
    //NOT_LIKE = "NOT_LIKE",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-comparison-functions.html#operator_not-like
     * + https://www.postgresql.org/docs/9.0/functions-matching.html#FUNCTIONS-LIKE
     * + https://www.sqlite.org/lang_expr.html#like
     *
     * -----
     *
     * + MySQL        : `NOT LIKE ... ESCAPE ...`
     * + PostgreSQL   : `NOT LIKE ... ESCAPE ...`
     * + SQLite       : `NOT LIKE ... ESCAPE ...`
     */
    NOT_LIKE_ESCAPE = "NOT_LIKE_ESCAPE",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/string-comparison-functions.html#function_strcmp
     */
    //STRCMP = "STRCMP",

    /*
        Logical Operators
        https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html
    */

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_and
     * + https://www.postgresql.org/docs/9.1/functions-logical.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * -----
     *
     * + MySQL        : `AND`
     * + PostgreSQL   : `AND`
     * + SQLite       : `AND`
     */
    AND = "AND",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_not
     * + https://www.postgresql.org/docs/9.1/functions-logical.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * -----
     *
     * + MySQL        : `NOT`
     * + PostgreSQL   : `NOT`
     * + SQLite       : `NOT`
     */
    NOT = "NOT",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_or
     * + https://www.postgresql.org/docs/9.1/functions-logical.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * -----
     *
     * + MySQL        : `OR`
     * + PostgreSQL   : `OR`
     * + SQLite       : `OR`
     */
    OR = "OR",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_xor
     *
     * -----
     *
     * + MySQL        : `XOR`
     * + PostgreSQL   : `<NOT_EQUAL>`
     * + SQLite       : `<NOT_EQUAL>`
     */
    XOR = "XOR",

    /*
        Control Flow Functions
        https://dev.mysql.com/doc/refman/8.0/en/control-flow-functions.html
    */
    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/control-flow-functions.html#operator_case
     * + https://www.postgresql.org/docs/8.4/functions-conditional.html#AEN15225
     * + https://www.sqlite.org/lang_expr.html#case
     *
     * -----
     *
     * + MySQL        : `CASE value WHEN compare_value THEN result [WHEN compare_value THEN result ...] ELSE result END`
     * + PostgreSQL   : `CASE value WHEN compare_value THEN result [WHEN compare_value THEN result ...] ELSE result END`
     * + SQLite       : `CASE value WHEN compare_value THEN result [WHEN compare_value THEN result ...] ELSE result END`
     */
    /**
     * This is handled using `CaseValueNode`
     */
    //CASE = "CASE",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/control-flow-functions.html#operator_case
     * + https://www.postgresql.org/docs/8.4/functions-conditional.html#AEN15225
     * + https://www.sqlite.org/lang_expr.html#case
     *
     * -----
     *
     * + MySQL        : `CASE WHEN condition THEN result [WHEN condition THEN result ...] ELSE result END`
     * + PostgreSQL   : `CASE WHEN condition THEN result [WHEN condition THEN result ...] ELSE result END`
     * + SQLite       : `CASE WHEN condition THEN result [WHEN condition THEN result ...] ELSE result END`
     */
    /**
     * This is handled using `CaseConditionNode`
     */
    //CASE_WHEN = "CASE_WHEN",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/control-flow-functions.html#function_if
     *
     * -----
     *
     * + MySQL        : `IF(x, y, z)`
     * + PostgreSQL   : `CASE WHEN x THEN y ELSE z END`
     * + SQLite       : `CASE WHEN x THEN y ELSE z END`
     */
    IF = "IF",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/control-flow-functions.html#function_ifnull
     * + https://www.postgresql.org/docs/9.2/functions-conditional.html#FUNCTIONS-COALESCE-NVL-IFNULL
     * + https://www.sqlite.org/lang_corefunc.html#ifnull
     *
     * `COALESCE()` is part of the SQL standard.
     * `IFNULL()` is DB-specific.
     *
     * But `IFNULL()` should behave the same as `COALESCE(x, y)`.
     *
     * -----
     *
     * + MySQL        : `IFNULL(x, y)`
     * + PostgreSQL   : `COALESCE(x, y)`
     * + SQLite       : `IFNULL(x, y)`
     */
    IF_NULL = "IF_NULL",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/control-flow-functions.html#function_nullif
     * + https://www.postgresql.org/docs/9.2/functions-conditional.html#FUNCTIONS-NULLIF
     * + https://www.sqlite.org/lang_corefunc.html#nullif
     *
     * -----
     *
     * + MySQL        : `NULLIF(x, y)`
     * + PostgreSQL   : `NULLIF(x, y)`
     * + SQLite       : `NULLIF(x, y)`
     *
     * -----
     *
     * This is the same as `CASE WHEN expr1 = expr2 THEN NULL ELSE expr1 END`
     */
    NULL_IF_EQUAL = "NULL_IF_EQUAL",

    /*
        String Functions and Operators
        https://dev.mysql.com/doc/refman/8.0/en/string-functions.html
    */

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_ascii
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     *
     * -----
     *
     * + MySQL          : `ASCII(x)`
     * + PostgreSQL     : `ASCII(x)`
     * + SQLite         : None, implement with `x.length == 0 ? 0 : x.charCodeAt(0)`
     */
    ASCII = "ASCII",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_bin
     *
     * -----
     *
     * + MySQL          : `BIN(x)`
     * + PostgreSQL     : None. Implement with,
     * ```sql
     *  REGEXP_REPLACE(
     *      (x)::bit(64)::varchar(64),
     *      '^0+(\d+)$',
     *      '\1'
     *  )
     * ```
     * + SQLite         : None. Implement with,
     * ```ts
     * //x >= 0
     * (x).toString(2)
     * //x < 0
     * (2n**64n + BigInt(x)).toString(2)
     * ```
     */
    BIN = "BIN",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_bit-length
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-SQL
     *
     * -----
     *
     * + MySQL          : `BIT_LENGTH(x)`
     * + PostgreSQL     : `BIT_LENGTH(x)`
     * + SQLite         : `LENGTH(CAST(x AS BLOB)) * 8`
     */
    BIT_LENGTH = "BIT_LENGTH",

    /*
     * Appears to be MySQL and SQLite-specific,
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_char
     * + https://www.sqlite.org/lang_corefunc.html#char
     *
     * They have different implementations, however.
     */
    //CHAR = "CHAR",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_char-length
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-SQL
     * + https://www.sqlite.org/lang_corefunc.html#length
     * + https://dmitripavlutin.com/what-every-javascript-developer-should-know-about-unicode/#33-string-length
     *
     * -----
     *
     * + MySQL          : `CHAR_LENGTH(x)`
     *   + `CHAR_LENGTH('cafȩ́')` returns 6
     * + PostgreSQL     : `CHAR_LENGTH(x)`
     *   + `CHAR_LENGTH('cafȩ́')` returns 8
     * + SQLite         : `LENGTH(x)`
     *   + `LENGTH('cafȩ́')` returns 6
     */
    CHAR_LENGTH = "CHAR_LENGTH",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_concat
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     *
     * -----
     *
     * + MySQL          : `CONCAT(x, ...)` Returns `NULL` if any argument is `NULL`
     *   + MySQL actually treats `||` as the boolean `OR` operator.
     * + PostgreSQL     : `x || ... || ...` Returns `NULL` if any argument is `NULL`
     *   + PostgreSQL's `CONCAT(x, ...)` Ignores `NULL` arguments
     *     + This is different from MySQL's `CONCAT()`
     * + SQLite         : `x || ... || ...` Returns `NULL` if any argument is `NULL`
     *   + SQLite uses an operator, not a function, to concatenate strings
     *   + https://www.sqlite.org/lang_expr.html#collateop
     *
     * -----
     *
     * The SQL standard says,
     * > `<concatenation operator>` is an operator, `||`,
     * > that returns the character string made by joining its character string operands in the order given.
     *
     * MySQL actually treats `||` as the boolean `OR` operator.
     */
    CONCAT = "CONCAT",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_concat
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     *
     * -----
     *
     * + MySQL          : None. Emulate with `CONCAT(COALESCE(x, ''), ...)`
     * + PostgreSQL     : `CONCAT(x, ...)`
     *   + PostgreSQL's `CONCAT(x, ...)` Ignores `NULL` arguments
     *     + This is different from MySQL's `CONCAT()`
     * + SQLite         : `COALESCE(x, '') || ... || ...`
     *
     * -----
     *
     * The SQL standard says,
     * > `<concatenation operator>` is an operator, `||`,
     * > that returns the character string made by joining its character string operands in the order given.
     *
     * MySQL actually treats `||` as the boolean `OR` operator.
     */
    NULL_SAFE_CONCAT = "NULL_SAFE_CONCAT",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_concat-ws
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     *
     * -----
     *
     * + MySQL          : `CONCAT_WS(separator, x, ...)`
     *   + If the separator is `NULL`, the result is `NULL`
     *   + Ignores `NULL` arguments after the separator
     * + PostgreSQL     : `CONCAT_WS(separator, x, ...)`
     *   + If the separator is `NULL`, the result is `NULL`
     *   + Ignores `NULL` arguments after the separator
     * + SQLite         : None. Implement with user-defined function.
     */
    CONCAT_WS = "CONCAT_WS",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_elt
     */
    //ELT = "ELT",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_export-set
     */
    //EXPORT_SET = "EXPORT_SET",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_field
     */
    //FIELD = "FIELD",

    /**
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_find-in-set
     *
     * ```sql
     * FIND_IN_SET(str, strlist)
     * ```
     *
     * There is a way to emulate it with PostgreSQL,
     * https://stackoverflow.com/questions/35169412/mysql-find-in-set-equivalent-to-postgresql
     *
     * ```sql
     *  array_position(
     *      string_to_array(strlist, ','),
     *      str
     *  )
     * ```
     */
    //FIND_IN_SET = "FIND_IN_SET",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_from-base64
     * + https://www.postgresql.org/docs/7.4/functions-string.html#FUNCTIONS-STRING-OTHER
     *
     * -----
     *
     * + MySQL          : `FROM_BASE64(x)`
     *   + `FROM_BASE64('~')` === `NULL`
     * + PostgreSQL     : `DECODE(x, 'base64')`
     *   + `DECODE('~', 'base64')` throws an error
     * + SQLite         : None, implement with user-defined function `atob()`
     *   + `atob('~')` throws an error
     */
    FROM_BASE64 = "FROM_BASE64",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_hex
     * + https://www.postgresql.org/docs/7.4/functions-string.html#FUNCTIONS-STRING-OTHER
     * + https://www.sqlite.org/lang_corefunc.html#hex
     *
     * -----
     *
     * + MySQL          : `HEX(x)`
     * + PostgreSQL     : `ENCODE(x, 'hex')`
     * + SQLite         : `HEX(x)`
     */
    HEX = "HEX",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_insert
     */
    //INSERT = "INSERT",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_instr
     * + https://www.sqlite.org/lang_corefunc.html#instr
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     *
     * -----
     *
     * + MySQL          : `INSTR(str, substr)`
     * + PostgreSQL     : `STRPOS(str, substr)`
     * + SQLite         : `INSTR(str, substr)`
     */
    IN_STR = "IN_STR",

    /*
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_left
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     *
     * -----
     *
     * The MySQL and PostgreSQL implementations are incompatible for negative numbers.
     */
    //LEFT = "LEFT",

    /*
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_length
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     * + https://www.sqlite.org/lang_corefunc.html#length
     *
     * -----
     *
     * + MySQL          : `LENGTH(x)`
     * + PostgreSQL     : `LENGTH(x)`
     * + SQLite         : None. The `LENGTH(x)` implementation is incompatible.
     *
     * -----
     *
     * ```sql
     *  SELECT
     *      -- '\u00c7'
     *      LENGTH('Ç') AS one_length,
     *      CHAR_LENGTH('Ç') AS one_char_length,
     *      -- '\u0043\u0327'
     *      LENGTH('Ç') AS two_length,
     *      CHAR_LENGTH('Ç') AS two_char_length
     * ```
     *
     * MySQL        : `2,1,3,2`
     * PostgreSQL   : `2,2,3,3`
     * SQLite       : `1,X,2,X` (`X` because SQLite does not have `CHAR_LENGTH()`)
     *
     * |                            | MySQL `LENGTH()` | MySQL `CHAR_LENGTH()` | PostgreSQL `LENGTH()` | PostgreSQL `CHAR_LENGTH()` | SQLite `LENGTH()` |
     * |----------------------------|------------------|-----------------------|-----------------------|----------------------------|-------------------|
     * | MySQL      `LENGTH()`      | X                |                       | X                     | X                          |                   |
     * | MySQL      `CHAR_LENGTH()` |                  | X                     |                       |                            | X                 |
     * | PostgreSQL `LENGTH()`      | X                |                       | X                     | X                          |                   |
     * | PostgreSQL `CHAR_LENGTH()` | X                |                       | X                     | X                          |                   |
     * | SQLite     `LENGTH()`      |                  | X                     |                       |                            | X                 |
     *
     * https://news.ycombinator.com/item?id=17311196
     *
     * + https://www.db-fiddle.com/f/aaKrWx7aAuzzC2HWPcrsBn/3
     * + https://www.db-fiddle.com/f/aaKrWx7aAuzzC2HWPcrsBn/4
     *
     * -----
     *
     * TL;DR,
     * We cannot provide `LENGTH` as a DB-unified operator because of the inconsistencies
     *
     * -----
     *
     * See, `OCTET_LENGTH` instead.
     * All three databases can be made to agree on the behaviour of `OCTET_LENGTH`
     */
    //LENGTH = "LENGTH",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_load-file
     */
    //LOAD_FILE = "LOAD_FILE",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_locate
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     *
     * -----
     *
     * + MySQL          : `LOCATE(substr, str)/LOCATE(substr, str, pos)`
     * + PostgreSQL     : `STRPOS(str, substr)`, the 3-arg version is more complicated.
     *
     *   Tentatively, `STRPOS(SUBSTR(str, pos), substr) + pos` or something like that.
     *
     * + SQLite         : None. Implement with user-defined function.
     * @todo
     */
    //LOCATE = "LOCATE",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_lower
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-SQL
     * + https://www.sqlite.org/lang_corefunc.html#lower
     *
     * -----
     *
     * + MySQL          : `LOWER(x)`
     * + PostgreSQL     : `LOWER(x)`
     * + SQLite         : `LOWER(x)`
     */
    LOWER = "LOWER",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_lpad
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     *
     * -----
     *
     * + MySQL          : `LPAD(str, len, padstr)`
     *   + `LPAD('123', 4, '98')` === `'9123'`
     * + PostgreSQL     : `LPAD(str, len, padstr)`
     *   + `LPAD('123', 4, '98')` === `'9123'`
     * + SQLite         : None. Implement with user-defined function.
     */
    LPAD = "LPAD",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_ltrim
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     * + https://www.sqlite.org/lang_corefunc.html#ltrim
     *
     * -----
     *
     * + MySQL          : `LTRIM(x)`
     * + PostgreSQL     : `LTRIM(x)/LTRIM(x, y)`
     * + SQLite         : `LTRIM(x)/LTRIM(x, y)`
     */
    LTRIM = "LTRIM",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_make-set
     */
    //MAKE_SET = "MAKE_SET",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_oct
     */
    //OCT = "OCT",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_octet-length
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-SQL
     *
     * -----
     *
     * + MySQL          : `OCTET_LENGTH(x)`
     * + PostgreSQL     : `OCTET_LENGTH(x)`
     * + SQLite         : None. Implement with `(new Blob([x])).size`
     *   + https://stackoverflow.com/questions/2219526/how-many-bytes-in-a-javascript-string/29955838
     *   + In `node`, `Buffer.from(x).length`
     */
    OCTET_LENGTH = "OCTET_LENGTH",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_ord
     */
    //ORD = "ORD",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_position
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-SQL
     *
     * -----
     *
     * + MySQL          : `POSITION(substr IN str)`
     * + PostgreSQL     : `POSITION(substr IN str)`
     * + SQLite         : None. Implement with user-defined function.
     */
    POSITION = "POSITION",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_quote
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     * + https://www.sqlite.org/lang_corefunc.html#quote
     *
     * -----
     *
     * + MySQL          : `QUOTE(x)`
     * + PostgreSQL     : `QUOTE_NULLABLE(x)`
     * + SQLite         : `QUOTE(x)`
     */
    QUOTE = "QUOTE",

    /*
     * + https://dev.mysql.com/doc/refman/8.0/en/regexp.html#operator_regexp
     *   + https://dev.mysql.com/doc/refman/8.0/en/regexp.html#operator_regexp
     *   + https://dev.mysql.com/doc/refman/8.0/en/regexp.html#function_regexp-like
     *   + https://dev.mysql.com/doc/refman/8.0/en/regexp.html#regexp-syntax
     *   + http://userguide.icu-project.org/strings/regexp
     * + `~`/`~*`/`!~`/`!~*`
     *   + https://www.postgresql.org/docs/9.0/functions-matching.html#FUNCTIONS-POSIX-REGEXP
     * + TODO: Find out difference between POSIX regex and ICU regex
     */
    //REGEXP = "REGEXP",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_repeat
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     *
     * -----
     *
     * + MySQL          : `REPEAT(x, count)`
     * + PostgreSQL     : `REPEAT(x, count)`
     * + SQLite         : None. Implement with user-defined function.
     */
    REPEAT = "REPEAT",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_replace
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     * + https://www.sqlite.org/lang_corefunc.html#replace
     *
     * -----
     *
     * + MySQL          : `REPLACE(str, from, to)`
     * + PostgreSQL     : `REPLACE(str, from, to)`
     * + SQLite         : `REPLACE(str, from, to)`
     */
    REPLACE = "REPLACE",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_reverse
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     *
     * -----
     *
     * + MySQL          : `REVERSE(x)`
     * + PostgreSQL     : `REVERSE(x)`
     * + SQLite         : None. Implement with user-defined function.
     */
    REVERSE = "REVERSE",

    /*
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_right
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     *
     * -----
     *
     * The MySQL and PostgreSQL implementations are incompatible for negative numbers.
     */
    //RIGHT = "RIGHT",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_rpad
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     *
     * -----
     *
     * + MySQL          : `RPAD(str, len, padstr)`
     * + PostgreSQL     : `RPAD(str, len, padstr)`
     * + SQLite         : None. Implement with user-defined function.
     */
    RPAD = "RPAD",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_rtrim
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     * + https://www.sqlite.org/lang_corefunc.html#rtrim
     *
     * -----
     *
     * + MySQL          : `RTRIM(x)`
     * + PostgreSQL     : `RTRIM(x)/RTRIM(x, y)`
     * + SQLite         : `RTRIM(x)/RTRIM(x, y)`
     */
    RTRIM = "RTRIM",

    /*
     * Appears to be PostgreSQL-specific,
     * https://www.postgresql.org/docs/9.0/functions-matching.html#FUNCTIONS-SIMILARTO-REGEXP
     */
    //SIMILAR_TO = "SIMILAR_TO",

    /*
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_soundex
     * + https://www.sqlite.org/lang_corefunc.html#soundex
     * + https://www.postgresql.org/docs/9.1/fuzzystrmatch.html
     *
     * -----
     *
     * + MySQL          : `SOUNDEX(x)`
     * + PostgreSQL     : `SOUNDEX(x)`
     * + SQLite         : `SOUNDEX(x)`
     */
    //SOUNDEX = "SOUNDEX",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#operator_sounds-like
     */
    //SOUNDS_LIKE = "SOUNDS_LIKE",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_space
     *
     * -----
     *
     * `SPACE(n)` is the same as `REPEAT(' ', n)`
     */
    //SPACE = "SPACE",

    /*
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_substr
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     * + https://www.sqlite.org/lang_corefunc.html#substr
     *
     * -----
     *
     * + MySQL          : `SUBSTR(str, pos)/SUBSTR(str, pos, len)`
     *   + `SUBSTR('hello', -1)` === `'o'`
     *   + `SUBSTR('hello', -1, -2)` === `''`
     *   + `SUBSTR('hello', -2, 2)` === `'lo'`
     * + PostgreSQL     : `SUBSTR(str, pos)/SUBSTR(str, pos, len)`
     *   + `SUBSTR('hello', -1)` === `'hello'`
     *   + `SUBSTR('hello', -1, -2)` throws an error
     *   + `SUBSTR('hello', -2, 2)` === `''`
     * + SQLite         : `SUBSTR(str, pos)/SUBSTR(str, pos, len)`
     *   + `SUBSTR('hello', -1)` === `'o'`
     *   + `SUBSTR('hello', -1, -2)` === `'ll'`
     *   + `SUBSTR('hello', -2, 2)` === `'lo'`
     *
     * -----
     *
     * Behaviour varies too much.
     */
    //SUBSTR = "SUBSTR",

    /*
     * Appears to be MySQl-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_substring-index
     */
    //SUBSTRING_INDEX = "SUBSTRING_INDEX",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_to-base64
     * + https://www.postgresql.org/docs/7.4/functions-string.html#FUNCTIONS-STRING-OTHER
     *
     * -----
     *
     * + MySQL          : `TO_BASE64(x)`
     * + PostgreSQL     : `ENCODE(x, 'base64')`
     * + SQLite         : None, implement with user-defined function `btoa()`
     */
    TO_BASE64 = "TO_BASE64",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_trim
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-OTHER
     * + https://www.sqlite.org/lang_corefunc.html#trim
     *
     * -----
     *
     * + MySQL          : `TRIM(x)`
     * + PostgreSQL     : `TRIM(x)`
     * + SQLite         : `TRIM(x)`
     */
    TRIM = "TRIM",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_unhex
     * + https://www.postgresql.org/docs/7.4/functions-string.html#FUNCTIONS-STRING-OTHER
     *
     * -----
     *
     * + MySQL          : `UNHEX(x)`
     *   + `UNHEX('~')` === `NULL`
     * + PostgreSQL     : `DECODE(x, 'hex')`
     *   + `DECODE('~', 'hex')` throws an error
     * + SQLite         : None. Implement with user-defined function.
     */
    UNHEX = "UNHEX",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_upper
     * + https://www.postgresql.org/docs/9.4/functions-string.html#FUNCTIONS-STRING-SQL
     * + https://www.sqlite.org/lang_corefunc.html#upper
     *
     * -----
     *
     * + MySQL          : `UPPER(x)`
     * + PostgreSQL     : `UPPER(x)`
     * + SQLite         : `UPPER(x)`
     */
    UPPER = "UPPER",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_weight-string
     */
    //WEIGHT_STIRNG = "WEIGHT_STIRNG",

    /*
        Arithmetic Operators
        https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html
    */
    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html#operator_div
     * + https://www.postgresql.org/docs/9.0/functions-math.html
     * + https://www.postgresql.org/docs/current/sql-expressions.html#SQL-SYNTAX-TYPE-CASTS
     *
     * -----
     *
     * Interestingly enough,
     * MySQL uses `SIGNED` and `UNSIGNED` for integer type names when casting.
     * PostgreSQL uses `INTEGER`
     *
     * -----
     *
     * + MySQL        : `DIV`
     * + PostgreSQL   : `/` (Maybe `CAST(CAST(x AS DECIMAL)  / CAST(y AS DECIMAL) AS INTEGER)`)
     * + SQLite       : `CAST(x / y AS INTEGER)`
     */
    INTEGER_DIVISION = "INTEGER_DIVISION",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html#operator_divide
     * + https://www.postgresql.org/docs/9.0/functions-math.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * -----
     *
     * + MySQL        : `/`
     * + PostgreSQL   : `/`
     * + SQLite       : `/`
     */
    FRACTIONAL_DIVISION = "FRACTIONAL_DIVISION",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html#operator_minus
     *
     * -----
     *
     * + MySQL        : `-`
     * + PostgreSQL   : `-`
     * + SQLite       : `-`
     */
    SUBTRACTION = "SUBTRACTION",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html#operator_mod
     * + https://www.postgresql.org/docs/9.0/functions-math.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * @todo Find out if they behave the same
     *
     * + MySQL        : `%`
     *   + `1%0` === `NULL`
     * + PostgreSQL   : `mod(x, y)` (The `%` operator does not handle negative values)
     *   + `mod(1, 0)` throws error
     * + SQLite       : `%`
     *   + `1%0` === `NULL`
     */
    INTEGER_REMAINDER = "INTEGER_REMAINDER",

    /*
     * + https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html#operator_mod
     * + https://www.postgresql.org/docs/9.0/functions-math.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * + MySQL        : `%`
     * + PostgreSQL   : Not supported
     * + SQLite       : Not supported
     */
    //FRACTIONAL_REMAINDER = "FRACTIONAL_REMAINDER",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html#operator_plus
     *
     * -----
     *
     * + MySQL        : `+`
     * + PostgreSQL   : `+`
     * + SQLite       : `+`
     */
    ADDITION = "ADDITION",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html#operator_times
     *
     * -----
     *
     * + MySQL        : `*`
     * + PostgreSQL   : `*`
     * + SQLite       : `*`
     */
    MULTIPLICATION = "MULTIPLICATION",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html#operator_unary-minus
     *
     * -----
     *
     * + MySQL        : `-`
     * + PostgreSQL   : `-`
     * + SQLite       : `-`
     */
    UNARY_MINUS = "UNARY_MINUS",

    /*
        Mathematical Functions
        https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html
    */
    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_abs
     * + https://www.postgresql.org/docs/9.0/functions-math.html
     * + https://www.sqlite.org/lang_corefunc.html#abs
     *
     * -----
     *
     * + MySQL        : `ABS(x)`
     * + PostgreSQL   : `@` or `ABS(x)` (Let's not use the ugly `@` operator)
     * + SQLite       : `ABS(x)`
     */
    ABSOLUTE_VALUE = "ABSOLUTE_VALUE",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_acos
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-TRIG-TABLE
     *
     * -----
     *
     * + MySQL          : `ACOS(x)`
     * + PostgreSQL     : `ACOS(x)`
     * + SQLite         : None, implement with user-defined function
     */
    ARC_COSINE = "ARC_COSINE",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_asin
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-TRIG-TABLE
     *
     * -----
     *
     * + MySQL          : `ASIN(x)`
     * + PostgreSQL     : `ASIN(x)`
     * + SQLite         : None, implement with user-defined function
     */
    ARC_SINE = "ARC_SINE",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_atan
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-TRIG-TABLE
     *
     * -----
     *
     * + MySQL          : `ATAN(x)`
     * + PostgreSQL     : `ATAN(x)`
     * + SQLite         : None, implement with user-defined function
     */
    ARC_TANGENT = "ARC_TANGENT",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_atan2
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-TRIG-TABLE
     *
     * -----
     *
     * + MySQL          : `ATAN2(y, x)`
     * + PostgreSQL     : `ATAN2(y, x)`
     * + SQLite         : None, implement with user-defined function
     */
    ARC_TANGENT_2 = "ARC_TANGENT_2",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_ceil
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
     *
     * -----
     *
     * + MySQL        : `CEIL(x)/CEILING(x)`
     * + PostgreSQL   : `CEIL(x)/CEILING(x)`
     * + SQLite       : None, use the following instead,
     *   + https://stackoverflow.com/questions/14969067/getting-the-ceil-value-of-a-number-in-sqlite
     * ```sql
     *  (
     *      CASE
     *          WHEN x = CAST(x AS INT) THEN
     *              CAST(x AS INT)
     *          ELSE
     *              1 + CAST(x AS INT)
     *      END
     *  )
     * ```
     *
     */
    CEILING = "CEILING",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_conv
     */
    //CONV = "CONV"

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_cos
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-TRIG-TABLE
     *
     * -----
     *
     * + MySQL          : `COS(x)`
     * + PostgreSQL     : `COS(x)`
     * + SQLite         : None, implement with user-defined function
     */
    COSINE = "COSINE",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_cot
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-TRIG-TABLE
     *
     * -----
     *
     * + MySQL          : `COT(x)`
     * + PostgreSQL     : `COT(x)`
     * + SQLite         : None, implement with user-defined function
     */
    COTANGENT = "COTANGENT",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_crc32
     */
    //CRC32 = "CRC32",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_degrees
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
     *
     * -----
     *
     * + MySQL          : `DEGREES(x)`
     * + PostgreSQL     : `DEGREES(x)`
     * + SQLite         : None, use `x * (180.0/3.1415926535897932384626433832795028841971693993751)`
     */
    DEGREES = "DEGREES",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_exp
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
     *
     * -----
     *
     * + MySQL          : `EXP(x)`
     * + PostgreSQL     : `EXP(x)`
     * + SQLite         : None, implement with user-defined function
     */
    NATURAL_EXPONENTIATION = "NATURAL_EXPONENTIATION",

    /*
     * Appears to be PostgreSQL-specific,
     * + Factorial; `x !` / `!! x`
     * + https://www.postgresql.org/docs/8.2/functions-math.html
     */
    //FACTORIAL = "FACTORIAL",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_floor
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
     *
     * -----
     *
     * + MySQL        : `FLOOR(x)`
     * + PostgreSQL   : `FLOOR(x)`
     * + SQLite       : None, use the following instead,
     *   + https://stackoverflow.com/questions/7129249/getting-the-floor-value-of-a-number-in-sqlite
     * ```sql
     *  (
     *      CASE
     *          WHEN x >= 0 THEN
     *              CAST(x AS INT)
     *          WHEN x = CAST(x AS INT) THEN
     *              CAST(x AS INT)
     *          ELSE
     *              CAST(x - 1.0 AS INT)
     *      END
     *  )
     * ```
     */
    FLOOR = "FLOOR",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_format
     */
    //FORMAT = "FORMAT",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_ln
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
     *
     * -----
     *
     * + MySQL          : `LN(x)`
     * + PostgreSQL     : `LN(x)`
     * + SQLite         : None, implment with user-defined function
     */
    LN = "LN",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_log
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
     *
     * -----
     *
     * + MySQL          : `LOG(base, x)`
     * + PostgreSQL     : `LOG(base, x)`
     * + SQLite         : None, implment with user-defined function
     */
    LOG = "LOG",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_log2
     *
     * -----
     *
     * + MySQL          : `LOG2(x)`
     * + PostgreSQL     : `LOG(2.0, x)`
     * + SQLite         : None, implment with user-defined function
     */
    LOG2 = "LOG2",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_log10
     *
     * -----
     *
     * + MySQL          : `LOG10(x)`
     * + PostgreSQL     : `LOG(10.0, x)`
     * + SQLite         : None, implment with user-defined function
     */
    LOG10 = "LOG10",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_pi
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
     *
     * -----
     *
     * + MySQL          : `PI()` Returns `3.141592653589793`
     * + PostgreSQL     : `PI()` Returns `3.14159265358979`
     * + SQLite         : None, implement using `3.141592653589793`
     *
     * -----
     *
     * In JS, `Math.PI` is `3.141592653589793`
     */
    PI = "PI",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_power
     * + https://www.postgresql.org/docs/9.0/functions-math.html
     * + https://stackoverflow.com/questions/13190064/how-to-find-power-of-a-number-in-sqlite
     *
     * + MySQL        : `POWER(x, y)`
     * + PostgreSQL   : `^` or `POWER(x, y)` (Let's not use the ugly `^` operator)
     * + SQLite       : Requres creating a `POWER(x, y)` user-defined function
     */
    POWER = "POWER",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_radians
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
     *
     * -----
     *
     * + MySQL          : `RADIANS(x)`
     * + PostgreSQL     : `RADIANS(x)`
     * + SQLite         : None, use `x * (3.1415926535897932384626433832795028841971693993751/180.0)`
     */
    RADIANS = "RADIANS",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_rand
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-RANDOM-TABLE
     * + https://www.sqlite.org/lang_corefunc.html#random
     *
     * -----
     *
     * + MySQL          : `RAND()`      Returns `0.0 <= v < 1.0`
     * + PostgreSQL     : `RANDOM()`    Returns `0.0 <= v < 1.0`
     * + SQLite         : Incompatible.
     *
     *   SQLite's `RANDOM()` function returns a value between `-9223372036854775808` and `+9223372036854775807`.
     *
     *   Therefore, one should use, `ABS(RANDOM()) / 9223372036854775808`
     */
    RANDOM = "RANDOM",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_round
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
     * + https://www.sqlite.org/lang_corefunc.html#round
     *
     * -----
     *
     * + MySQL          : `ROUND(x)` or `ROUND(x, y)`
     * + PostgreSQL     : `ROUND(x)` or `ROUND(x, y)`
     * + SQLite         : `ROUND(x)` or `ROUND(x, y)`
     */
    ROUND = "ROUND",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_sign
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE
     *
     * -----
     *
     * + MySQL          : `SIGN(x)`
     * + PostgreSQL     : `SIGN(x)`
     * + SQLite         : `CASE WHEN x > 0 THEN 1 WHEN x < 0 THEN -1 ELSE 0 END`
     */
    SIGN = "SIGN",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_sin
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-TRIG-TABLE
     *
     * -----
     *
     * + MySQL          : `SIN(x)`
     * + PostgreSQL     : `SIN(x)`
     * + SQLite         : None, implement with user-defined function
     */
    SINE = "SINE",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_sqrt
     * + https://www.postgresql.org/docs/9.0/functions-math.html
     * + https://stackoverflow.com/questions/13190064/how-to-find-power-of-a-number-in-sqlite
     *
     * -----
     *
     * + MySQL        : `SQRT(x)`
     * + PostgreSQL   : `|/` or `SQRT(x)` (Lets not use the ugly `|/` operator)
     * + SQLite       : Requres creating a `SQRT(x)` user-defined function
     */
    SQUARE_ROOT = "SQUARE_ROOT",

    /**
     * + https://www.postgresql.org/docs/9.0/functions-math.html
     * + https://stackoverflow.com/questions/13190064/how-to-find-power-of-a-number-in-sqlite
     *
     * -----
     *
     * + MySQL        : `POWER(x, 1.0/3.0)` The `.0` parts are important!
     * + PostgreSQL   : `||/` or `CBRT(x)` (Lets not use the ugly `||/` operator)
     * + SQLite       : Requres creating a `CBRT(x)` user-defined function
     *
     * -----
     *
     * MySQL
     * ```sql
     * SELECT POWER(27, 1.0/3.0)
     * > 3
     * ```
     *
     * PostgreSQL
     * ```sql
     * SELECT POWER(27, 1.0/3.0)
     * > 2.99999999999999999997
     * ```
     */
    CUBE_ROOT = "CUBE_ROOT",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_tan
     * + https://www.postgresql.org/docs/9.1/functions-math.html#FUNCTIONS-MATH-TRIG-TABLE
     *
     * -----
     *
     * + MySQL          : `TAN(x)`
     * + PostgreSQL     : `TAN(x)`
     * + SQLite         : None, implement with user-defined function
     */
    TANGENT = "TANGENT",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_truncate
     * + https://www.postgresql.org/docs/9.0/functions-math.html
     *
     * -----
     *
     * + MySQL          : `TRUNCATE(x, d)`
     * + PostgreSQL     : `TRUNC(x, d)`
     * + SQLite         : None, implement with `Math.floor(x * Math.pow(10, d)) / Math.pow(10, d)`
     */
    TRUNCATE = "TRUNCATE",

    /*
        Date and Time Functions
        https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html
    */

    /**
     * @todo
     */

    /*
     * + MySQL          :
     * ```sql
     *  SELECT
     *      adddate(date('2010-01-01'), interval 1 hour),
     *      adddate(date('2010-01-01'), interval 1 day);
     *  > 2010-01-01 01:00:00
     *  > 2010-01-02
     * ```
     * + PostgreSQL     :
     * ```sql
     *  SET TIME ZONE 'EST';
     *  SELECT
     *      date '2010-01-01' + interval '1 hour',
     *      date '2010-01-01' + interval '1 day',
     *      time '10:23:45.123' + interval '1 hour',
     *      time '10:23:45.123' + interval '1 day'
     *  > 2010-01-01T01:00:00.000Z
     *  > 2010-01-02T00:00:00.000Z
     *  > 11:23:45.123
     *  > 10:23:45.123
     * ```
     */
    //ADDDATE = "ADDDATE",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_addtime
     *
     * It has... Weird behaviour.
     */
    //ADDTIME = "ADDTIME",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_current-date
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `CURRENT_DATE()`
     * + PostgreSQL     : `CURRENT_DATE()`
     * + SQLite         : `strftime('%Y-%m-%d', 'now')`
     */
    CURRENT_DATE = "CURRENT_DATE",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_current-date
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `CURRENT_TIME(0)`
     * + PostgreSQL     : `CURRENT_TIME(0)`
     * + SQLite         : `strftime('%H:%M:%S', 'now')`
     */
    CURRENT_TIME_0 = "CURRENT_TIME_0",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_current-date
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `CURRENT_TIME(1)`
     * + PostgreSQL     : `CURRENT_TIME(1)`
     * + SQLite         : `substr(strftime('%H:%M:%f', 'now'), 1, 10)`
     */
    CURRENT_TIME_1 = "CURRENT_TIME_1",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_current-date
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `CURRENT_TIME(2)`
     * + PostgreSQL     : `CURRENT_TIME(2)`
     * + SQLite         : `substr(strftime('%H:%M:%f', 'now'), 1, 11)`
     */
    CURRENT_TIME_2 = "CURRENT_TIME_2",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_current-date
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `CURRENT_TIME(3)`
     * + PostgreSQL     : `CURRENT_TIME(3)`
     * + SQLite         : `strftime('%H:%M:%f', 'now')`
     */
    CURRENT_TIME_3 = "CURRENT_TIME_3",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_current-timestamp
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `CURRENT_TIMESTAMP(0)`
     * ```sql
     *  SET @@session.time_zone = 'EST';
     *  SELECT
     *      CURRENT_TIMESTAMP(0),
     *      FLOOR(UNIX_TIMESTAMP(CURRENT_TIMESTAMP(0))),
     *      UNIX_TIMESTAMP()
     *  > 2019-09-07 19:55:03
     *  > 1567900503
     *  > 1567900503
     * ```
     * + PostgreSQL     : `CURRENT_TIMESTAMP(0)`
     *   + http://www.postgresqltutorial.com/postgresql-localtimestamp/
     *
     *   > The `LOCALTIMESTAMP` function returns a `TIMESTAMP` value **without** time zone while
     *   > the `CURRENT_TIMESTAMP` function returns a `TIMESTAMP` **with** time zone.
     * ```sql
     *  SET TIME ZONE 'EST';
     *  SELECT
     *      CURRENT_TIMESTAMP(0),
     *      FLOOR(EXTRACT(
     *          EPOCH FROM CURRENT_TIMESTAMP(0)
     *      ))
     *  > 2019-09-07T23:58:20.000Z
     *  > 1567900700
     * ```
     * + SQLite         : `strftime('%Y-%m-%d %H:%M:%S', 'now')` gives precision `0`
     * ```sql
     *  SELECT
     *      strftime('%Y-%m-%d %H:%M:%S', 'now'),
     *      strftime('%s', strftime('%Y-%m-%d %H:%M:%S', 'now'));
     *  > 2019-09-07 23:59:35
     *  > 1567900775
     * ```
     */
    CURRENT_TIMESTAMP_0 = "CURRENT_TIMESTAMP_0",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_current-timestamp
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `CURRENT_TIMESTAMP(1)`
     * ```sql
     *  SET @@session.time_zone = 'EST';
     *  SELECT
     *      CURRENT_TIMESTAMP(1),
     *      FLOOR(UNIX_TIMESTAMP(CURRENT_TIMESTAMP(1))),
     *      UNIX_TIMESTAMP()
     *  > 2019-09-07 19:55:03.8
     *  > 1567900503
     *  > 1567900503
     * ```
     * + PostgreSQL     : `CURRENT_TIMESTAMP(1)`
     *   + http://www.postgresqltutorial.com/postgresql-localtimestamp/
     *
     *   > The `LOCALTIMESTAMP` function returns a `TIMESTAMP` value **without** time zone while
     *   > the `CURRENT_TIMESTAMP` function returns a `TIMESTAMP` **with** time zone.
     * ```sql
     *  SET TIME ZONE 'EST';
     *  SELECT
     *      CURRENT_TIMESTAMP(1),
     *      FLOOR(EXTRACT(
     *          EPOCH FROM CURRENT_TIMESTAMP(1)
     *      ))
     *  > 2019-09-07T23:58:20.400Z
     *  > 1567900700
     * ```
     * + SQLite         : `substr(strftime('%Y-%m-%d %H:%M:%f', 'now'), 1, 21)` gives precision `1`
     * ```sql
     *  SELECT
     *      substr(strftime('%Y-%m-%d %H:%M:%f', 'now'), 1, 21),
     *      strftime('%s', substr(strftime('%Y-%m-%d %H:%M:%f', 'now'), 1, 21));
     *  > 2019-09-07 23:59:35.3
     *  > 1567900775
     * ```
     */
    CURRENT_TIMESTAMP_1 = "CURRENT_TIMESTAMP_1",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_current-timestamp
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `CURRENT_TIMESTAMP(2)`
     * ```sql
     *  SET @@session.time_zone = 'EST';
     *  SELECT
     *      CURRENT_TIMESTAMP(2),
     *      FLOOR(UNIX_TIMESTAMP(CURRENT_TIMESTAMP(2))),
     *      UNIX_TIMESTAMP()
     *  > 2019-09-07 19:55:03.83
     *  > 1567900503
     *  > 1567900503
     * ```
     * + PostgreSQL     : `CURRENT_TIMESTAMP(2)`
     *   + http://www.postgresqltutorial.com/postgresql-localtimestamp/
     *
     *   > The `LOCALTIMESTAMP` function returns a `TIMESTAMP` value **without** time zone while
     *   > the `CURRENT_TIMESTAMP` function returns a `TIMESTAMP` **with** time zone.
     * ```sql
     *  SET TIME ZONE 'EST';
     *  SELECT
     *      CURRENT_TIMESTAMP(2),
     *      FLOOR(EXTRACT(
     *          EPOCH FROM CURRENT_TIMESTAMP(2)
     *      ))
     *  > 2019-09-07T23:58:20.470Z
     *  > 1567900700
     * ```
     * + SQLite         : `substr(strftime('%Y-%m-%d %H:%M:%f', 'now'), 1, 22)` gives precision `2`
     * ```sql
     *  SELECT
     *      substr(strftime('%Y-%m-%d %H:%M:%f', 'now'), 1, 22),
     *      strftime('%s', substr(strftime('%Y-%m-%d %H:%M:%f', 'now'), 1, 22));
     *  > 2019-09-07 23:59:35.32
     *  > 1567900775
     * ```
     */
    CURRENT_TIMESTAMP_2 = "CURRENT_TIMESTAMP_2",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_current-timestamp
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `CURRENT_TIMESTAMP(3)`
     * ```sql
     *  SET @@session.time_zone = 'EST';
     *  SELECT
     *      CURRENT_TIMESTAMP(3),
     *      FLOOR(UNIX_TIMESTAMP(CURRENT_TIMESTAMP(3))),
     *      UNIX_TIMESTAMP()
     *  > 2019-09-07 19:55:03.836
     *  > 1567900503
     *  > 1567900503
     * ```
     * + PostgreSQL     : `CURRENT_TIMESTAMP(3)`
     *   + http://www.postgresqltutorial.com/postgresql-localtimestamp/
     *
     *   > The `LOCALTIMESTAMP` function returns a `TIMESTAMP` value **without** time zone while
     *   > the `CURRENT_TIMESTAMP` function returns a `TIMESTAMP` **with** time zone.
     * ```sql
     *  SET TIME ZONE 'EST';
     *  SELECT
     *      CURRENT_TIMESTAMP(3),
     *      FLOOR(EXTRACT(
     *          EPOCH FROM CURRENT_TIMESTAMP(3)
     *      ))
     *  > 2019-09-07T23:58:20.477Z
     *  > 1567900700
     * ```
     * + SQLite         : `strftime('%Y-%m-%d %H:%M:%f', 'now')` gives precision `3`
     * ```sql
     *  SELECT
     *      strftime('%Y-%m-%d %H:%M:%f', 'now'),
     *      strftime('%s', strftime('%Y-%m-%d %H:%M:%f', 'now'));
     *  > 2019-09-07 23:59:35.327
     *  > 1567900775
     * ```
     */
    CURRENT_TIMESTAMP_3 = "CURRENT_TIMESTAMP_3",

    /**
     *
     * -----
     *
     * + MySQL          : `CONVERT_TZ(TIMESTAMP(x), '+00:00', @@session.time_zone)`
     * ```sql
     *  SET @@session.time_zone = 'EST';
     *  SELECT
     *      CONVERT_TZ(TIMESTAMP('1970-01-01 03:00:00.123'), '+00:00', @@session.time_zone),
     *      FLOOR(UNIX_TIMESTAMP(CONVERT_TZ(TIMESTAMP('1970-01-01 03:00:00.123'), '+00:00', @@session.time_zone)));
     *  > 1969-12-31 22:00:00.123
     *  > 10800
     * ```
     * + PostgreSQL     : `(x)::timestamp AT TIME ZONE '+00:00'`
     * ```sql
     *  SET TIME ZONE 'EST';
     *  SELECT
     *      '1970-01-01 03:00:00.123'::timestamp AT TIME ZONE '+00:00',
     *      FLOOR(EXTRACT(
     *          EPOCH FROM (
     *              '1970-01-01 03:00:00.123'::timestamp AT TIME ZONE '+00:00'
     *          )
     *      ))
     *  > 1970-01-01T03:00:00.123Z
     *  > 10800
     * ```
     * + SQLite         : `strftime('%Y-%m-%d %H:%M:%f', x)`
     * ```sql
     *  SELECT
     *      strftime('%Y-%m-%d %H:%M:%f', '1970-01-01 03:00:00.123'),
     *      strftime('%s', strftime('%Y-%m-%d %H:%M:%f', '1970-01-01 03:00:00.123'));
     *  > 1970-01-01 03:00:00.123
     *  > 10800
     * ```
     *
     * -----
     *
     * Treat `x` as representing a `UTC` timestamp.
     *
     */
    UTC_STRING_TO_TIMESTAMP_CONSTRUCTOR = "UTC_STRING_TO_TIMESTAMP_CONSTRUCTOR",

    /**
     *
     * -----
     *
     * + MySQL          : `TIMESTAMP(x)`
     * ```sql
     *  SET @@session.time_zone = 'EST';
     *  SELECT
     *      TIMESTAMP('1970-01-01 00:00:00.123'),
     *      FLOOR(UNIX_TIMESTAMP(TIMESTAMP('1970-01-01 00:00:00.123')));
     *  > 1970-01-01 00:00:00.123
     *  > 18000
     * ```
     * + PostgreSQL     : `(x)::timestamp AT TIME ZONE current_setting('TIMEZONE')`
     * ```sql
     *  SET TIME ZONE 'EST';
     *  SELECT
     *      '1970-01-01 00:00:00.123'::timestamp AT TIME ZONE current_setting('TIMEZONE'),
     *      FLOOR(EXTRACT(
     *          EPOCH FROM (
     *              '1970-01-01 00:00:00.123'::timestamp AT TIME ZONE current_setting('TIMEZONE')
     *          )
     *      ))
     *  > 1970-01-01T05:00:00.123Z
     *  > 18000
     * ```
     * + SQLite         : `strftime('%Y-%m-%d %H:%M:%f', x, 'utc')`
     * ```sql
     *  SELECT
     *      strftime('%Y-%m-%d %H:%M:%f', '1970-01-01 00:00:00.123', 'utc'),
     *      strftime('%s', strftime('%Y-%m-%d %H:%M:%f', '1970-01-01 00:00:00.123', 'utc'));
     *  > 1970-01-01 05:00:00.123
     *  > 18000
     * ```
     *
     * -----
     *
     * Treat `x` as representing a `local` timestamp.
     *
     */
    LOCAL_STRING_TO_TIMESTAMP_CONSTRUCTOR = "LOCAL_STRING_TO_TIMESTAMP_CONSTRUCTOR",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_extract
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `EXTRACT(SECOND FROM datetime) + FLOOR(EXTRACT(MICROSECOND FROM datetime) / 1000.0) / 1000.0`
     * ```sql
     *  SELECT
     *      EXTRACT(SECOND FROM timestamp '2010-03-27 14:45:32.456789') +
     *      FLOOR(EXTRACT(MICROSECOND FROM timestamp '2010-03-27 14:45:32.456789') / 1000.0e0) / 1000.0e0
     *  > 32.4560
     * ```
     * + PostgreSQL     : `FLOOR(EXTRACT(SECOND FROM datetime) * 1000) / 1000`
     * + SQLite         : `strftime('%S', datetime)`
     * ```sql
     *  SELECT
     *      strftime('%f', '2010-03-27 14:45:32.456789')
     *  > 32.457
     *  -- The result is rounded, not truncated.
     *  -- If it were truncated, we would get 32.456
     * ```
     *
     * @todo Make behaviour consistent
     */
    EXTRACT_FRACTIONAL_SECOND_3 = "EXTRACT_FRACTIONAL_SECOND_3",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_extract
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `EXTRACT(SECOND FROM datetime)`
     * + PostgreSQL     : `CAST(FLOOR(EXTRACT(SECOND FROM datetime)) AS BIGINT)`
     * + SQLite         : `CAST(strftime('%S', datetime) AS BIGINT)`
     */
    EXTRACT_INTEGER_SECOND = "EXTRACT_INTEGER_SECOND",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_extract
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `EXTRACT(MINUTE FROM datetime)`
     * + PostgreSQL     : `CAST(EXTRACT(MINUTE FROM datetime) AS BIGINT)`
     * + SQLite         : `CAST(strftime('%M', datetime) AS BIGINT)`
     */
    EXTRACT_MINUTE = "EXTRACT_MINUTE",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_extract
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `EXTRACT(HOUR FROM datetime)`
     * + PostgreSQL     : `CAST(EXTRACT(HOUR FROM datetime) AS BIGINT)`
     * + SQLite         : `CAST(strftime('%H', datetime) AS BIGINT)`
     */
    EXTRACT_HOUR = "EXTRACT_HOUR",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_extract
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `EXTRACT(DAY FROM datetime)`
     * + PostgreSQL     : `CAST(EXTRACT(DAY FROM datetime) AS BIGINT)`
     * + SQLite         : `CAST(strftime('%d', datetime) AS BIGINT)`
     */
    EXTRACT_DAY = "EXTRACT_DAY",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_extract
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `EXTRACT(MONTH FROM datetime)`
     * + PostgreSQL     : `CAST(EXTRACT(MONTH FROM datetime) AS BIGINT)`
     * + SQLite         : `CAST(strftime('%m', datetime) AS BIGINT)`
     */
    EXTRACT_MONTH = "EXTRACT_MONTH",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_extract
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `EXTRACT(YEAR FROM datetime)`
     * + PostgreSQL     : `CAST(EXTRACT(YEAR FROM datetime) AS BIGINT)`
     * + SQLite         : `CAST(strftime('%Y', datetime) AS BIGINT)`
     */
    EXTRACT_YEAR = "EXTRACT_YEAR",

    /**
     * + MySQL          : `LAST_DAY(datetime)`
     * ```sql
     *  SELECT
     *      LAST_DAY(timestamp '2010-03-27 14:45:32.456789')
     *  > 2010-03-31
     * ```
     * + PostgreSQL     :
     * ```sql
     *  SELECT
     *      (
     *          datetime +
     *          interval '1 month' -
     *          CONCAT(EXTRACT(DAY FROM datetime), ' day')::interval
     *      )::date
     * > 2010-03-31T00:00:00.000Z
     * ```
     * + SQLite         :
     * ```sql
     *  SELECT
     *      strftime(
     *          '%Y-%m-%d',
     *          '2010-03-27 14:45:32.456789',
     *          '+1 month',
     *          '-' || strftime('%d', '2010-03-27 14:45:32.456789') || ' day'
     *      )
     *  > 2010-03-31
     * ```
     */
    LAST_DAY = "LAST_DAY",

    /*
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampadd
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#OPERATORS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `TIMESTAMPADD(MICROSECOND, x, datetime)`
     * + PostgreSQL     : `datetime + concat(x/1000.0, ' millisecond')::interval`
     *
     *   1 millisecond is 1000 microseconds
     *
     * + SQLite         :
     * ```sql
     *  strftime(
     *      '%Y-%m-%d %H:%M:%f',
     *      datetime,
     *      -- 1 second is 1,000,000 microseconds
     *      (x/1000000.0) || ' second'
     *  );
     * ```
     *
     * However, SQLite only displays up to millisecond precision (3 decimal places for seconds).
     * JS' `Date` also only has up to millisecond precision.
     */
    //TIMESTAMPADD_MICROSECOND = "TIMESTAMPADD_MICROSECOND",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampadd
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#OPERATORS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `TIMESTAMPADD(SECOND, x/1000.0, datetime)`
     * + PostgreSQL     : `datetime + concat(x, ' millisecond')::interval`
     * + SQLite         :
     * ```sql
     *  strftime(
     *      '%Y-%m-%d %H:%M:%f',
     *      datetime,
     *      (x/1000e0) || ' second'
     *  );
     * ```
     */
    TIMESTAMPADD_MILLISECOND = "TIMESTAMPADD_MILLISECOND",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampadd
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#OPERATORS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `TIMESTAMPADD(SECOND, x, datetime)`
     * + PostgreSQL     : `datetime + concat(x, ' second')::interval`
     * + SQLite         :
     * ```sql
     *  strftime(
     *      '%Y-%m-%d %H:%M:%f',
     *      datetime,
     *      x || ' second'
     *  );
     * ```
     */
    TIMESTAMPADD_SECOND = "TIMESTAMPADD_SECOND",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampadd
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#OPERATORS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `TIMESTAMPADD(SECOND, x*60.0, datetime)`
     *   + `TIMESTAMPADD(MINUTE, x, datetime)` ignores the fractional part of `x`.
     *   + We convert `x` to seconds as a workaround.
     * + PostgreSQL     : `datetime + concat(x, ' minute')::interval`
     * + SQLite         :
     * ```sql
     *  strftime(
     *      '%Y-%m-%d %H:%M:%f',
     *      datetime,
     *      x || ' minute'
     *  );
     * ```
     */
    TIMESTAMPADD_MINUTE = "TIMESTAMPADD_MINUTE",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampadd
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#OPERATORS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `TIMESTAMPADD(SECOND, x*60.0*60.0, datetime)`
     *   + `TIMESTAMPADD(HOUR, x, datetime)` ignores the fractional part of `x`.
     *   + We convert `x` to seconds as a workaround.
     * + PostgreSQL     : `datetime + concat(x, ' hour')::interval`
     * + SQLite         :
     * ```sql
     *  strftime(
     *      '%Y-%m-%d %H:%M:%f',
     *      datetime,
     *      x || ' hour'
     *  );
     * ```
     */
    TIMESTAMPADD_HOUR = "TIMESTAMPADD_HOUR",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampadd
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#OPERATORS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `TIMESTAMPADD(SECOND, x*24.0*60.0*60.0, datetime)`
     *   + `TIMESTAMPADD(DAY, x, datetime)` ignores the fractional part of `x`.
     *   + We convert `x` to seconds as a workaround.
     * + PostgreSQL     : `datetime + concat(x, ' day')::interval`
     * + SQLite         :
     * ```sql
     *  strftime(
     *      '%Y-%m-%d %H:%M:%f',
     *      datetime,
     *      x || ' day'
     *  );
     * ```
     */
    TIMESTAMPADD_DAY = "TIMESTAMPADD_DAY",

    /**
     * Seems to be a MySQL and PostgreSQL thing.
     * SQLite does not have `week` intervals.
     *
     * Could probably be emulated with `7 day` being `1 week`
     */
    //TIMESTAMPADD_WEEK = "TIMESTAMPADD_WEEK",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampadd
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#OPERATORS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `TIMESTAMPADD(MONTH, x, datetime)`
     * + PostgreSQL     : `datetime + concat(x, ' month')::interval`
     * + SQLite         :
     * ```sql
     *  strftime(
     *      '%Y-%m-%d %H:%M:%f',
     *      datetime,
     *      x || ' month'
     *  );
     * ```
     */
    TIMESTAMPADD_MONTH = "TIMESTAMPADD_MONTH",

    /**
     * Seems to be a MySQL thing.
     * PostgreSQL and SQLite do not have `quarter` intervals.
     *
     * Could probably be emulated with `3 month` being `1 quarter`
     */
    //TIMESTAMPADD_QUARTER = "TIMESTAMPADD_QUARTER",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_timestampadd
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#OPERATORS-DATETIME-TABLE
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `TIMESTAMPADD(YEAR, x, datetime)`
     * + PostgreSQL     : `datetime + concat(x, ' year')::interval`
     * + SQLite         :
     * ```sql
     *  strftime(
     *      '%Y-%m-%d %H:%M:%f',
     *      datetime,
     *      x || ' year'
     *  );
     * ```
     */
    TIMESTAMPADD_YEAR = "TIMESTAMPADD_YEAR",

    /*
     * SQLite does not have microsecond precision.
     */
    //TIMESTAMPDIFF_MICROSECOND = "TIMESTAMPDIFF_MICROSECOND",

    /**
     * + MySQL          : `FLOOR(TIMESTAMPDIFF(MICROSECOND, from, to)/1000e0)`
     *   + Should be casted to `BIGINT` after `FLOOR()`
     * + PostgreSQL     : `EXTRACT(DAY FROM (to - from))*24*60*60*1000 + EXTRACT(HOUR FROM (to - from))*60*60*1000 + EXTRACT(MINUTE FROM (to - from))*60*1000 + FLOOR(EXTRACT(SECOND FROM (to - from))*1000)`
     *   + The `FLOOR()` at the end is necessary
     *   + Extracting `SECOND` gives a number with decimal places for milliseconds
     *   + Every `EXTRACT()/FLOOR()` should be wrapped with a cast to `BIGINT`
     * + SQLite         : `FLOOR((strftime('%J', to) - strftime('%J', from)) * 24 * 60 * 60 * 1000)`
     *   + We don't need to `FLOOR()` the result but it keeps the results consistent across the databases
     */
    TIMESTAMPDIFF_MILLISECOND = "TIMESTAMPDIFF_MILLISECOND",

    /**
     * + MySQL          : `TIMESTAMPDIFF(SECOND, from, to)`
     * + PostgreSQL     : `EXTRACT(DAY FROM (to - from))*24*60*60 + EXTRACT(HOUR FROM (to - from))*60*60 + EXTRACT(MINUTE FROM (to - from))*60 + FLOOR(EXTRACT(SECOND FROM (to - from)))`
     *   + The `FLOOR()` at the end is necessary
     *   + Extracting `SECOND` gives a number with decimal places for milliseconds
     * + SQLite         : `FLOOR((strftime('%J', to) - strftime('%J', from)) * 24 * 60 * 60)`
     *   + We don't need to `FLOOR()` the result but it keeps the results consistent across the databases
     */
    TIMESTAMPDIFF_SECOND = "TIMESTAMPDIFF_SECOND",

    /**
     * + MySQL          : `TIMESTAMPDIFF(MINUTE, from, to)`
     * + PostgreSQL     : `EXTRACT(DAY FROM (to - from))*24*60 + EXTRACT(HOUR FROM (to - from))*60 + EXTRACT(MINUTE FROM (to - from))`
     * + SQLite         : `FLOOR((strftime('%J', to) - strftime('%J', from)) * 24 * 60)`
     *   + We don't need to `FLOOR()` the result but it keeps the results consistent across the databases
     */
    TIMESTAMPDIFF_MINUTE = "TIMESTAMPDIFF_MINUTE",

    /**
     * + MySQL          : `TIMESTAMPDIFF(HOUR, from, to)`
     * + PostgreSQL     : `EXTRACT(DAY FROM (to - from))*24 + EXTRACT(HOUR FROM (to - from))`
     * + SQLite         : `FLOOR((strftime('%J', to) - strftime('%J', from)) * 24)`
     *   + We don't need to `FLOOR()` the result but it keeps the results consistent across the databases
     */
    TIMESTAMPDIFF_HOUR = "TIMESTAMPDIFF_HOUR",

    /**
     * + MySQL          : `TIMESTAMPDIFF(DAY, from, to)`
     * + PostgreSQL     : `EXTRACT(DAY FROM (to - from))`
     * + SQLite         : `FLOOR(strftime('%J', to) - strftime('%J', from))`
     *   + We don't need to `FLOOR()` the result but it keeps the results consistent across the databases
     */
    TIMESTAMPDIFF_DAY = "TIMESTAMPDIFF_DAY",

    /*
     * Seems to be MySQL-specific
     */
    //TIMESTAMPDIFF_WEEK = "TIMESTAMPDIFF_WEEK",

    /*
     * + MySQL          : `TIMESTAMPDIFF(MONTH, from, to)`
     * + PostgreSQL     :
     * ```sql
     * EXTRACT(YEAR FROM AGE(to, from))*12 +
     * EXTRACT(MONTH FROM AGE(to, from))
     * ```
     * + SQLite         : @todo? Doesn't seem possible to compute properly
     */
    //TIMESTAMPDIFF_MONTH = "TIMESTAMPDIFF_MONTH",

    /*
     * Seems to be MySQL-specific
     */
    //TIMESTAMPDIFF_QUARTER = "TIMESTAMPDIFF_QUARTER",

    /*
     * + MySQL          : `TIMESTAMPDIFF(YEAR, from, to)`
     * + PostgreSQL     :
     * ```sql
     * EXTRACT(YEAR FROM AGE(to, from))
     * ```
     * + SQLite         : @todo? Doesn't seem possible to compute properly
     */
    //TIMESTAMPDIFF_YEAR = "TIMESTAMPDIFF_YEAR",

    /*
     * The different databases implement this differently,
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_time-format
     * + https://www.postgresql.org/docs/9.4/functions-formatting.html
     * + https://www.sqlite.org/lang_datefunc.html
     */
    //TIME_FORMAT = "TIME_FORMAT",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_time-to-sec
     */
    //TIME_TO_SEC = "TIME_TO_SEC",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_to-days
     */
    //TO_DAYS = "TO_DAYS",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_to-seconds
     */
    //TO_SECONDS = "TO_SECONDS",

    /*
     * @todo
     *
     * I don't think this can easily be made portable across different database systems
     * **AND** made to behave consistently across different session time zone settings.
     *
     * -----
     *
     * + MySQL          : `UNIX_TIMESTAMP(datetime)`
     *   + The return value is an integer if no argument is given or the argument does not include a fractional seconds part,
     *   + or `DECIMAL` if an argument is given that includes a fractional seconds part.
     *   + returns a Unix timestamp representing seconds since '1970-01-01 00:00:00' UTC.
     *   + The server interprets date as a value in the session time zone and converts it to an internal Unix timestamp value in UTC.
     * +
     */
    //UNIX_TIMESTAMP_AT_DATETIME = "UNIX_TIMESTAMP_AT_DATETIME",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_unix-timestamp
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `UNIX_TIMESTAMP()`
     * + PostgreSQL     :
     * ```sql
     *  FLOOR(
     *      EXTRACT(EPOCH FROM (
     *          CURRENT_TIMESTAMP -
     *          timestamp '1970-01-01 00:00:00' AT TIME ZONE '00:00'
     *      ))
     *  )
     * ```
     * + SQLite         : `strftime('%s', 'now')`
     */
    UNIX_TIMESTAMP_NOW = "UNIX_TIMESTAMP_NOW",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_utc-date
     */
    //UTC_DATE = "UTC_DATE",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_utc-time
     */
    //UTC_TIME = "UTC_TIME",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_current-timestamp
     *
     * Also, it does not play well with the other MySQL date-time functions.
     * Do not implement in base package unless a **VERY** good reason exists.
     */
    //UTC_TIMESTAMP = "UTC_TIMESTAMP",

    /*
     * Wtf is this, even?
     * https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_week
     */
    //WEEK = "WEEK",

    /*
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_weekday
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `WEEKDAY(date)`           ; `0=Monday, 1=Tuesday, ..., 6=Sunday`
     * + PostgreSQL     : `EXTRACT(DOW FROM date)`  ; `0=Sunday, 1=Monday , ..., 6=Saturday`
     * + SQLite         : `strftime('%w', date)`    ; `0=Sunday, 1=Monday , ..., 6=Saturday`
     *
     * -----
     *
     * Implementations are incompatible.
     * Can possibly use a different name and unify their implementations, however.
     */
    //WEEKDAY = "WEEKDAY",

    /*
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_weekofyear
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `WEEKOFYEAR(date)`        ; `1-53`
     * + PostgreSQL     : `EXTRACT(WEEK FROM date)` ; `@todo`
     * + SQLite         : `strftime('%W', date)`    ; `0-53`
     *
     * -----
     *
     * Implementations are incompatible.
     * Can possibly use a different name and unify their implementations, however.
     */
    //WEEKOFYEAR = "WEEKOFYEAR",

    /*
     * + https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_year
     * + https://www.postgresql.org/docs/9.4/functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT
     * + https://www.sqlite.org/lang_datefunc.html
     *
     * -----
     *
     * + MySQL          : `YEAR(date)`
     * + PostgreSQL     : `EXTRACT(YEAR FROM date)`
     * + SQLite         : `strftime('%Y', date)`
     *
     * @todo How is this different from `EXTRACT(YEAR FROM date)`?
     */
    //YEAR = "YEAR",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_yearweek
     */
    //YEARWEEK = "YEARWEEK",

    /*
        Cast Functions and Operators
        https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html
    */

    /**
     * @todo
     */

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html#function_cast
     * + https://www.postgresql.org/docs/9.2/datatype.html#DATATYPE-TABLE
     * + https://www.sqlite.org/datatype3.html
     *
     * -----
     *
     * + MySQL          : `CAST(x AS BINARY)`
     * + PostgreSQL     : `CAST(x AS bytea)`
     * + SQLite         : `CAST(x AS BLOB)`
     */
    CAST_AS_BYTE_ARRAY = "CAST_AS_BYTE_ARRAY",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html#function_cast
     * + https://www.postgresql.org/docs/9.2/datatype.html#DATATYPE-TABLE
     * + https://www.sqlite.org/datatype3.html
     *
     * -----
     *
     * + MySQL          : `CAST(x AS CHAR) [charset_info]`
     * + PostgreSQL     : `CAST(x AS VARCHAR) [charset_info]`
     * + SQLite         : `CAST(x AS VARCHAR) [charset_info]`
     */
    CAST_AS_VARCHAR = "CAST_AS_VARCHAR",


    /*
     * + https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html#function_cast
     * + https://www.postgresql.org/docs/9.2/datatype.html#DATATYPE-TABLE
     * + https://www.sqlite.org/datatype3.html
     *
     * -----
     *
     * + MySQL          : `CAST(x AS DATE)`
     * + PostgreSQL     : `CAST(x AS DATE)`
     * + SQLite         :
     *   **DO NOT** use `CAST(x AS DATE)`!
     * ```sql
     * SELECT CAST('2010-10-27 12:00:00' AS DATE)
     * > 2019
     * ```
     *
     * The above happens because `DATE` has `NUMERIC` affinity.
     * And so, the cast is the same as saying `CAST(x AS DECIMAL)`
     *
     * -----
     *
     * Actually, don't even use `CAST_AS_DATE`.
     * Just use one of the two `TIMESTAMP` constructors.
     */
    //CAST_AS_DATE = "CAST_AS_DATE",

    /*
     * Actually, don't even use `CAST_AS_DATETIME`.
     * Just use one of the two `TIMESTAMP` constructors.
     */
    //CAST_AS_DATETIME = "CAST_AS_DATETIME",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html#function_cast
     * + https://www.postgresql.org/docs/9.2/datatype.html#DATATYPE-TABLE
     * + https://www.sqlite.org/datatype3.html
     *
     * -----
     *
     * + MySQL          : `CAST(x AS DECIMAL(precision, scale))`
     *   + Max precision : 65
     *   + Max scale     : 30
     * + PostgreSQL     : `CAST(x AS DECIMAL(precision, scale))`
     *   + Max precision : 1000
     *   + Max scale     : 1000
     * + SQLite         : `CAST(x AS DECIMAL(precision, scale))`
     * ```sql
     * SELECT CAST('1e308' AS DECIMAL)
     * > 1e+308
     * ```
     *
     * For SQLite, this doesn't even cast to an arbitrary precision number.
     * SQLite does not support arbitrary precision numbers.
     * You will get a `double` instead.
     *
     * -----
     *
     * Precision and scale cannot be omitted.
     *
     * When omitted, MySQL defaults to `DECIMAL(10, 0)`
     * When omitted, PostgreSQL defaults to a precision and scale that will contain `x`
     *
     * -----
     *
     * ### Notes about MySQL's `DECIMAL`
     *
     * https://github.com/mysql/mysql-server/blob/8.0/strings/decimal.cc#L1253-L1313
     * https://github.com/mysql/mysql-server/blob/8.0/strings/decimal.cc#L1576-L1598
     *
     * ```js
     * DIG_PER_DEC1 = 9
     * dig2bytes = [0,1,1,2,2,3,3,4,4,4]
     * precision = 65
     * scale = 30
     * //typedef int32 decimal_digit_t;
     * //typedef decimal_digit_t dec1;
     * dec1 = 4
     * function sizeof (arg) { return arg }
     * var
     *      intg = precision - scale,
     *      intg0  = Math.floor(intg / DIG_PER_DEC1),
     *      frac0  = Math.floor(scale / DIG_PER_DEC1),
     *      intg0x = intg - intg0 * DIG_PER_DEC1,
     *      frac0x = scale - frac0 * DIG_PER_DEC1;
     * result = intg0 * sizeof(dec1) + dig2bytes[intg0x] + frac0 * sizeof(dec1) + dig2bytes[frac0x]
     * ```
     *
     * http://ftp.nchu.edu.tw/MySQL/doc/refman/5.0/en/precision-math-decimal-changes.html
     *
     * -----
     *
     * ```js
     * DIG_PER_DEC1 = 9;
     * dig2bytes = [0, 1, 1, 2, 2, 3, 3, 4, 4, 4];
     *
     * res = {};
     *
     * for (let precision = 1; precision < 73; precision++) {
     *      for (let scale = 0; scale <= precision; scale++) {
     *          const intg = precision - scale;
     *          const intg0 = Math.floor(intg / DIG_PER_DEC1);
     *          const frac0 = Math.floor(scale / DIG_PER_DEC1);
     *          const intg0x = intg - intg0 * DIG_PER_DEC1;
     *          const frac0x = scale - frac0 * DIG_PER_DEC1;
     *          const result = (
     *              intg0 * 4 + dig2bytes[intg0x] + frac0 * 4 + dig2bytes[frac0x]
     *          );
     *          res[`${precision}.${scale}`] = result;
     *      }
     * }
     * console.log(res);
     * ```
     *
     * -----
     *
     * ### Notes about PostgreSQL's `DECIMAL`
     *
     * https://doxygen.postgresql.org/numeric_8h.html#a12ab0e498cc609664248b5c9bb6c0a43
     *
     * @karanlyons said,
     * > 511 bytes for 1000 digits in postgres.
     * >
     * > And I think they use the extra byte for some additional bookeeping of the sign, etc.
     * >
     * > So 512, which makes sense!
     * >
     * > <3 u pg.
     * >
     * > Postgres’ source code is way better to read.
     * >
     * > It helps that they’re not insane.
     * >
     * > ~~That extra byte is actually for the type header I think, not internal bookkeeping of the number itself.~~
     * >
     * > The extra byte is for the `typmod` I think, which is 32 bits encoding the precision and scale in the upper 16 and lower 16.
     * >
     * > https://doxygen.postgresql.org/backend_2utils_2adt_2numeric_8c_source.html#l00703
     * >
     * > https://doxygen.postgresql.org/structNumericVar.html
     */
    CAST_AS_DECIMAL = "CAST_AS_DECIMAL",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html#function_cast
     * + https://www.postgresql.org/docs/9.2/datatype.html#DATATYPE-TABLE
     * + https://www.sqlite.org/datatype3.html
     *
     * -----
     *
     * + MySQL 5.7      : `x + 0e0`
     * + MySQL 8.0.17   : `CAST(x AS DOUBLE)` (Allegedly)
     * + PostgreSQL     : `CAST(x AS DOUBLE PRECISION)`
     * + SQLite         : `CAST(x AS DOUBLE)`
     */
    CAST_AS_DOUBLE = "CAST_AS_DOUBLE",

    /*
     * Can't do it in MySQL 5.7.
     */
    //CAST_AS_FLOAT = "CAST_AS_FLOAT",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html#function_cast
     * + https://www.postgresql.org/docs/9.2/datatype.html#DATATYPE-TABLE
     * + https://www.sqlite.org/datatype3.html
     *
     * -----
     *
     * + MySQL          : `CAST(x AS JSON)`
     * + PostgreSQL     : `CAST(x AS JSON)`
     * + SQLite         : `CAST(x AS TEXT)`; Or implement with user-defined function.
     *
     *   SQLite does not have a `JSON` data type
     */
    CAST_AS_JSON = "CAST_AS_JSON",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html#function_cast
     * + https://www.postgresql.org/docs/9.2/datatype.html#DATATYPE-TABLE
     * + https://www.sqlite.org/datatype3.html
     * + https://dev.mysql.com/doc/refman/8.0/en/charset-national.html
     *
     * -----
     *
     * + MySQL          : `CAST(x AS NCHAR)`
     * + PostgreSQL     : `CAST(x AS VARCHAR) utf8`
     *   + https://dev.mysql.com/doc/refman/8.0/en/charset-national.html
     *   + `utf8` is the charset of MySQL's `NCHAR`
     * + SQLite         : `CAST(x AS TEXT)`
     *   + SQLite does not have character sets
     */
    CAST_AS_N_CHAR = "CAST_AS_N_CHAR",

    /*
     * The behaviour is too unpredictable on MySQL.
     * > Produces a result of type REAL.
     * This is actually FLOAT if REAL_AS_FLOAT SQL mode is enabled; otherwise the result is of type DOUBLE.
     */
    //CAST_AS_REAL = "CAST_AS_REAL",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html#function_cast
     * + https://www.postgresql.org/docs/9.2/datatype.html#DATATYPE-TABLE
     * + https://www.sqlite.org/datatype3.html
     *
     * -----
     *
     * + MySQL          : `CAST(x AS SIGNED INTEGER)`
     *   + Actually gives a signed `bigint`
     *   + Trying to cast `'123e2'` gives `123`
     * + PostgreSQL     : `CAST(x AS bigint)`
     *   + Trying to cast `'123e2'` throws an error
     * + SQLite         : `CAST(x AS BIGINT)`
     *   + Trying to cast `'123e2'` gives `123`
     */
    CAST_AS_SIGNED_BIG_INTEGER = "CAST_AS_SIGNED_BIG_INTEGER",

    /*
     * Use one of the `TIMESTAMP` constructors instead
     */
    //CAST_AS_TIME = "CAST_AS_TIME",

    /*
     * + https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html#function_cast
     * + https://www.postgresql.org/docs/9.2/datatype.html#DATATYPE-TABLE
     * + https://www.sqlite.org/datatype3.html
     *
     * -----
     *
     * + MySQL          : `CAST(x AS UNSIGNED INTEGER)`
     *   + Actually gives an unsigned `bigint`
     * + PostgreSQL     : `CAST(x AS bigint)`
     *   + PostgreSQL does not have unsigned types!
     * + SQLite         : `CAST(x AS BIGINT)`
     *   + SQLite does not have unsigned types!
     *
     * -----
     *
     * ~~Even though **ONLY** MySQL supports `UNSIGNED` types,~~
     * ~~we're still adding this because it's too useful to give up.~~
     * Support for `BIGINT UNSIGNED` has been dropped.
     *
     * It means that trying to use `BIGINT UNSIGNED` with other databases
     * will produce varying behaviours, though...
     *
     * For example, the range of `BIGINT SIGNED` is much smaller than
     * `BIGINT UNSIGNED` if we are only looking at the non-negative range.
     *
     * Math with `BIGINT UNSIGNED` fails if the result becomes negative.
     * `BIGINT SIGNED` has no such inhibitions.
     */
    //CAST_AS_UNSIGNED_BIG_INTEGER = "CAST_AS_UNSIGNED_BIG_INTEGER",



    /*
        Bit Functions and Operators
        https://dev.mysql.com/doc/refman/8.0/en/bit-functions.html
    */

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/bit-functions.html#operator_bitwise-and
     * + https://www.postgresql.org/docs/9.0/functions-math.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * -----
     *
     * + MySQL        : `CAST(x & y AS SIGNED)`
     * + PostgreSQL   : `&`
     * + SQLite       : `&`
     */
    BITWISE_AND = "BITWISE_AND",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/bit-functions.html#operator_bitwise-invert
     * + https://www.postgresql.org/docs/9.0/functions-math.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * -----
     *
     * + MySQL        : `CAST(~x AS SIGNED)`
     *   + `~1337` === `18446744073709550278`
     *   + `CAST(~1337 AS SIGNED)` === `-1338`
     * + PostgreSQL   : `~x`
     *   + `~1337` === `-1338`
     * + SQLite       : `~x`
     *   + `~1337` === `-1338`
     */
    BITWISE_NOT = "BITWISE_NOT",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/bit-functions.html#operator_bitwise-or
     * + https://www.postgresql.org/docs/9.0/functions-math.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * -----
     *
     * + MySQL        : `CAST(x | y AS SIGNED)`
     * + PostgreSQL   : `|`
     * + SQLite       : `|`
     */
    BITWISE_OR = "BITWISE_OR",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/bit-functions.html#operator_bitwise-xor
     * + https://www.postgresql.org/docs/9.0/functions-math.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * -----
     *
     * + MySQL        : `CAST(x ^ y AS SIGNED)`
     * + PostgreSQL   : `#`
     * + SQLite       : None, use `(~(a&b))&(a|b)` instead
     *   + https://stackoverflow.com/questions/16440831/bitwise-xor-in-sqlite-bitwise-not-not-working-as-i-expect
     *   + https://www.mail-archive.com/sqlite-users@mailinglists.sqlite.org/msg02250.html
     */
    BITWISE_XOR = "BITWISE_XOR",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/bit-functions.html#operator_left-shift
     * + https://www.postgresql.org/docs/9.0/functions-math.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * -----
     *
     * + MySQL        : `CAST(x << y AS SIGNED)`
     * + PostgreSQL   : `<<`
     * + SQLite       : `<<`
     */
    BITWISE_LEFT_SHIFT = "BITWISE_LEFT_SHIFT",
    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/bit-functions.html#operator_right-shift
     * + https://www.postgresql.org/docs/9.0/functions-math.html
     * + https://www.sqlite.org/lang_expr.html#binaryops
     *
     * -----
     *
     * + MySQL        : `CAST(x >> y AS SIGNED)`
     * + PostgreSQL   : `>>`
     * + SQLite       : `>>`
     */
    BITWISE_RIGHT_SHIFT = "BITWISE_RIGHT_SHIFT",

    /*
        Functions That Create JSON Values
        https://dev.mysql.com/doc/refman/8.0/en/json-creation-functions.html
    */
    /**
     * @todo
     */
    /*
        Functions That Search JSON Values
        https://dev.mysql.com/doc/refman/8.0/en/json-search-functions.html
    */
    /**
     * @todo
     */
    /*
        Functions That Modify JSON Values
        https://dev.mysql.com/doc/refman/8.0/en/json-modification-functions.html
    */
    /**
     * @todo
     */
    /*
        Functions That Return JSON Value Attributes
        https://dev.mysql.com/doc/refman/8.0/en/json-attribute-functions.html
    */
    /**
     * @todo
     */
    /*
        JSON Table Functions
        https://dev.mysql.com/doc/refman/8.0/en/json-table-functions.html
    */
    /**
     * @todo
     */
    /*
        JSON Schema Validation Functions
        https://dev.mysql.com/doc/refman/8.0/en/json-validation-functions.html
    */
    /**
     * @todo
     */
    /*
        JSON Utility Functions
        https://dev.mysql.com/doc/refman/8.0/en/json-utility-functions.html
    */
    /**
     * @todo
     */

    /*
        Spatial Analysis Functions
        https://dev.mysql.com/doc/refman/8.0/en/spatial-analysis-functions.html

        @todo Split into subchapters
    */

    /*
        Aggregate (GROUP BY) Function Descriptions
        https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html
    */

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_avg
     * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
     * + https://www.sqlite.org/lang_aggfunc.html#avg
     *
     * -----
     *
     * + MySQL      : `AVG(DISTINCT x)/AVG(x)/AVG(x) OVER()`
     * + PostgreSQL : `AVG(DISTINCT x)/AVG(x)/AVG(x) OVER()`
     *   + PostgreSQL has to cast `x` to `DECIMAL` if `x` is an integer
     *     to get the same result as MySQL.
     * + SQLite     : `AVG(DISTINCT x)/AVG(x)/AVG(x) OVER()`
     *   + A `DECIMAL` polyfill should be added to SQLite and `x` should be casted
     *     to `DECIMAL` if `x` is an integer to get the same result as MySQL.
     */
    AGGREGATE_AVERAGE = "AGGREGATE_AVERAGE",

    /*
     * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_bit-and
     * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
     *
     * -----
     *
     * + MySQL      : `BIT_AND(x)/BIT_AND(x) OVER()`
     *   + If `myTable` is empty, `SELECT BIT_AND(myTableId) FROM myTable` === `18446744073709551615`
     * + PostgreSQL : `BIT_AND(x)/BIT_AND(x) OVER()`
     *   + If `myTable` is empty, `SELECT BIT_AND(myTableId) FROM myTable` === `NULL`
     * + SQLite     : None. Implement with user-defined function.
     */
    //AGGREGATE_BITWISE_AND = "AGGREGATE_BITWISE_AND",

    /*
     * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_bit-or
     * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
     *
     * -----
     *
     * + MySQL      : `BIT_OR(x)/BIT_OR(x) OVER()`
     *   + If `myTable` is empty, `SELECT BIT_OR(myTableId) FROM myTable` === `0`
     * + PostgreSQL : `BIT_OR(x)/BIT_OR(x) OVER()`
     *   + If `myTable` is empty, `SELECT BIT_OR(myTableId) FROM myTable` === `NULL`
     * + SQLite     : None. Implement with user-defined function.
     */
    //AGGREGATE_BITWISE_OR = "AGGREGATE_BITWISE_OR",

    /**
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_bit-xor
     */
    //BIT_XOR = "BIT_XOR",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_count
     * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
     * + https://www.sqlite.org/lang_aggfunc.html#count
     *
     * -----
     *
     * + MySQL      : `COUNT(DISTINCT x)/COUNT(x)/COUNT(x) OVER()`
     *   + `COUNT(x) OVER()` always returns one row
     * + PostgreSQL : `COUNT(DISTINCT x)/COUNT(x)/COUNT(x) OVER()`
     *   + `COUNT(x) OVER()` can return zero rows
     * + SQLite     : `COUNT(DISTINCT x)/COUNT(x)/COUNT(x) OVER()`
     *   + `COUNT(x) OVER()` can return zero rows
     */
    AGGREGATE_COUNT_EXPR = "AGGREGATE_COUNT_EXPR",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_count
     * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
     * + https://www.sqlite.org/lang_aggfunc.html#count
     *
     * -----
     *
     * + MySQL      : `COUNT(*)/COUNT(*) OVER()`
     *   + `COUNT(*) OVER()` can return zero rows
     * + PostgreSQL : `COUNT(*)/COUNT(*) OVER()`
     *   + `COUNT(*) OVER()` can return zero rows
     * + SQLite     : `COUNT(*)/COUNT(*) OVER()`
     *   + `COUNT(*) OVER()` can return zero rows
     */
    AGGREGATE_COUNT_ALL = "AGGREGATE_COUNT_ALL",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_group-concat
     * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
     * + https://www.sqlite.org/lang_aggfunc.html#groupconcat
     *
     * + MySQL      : `GROUP_CONCAT(DISTINCT expr SEPARATOR separator)/GROUP_CONCAT(expr SEPARATOR separator)`
     * + PostgreSQL : `STRING_AGG(DISTINCT expr, separator)/STRING_AGG(expr, separator)`
     * + SQLite     : `GROUP_CONCAT(DISTINCT expr)/GROUP_CONCAT(expr, separator)`
     *   + The order of the concatenated elements is arbitrary.
     *
     * -----
     *
     * Seems like `GROUP_CONCAT()` with `DISTINCT` cannot take a separator
     * for the DB-unified implementation.
     *
     * Unless we modify the SQLite implementation with a user-defined function?
     * @todo Investigate
     */
    AGGREGATE_GROUP_CONCAT = "AGGREGATE_GROUP_CONCAT",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_json-arrayagg
     * @todo?
     *
     * Could also be related to `ARRAY_AGG()` from PostgreSQL,
     */
    //JSON_ARRAYAGG = "JSON_ARRAYAGG",

    /*
     * Appears to be MySQL-specific,
     * https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_json-objectagg
     */
    //JSON_OBJECTAGG = "JSON_OBJECTAGG",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_max
     * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
     * + https://www.sqlite.org/lang_corefunc.html#maxoreunc
     *
     * -----
     *
     * + MySQL      : `MAX(DISTINCT x)/MAX(x)/MAX(x) OVER()`
     * + PostgreSQL : `MAX(DISTINCT x)/MAX(x)/MAX(x) OVER()`
     * + SQLite     : `MAX(DISTINCT x)/MAX(x)/MAX(x) OVER()`
     */
    AGGREGATE_MAX = "AGGREGATE_MAX",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_min
     * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
     * + https://www.sqlite.org/lang_corefunc.html#minoreunc
     *
     * -----
     *
     * + MySQL      : `MIN(DISTINCT x)/MIN(x) OVER()`
     * + PostgreSQL : `MIN(DISTINCT x)/MIN(x) OVER()`
     * + SQLite     : `MIN(DISTINCT x)/MIN(x)/MIN(x) OVER()`
     */
    AGGREGATE_MIN = "AGGREGATE_MIN",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_stddev-pop
     * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
     * + https://stackoverflow.com/questions/2298339/standard-deviation-for-sqlite
     *
     * -----
     *
     * + MySQL      : `STDDEV_POP(x)/STDDEV_POP(x) OVER()`
     * + PostgreSQL : `STDDEV_POP(x)/STDDEV_POP(x) OVER()`
     * + SQLite     : None. Implement with user-defined function.
     *
     * Should only be provided for `double` because MySQL treats all `x` as `double`.
     */
    AGGREGATE_POPULATION_STANDARD_DEVIATION = "AGGREGATE_POPULATION_STANDARD_DEVIATION",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_stddev-samp
     * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
     * + https://stackoverflow.com/questions/2298339/standard-deviation-for-sqlite
     *
     * -----
     *
     * + MySQL      : `STDDEV_SAMP(x)/STDDEV_SAMP(x) OVER()`
     * + PostgreSQL : `STDDEV_SAMP(x)/STDDEV_SAMP(x) OVER()`
     * + SQLite     : None. Implement with user-defined function.
     *
     * Should only be provided for `double` because MySQL treats all `x` as `double`.
     */
    AGGREGATE_SAMPLE_STANDARD_DEVIATION = "AGGREGATE_SAMPLE_STANDARD_DEVIATION",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_min
     * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
     * + https://www.sqlite.org/lang_corefunc.html#minoreunc
     *
     * -----
     *
     * + MySQL      : `SUM(DISTINCT x)/SUM(x)/SUM(x) OVER()`
     * + PostgreSQL : `SUM(DISTINCT x)/SUM(x)/SUM(x) OVER()`
     * + SQLite     : `SUM(DISTINCT x)/SUM(x)/SUM(x) OVER()`
     */
    AGGREGATE_SUM = "AGGREGATE_SUM",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_var-pop
     * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
     *
     * -----
     *
     * + MySQL      : `VAR_POP(x)/VAR_POP(x) OVER()`
     * + PostgreSQL : `VAR_POP(x)/VAR_POP(x) OVER()`
     * + SQLite     : None. Implement with user-defined function.
     *
     * Should only be provided for `double` because MySQL treats all `x` as `double`.
     */
    AGGREGATE_POPULATION_VARIANCE = "AGGREGATE_POPULATION_VARIANCE",

    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_var-samp
     * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
     *
     * -----
     *
     * + MySQL      : `VAR_SAMP(x)/VAR_SAMP(x) OVER()`
     * + PostgreSQL : `VAR_SAMP(x)/VAR_SAMP(x) OVER()`
     * + SQLite     : None. Implement with user-defined function.
     *
     * Should only be provided for `double` because MySQL treats all `x` as `double`.
     */
    AGGREGATE_SAMPLE_VARIANCE = "AGGREGATE_SAMPLE_VARIANCE",

    /*
        https://dev.mysql.com/doc/refman/5.5/en/exists-and-not-exists-subqueries.html

        Subqueries with `EXISTS` or `NOT EXISTS`
    */

    /**
     * + https://dev.mysql.com/doc/refman/5.5/en/exists-and-not-exists-subqueries.html
     * + https://www.postgresql.org/docs/8.1/functions-subquery.html#AEN13171
     * + https://www.sqlite.org/lang_expr.html#exists_op
     *
     * -----
     *
     * + MySQL      : `EXISTS(query)`
     * + PostgreSQL : `EXISTS(query)`
     * + SQLite     : `EXISTS(query)`
     */
    EXISTS = "EXISTS",

    /*
        https://dev.mysql.com/doc/refman/5.7/en/information-functions.html

        Information Functions
    */
    /**
     * + https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_database
     * + https://www.postgresql.org/docs/9.2/functions-info.html
     *
     * -----
     *
     * + MySQL      : `DATABASE()`
     * + PostgreSQL : `CURRENT_DATABASE()`
     * + SQLite     : None. It does not make sense to ask what the current database is.
     *   + Maybe just return dummy data like `"sqliteDb"`
     */
    CURRENT_DATABASE = "CURRENT_DATABASE",

    /**
     * + https://dev.mysql.com/doc/refman/5.7/en/information-functions.html#function_current-user
     * + https://www.postgresql.org/docs/9.2/functions-info.html
     *
     * -----
     *
     * + MySQL      : `CURRENT_USER`
     * + PostgreSQL : `CURRENT_USER`
     * + SQLite     : None. It does not make sense to ask what the current user is.
     *   + Maybe just return dummy data like `"sqliteUser"`
     */
    CURRENT_USER = "CURRENT_USER",

    /*
        Custom library functions

        These functions are not standard SQL,
        but can be implemented using standard SQL.
    */
    /*
     * An invalid expression that is syntactically valid.
     * So, it will run.
     * But evaluating it will throw a run-time error.
     *
     * Good for stuff like,
     * ```sql
     *  -- Throw if the condition is false
     *  -- Otherwise, return the expression
     *  IF(
     *      -- condition,
     *      -- expression,
     *      THROW()
     *  )
     * ```
     *
     * Or,
     * ```sql
     *  -- Throw if expression is null
     *  -- Otherwise, return the expression
     *  COALESCE(
     *      -- possibly null expression,
     *      throw()
     *  )
     * ```
     *
     * A good example of such a throwing expression is,
     * ```sql
     *  -- Returns two rows,
     *  (SELECT NULL UNION ALL SELECT NULL)
     * ```
     *
     * @todo Find other such throwing expressions?
     *
     * This cannot be done in PostgreSQL.
     * PostgeSQL's type system does not allow mixing types like,
     * ```sql
     *  COALESCE(true, (SELECT NULL UNION ALL SELECT NULL))
     * ```
     */
    //THROW = "THROW",
    /**
     * + MySQL      - `COALESCE(x, (SELECT NULL UNION ALL SELECT NULL))`
     * + PostgreSQL - `COALESCE(x, (SELECT NULL UNION ALL SELECT x))`
     *   Unfortunately, with PostgreSQL, we need to duplicate the expression...
     *   But this is a debug expression, anyway, and should not be used often.
     * + SQLite     - `COALESCE(x, (SELECT NULL UNION ALL SELECT NULL))`
     */
    THROW_IF_NULL = "THROW_IF_NULL",
}
