import {escapeIdentifier} from "../../../sqlstring";
import {IColumn} from "../../column";
import {ALIASED, SEPARATOR} from "../../../constants";

/**
 * **THIS FUNCTON SHOULD NOT BE USED**
 *
 * Instead, each `clause` should build its own AST.
 *
 * A column in the `SELECT` clause will have a different AST
 * from the same column in the `ORDER BY` clause.
 *
 * @deprecated
 */
export function buildAst (
    {
        tableAlias,
        columnAlias,
        unaliasedAst,
    } : IColumn
) : string {
    if (tableAlias == ALIASED) {
        /**
         * When you want to write,
         * `(1 + 2) AS three`
         *
         * You write,
         * `add(1, 2).as("three")`
         *
         * This `"three"` is an `IExprSelectItem` but has no `tableAlias`
         * associated with it.
         *
         * So, this library makes up a table alias that is very
         * unlikely to be used naturally by others.
         *
         * The table alias is the value of the variable `ALIASED`,
         * which should be `__aliased`
         */
        return escapeIdentifier(`${tableAlias}${SEPARATOR}${columnAlias}`);
    } else {
        if (unaliasedAst != undefined) {
            throw new Error(`Should use unaliasedAst, tableAlias, columnAlias in SELECT clause, use tableAlias, columnAlias in ORDER BY clause`);
            //return escapeIdentifier(`${tableAlias}${SEPARATOR}${columnAlias}`);
        } else {
            /*
                The most common case, I think.
            */
            return (
                escapeIdentifier(tableAlias) +
                "." +
                escapeIdentifier(columnAlias)
            );
        }
    }
}
