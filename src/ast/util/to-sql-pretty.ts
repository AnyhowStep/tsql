import {SqlFormatter, TokenizerConfig} from "../../formatter";
import {Ast} from "../ast";
import {toSql} from "./to-sql";
import {Sqlfier} from "../sqlfier";

/**
 * Converts an AST to a SQL string.
 *
 * Prettifies the output.
 *
 * -----
 *
 * Perfomance is generally "okay" but when queries become
 * hundreds of thousands of characters long,
 * it can take a long time.
 *
 * Use this with caution.
 *
 * @param ast
 */
export function toSqlPretty (
    ast : Ast,
    sqlfier : Sqlfier,
    tokenizerConfig : (
        /**
         * `stringTypes` must be set because it's too dangerous
         * to leave it at the default settings.
         *
         * MySQL uses `'\\'` to represent a single backslash character.
         * PostgreSQL and SQLite use `'\'` to represent a single backslash character.
         */
        & Partial<TokenizerConfig>
        & { stringTypes : TokenizerConfig["stringTypes"] }
    )
) : string {
    const sql = toSql(ast, sqlfier);
    return new SqlFormatter(
        undefined,
        tokenizerConfig
    ).format(sql);
}
