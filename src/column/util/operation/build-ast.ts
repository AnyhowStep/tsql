import {IColumn} from "../../column";
import {ALIASED, SEPARATOR} from "../../../constants";
import {identifierNode, IdentifierNode} from "../../../ast";

export function buildAst (
    {
        tableAlias,
        columnAlias,
        unaliasedAst,
    } : IColumn
) : IdentifierNode {
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
         * which should be `$aliased`
         */
        return identifierNode(`${tableAlias}${SEPARATOR}${columnAlias}`);
    } else {
        if (unaliasedAst == undefined) {
            /*
                The most common case, I think.
            */
            return identifierNode(
                tableAlias,
                columnAlias
            );
        } else {
            /**
             * @todo Investigate what should be here.
             * Does the `SELECT` clause even ever have an `IColumn` with `unaliasedAst` set?
             * Initial inspection says "No"
             */
            //throw new Error(`Should use unaliasedAst, tableAlias, columnAlias in SELECT clause, use tableAlias, columnAlias in ORDER BY clause`);
            return identifierNode(`${tableAlias}${SEPARATOR}${columnAlias}`);
        }
    }
}
