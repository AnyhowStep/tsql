import {IExprSelectItem} from "../../../expr-select-item";

export type FromExprSelectItem<ExprSelectItemT extends Pick<IExprSelectItem, "tableAlias"|"alias">> = (
    ExprSelectItemT extends Pick<IExprSelectItem, "tableAlias"|"alias"> ?
    {
        readonly tableAlias : ExprSelectItemT["tableAlias"],
        readonly columnAlias : ExprSelectItemT["alias"],
    } :
    never
);
export function fromExprSelectItem<ExprSelectItemT extends Pick<IExprSelectItem, "tableAlias"|"alias">> (
    column : ExprSelectItemT
) : FromExprSelectItem<ExprSelectItemT> {
    const result : {
        readonly tableAlias : ExprSelectItemT["tableAlias"],
        readonly columnAlias : ExprSelectItemT["alias"],
    } = {
        tableAlias : column.tableAlias,
        columnAlias : column.alias,
    };
    return result as FromExprSelectItem<ExprSelectItemT>;
}
