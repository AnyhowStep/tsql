import {IExprSelectItem} from "../../../expr-select-item";
import {ExprColumn} from "../../../expr-column";

export type FromExprSelectItem<ExprSelectItemT extends IExprSelectItem> = (
    ExprSelectItemT extends IExprSelectItem ?
    ExprColumn<{
        tableAlias : ExprSelectItemT["tableAlias"],
        columnAlias : ExprSelectItemT["alias"],
        mapper : ExprSelectItemT["mapper"],
        isAggregate : ExprSelectItemT["isAggregate"],
    }> :
    never
);
export function fromExprSelectItem<ExprSelectItemT extends IExprSelectItem> (
    exprSelectItem : ExprSelectItemT
) : FromExprSelectItem<ExprSelectItemT> {
    const result : (
        ExprColumn<{
            tableAlias : ExprSelectItemT["tableAlias"],
            columnAlias : ExprSelectItemT["alias"],
            mapper : ExprSelectItemT["mapper"],
            isAggregate : ExprSelectItemT["isAggregate"],
        }>
    ) = new ExprColumn(
        {
            tableAlias : exprSelectItem.tableAlias,
            columnAlias : exprSelectItem.alias,
            mapper : exprSelectItem.mapper,
            isAggregate : exprSelectItem.isAggregate,
        },
        exprSelectItem.unaliasedAst
    );
    return result as FromExprSelectItem<ExprSelectItemT>;
}
