import {IColumn} from "../../column";
import {IExprSelectItem} from "../../../expr-select-item";
import {buildAst} from "./build-ast";
import {UsedRefUtil} from "../../../used-ref";

export type As<ColumnT extends IColumn, AliasT extends string> = (
    IExprSelectItem<{
        mapper : ColumnT["mapper"];

        /*
            Consider the following.

            const table = o.table(
                "table",
                {
                    x : o.boolean(),
                    y : sd.string(),
                    z : o.boolean(),
                }
            );

            o.from(table)
                .select(c => [c.z.as("x")])
                .having(c => c.x)

            c.x in the HAVING clause is now ambiguous!

            Is it c.z AS x? Or regular c.x?

            Because of this, you cannot alias to something that hides
            a column in the FROM/JOIN clauses.
        */
        tableAlias : ColumnT["tableAlias"];
        alias : AliasT;

        usedRef : UsedRefUtil.FromColumn<ColumnT>;
    }>
);
export function as<ColumnT extends IColumn, AliasT extends string> (
    column : ColumnT,
    alias : AliasT
) : As<ColumnT, AliasT> {
    return {
        usedRef : UsedRefUtil.fromColumn(column),
        mapper : column.mapper,
        tableAlias : column.tableAlias,
        alias : alias,
        unaliasedAst : buildAst(column),
    };
}
