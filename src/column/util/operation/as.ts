import {IColumn} from "../../column";
import {buildAst} from "./build-ast";
import {UsedRefUtil} from "../../../used-ref";
import {AliasedExpr} from "../../../aliased-expr";

export type As<ColumnT extends IColumn, AliasT extends string> =
    AliasedExpr<{
    //IExprSelectItem<{
        mapper : ColumnT["mapper"];

        /**
         * Consider the following.
         * ```ts
         *  const table = tsql.table(
         *      "table",
         *      {
         *          x : tm.mysql.boolean(),
         *          y : tm.mysql.varChar(),
         *          z : tm.mysql.boolean(),
         *      }
         *  );
         *
         *  tsql.from(table)
         *      .select(c => [c.z.as("x")])
         *      .having(c => c.x)
         * ```
         *
         * `c.x` in the `HAVING` clause is now ambiguous!
         *
         * Is it `c.z AS x`? Or regular `c.x`?
         *
         * Because of this, you cannot alias to something that hides
         * a column in the FROM/JOIN clauses.
         *
         * -----
         *
         * At the moment, we don't allow the `tableAlias` to change
         * to lower the probability of hiding.
         */
        tableAlias : ColumnT["tableAlias"];
        alias : AliasT;

        usedRef : UsedRefUtil.FromColumn<ColumnT>;
        isAggregate : false;
    }>
;
export function as<ColumnT extends IColumn, AliasT extends string> (
    column : ColumnT,
    alias : AliasT
) : As<ColumnT, AliasT> {
    return new AliasedExpr(
        {
            usedRef : UsedRefUtil.fromColumn(column),
            mapper : column.mapper,
            tableAlias : column.tableAlias,
            alias : alias,
            isAggregate : false,
        },
        buildAst(column)
    );
    /*
    return {
        usedRef : UsedRefUtil.fromColumn(column),
        mapper : column.mapper,
        tableAlias : column.tableAlias,
        alias : alias,
        unaliasedAst : buildAst(column),
    };
    */
}
