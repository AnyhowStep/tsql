import {IExprSelectItem} from "../../../expr-select-item";
import {Column} from "../../column-impl";

export type FromExprSelectItem<ExprSelectItemT extends IExprSelectItem> = (
    ExprSelectItemT extends IExprSelectItem ?
    Column<{
        tableAlias : ExprSelectItemT["tableAlias"],
        columnAlias : ExprSelectItemT["alias"],
        mapper : ExprSelectItemT["mapper"]
    }> :
    never
);
export function fromExprSelectItem<ExprSelectItemT extends IExprSelectItem> (
    exprSelectItem : ExprSelectItemT
) : FromExprSelectItem<ExprSelectItemT> {
    const result : (
        Column<{
            tableAlias : ExprSelectItemT["tableAlias"],
            columnAlias : ExprSelectItemT["alias"],
            mapper : ExprSelectItemT["mapper"]
        }>
    ) = new Column(
        {
            tableAlias : exprSelectItem.tableAlias,
            columnAlias : exprSelectItem.alias,
            mapper : exprSelectItem.mapper,
        },
        exprSelectItem.unaliasedAst
    );
    return result as FromExprSelectItem<ExprSelectItemT>;
}
