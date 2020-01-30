import * as tm from "type-mapping";
import {IExprSelectItem} from "../../expr-select-item";
import {IUsedRef} from "../../../used-ref";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WithTypeImpl<
    TypeT,
    TableAliasT extends string,
    AliasT extends string,
    UsedRefT extends IUsedRef,
    IsAggregateT extends boolean,
> = (
    IExprSelectItem<{
        mapper : tm.SafeMapper<TypeT>,
        tableAlias : TableAliasT,
        alias : AliasT,

        usedRef : UsedRefT,
        isAggregate : IsAggregateT,
    }>
);
/**
 * Used to replace the type of an `IExprSelectItem`
 */
export type WithType<
    ExprSelectItemT extends IExprSelectItem,
    TypeT
> = (
    ExprSelectItemT extends IExprSelectItem ?
    WithTypeImpl<
        TypeT,
        ExprSelectItemT["tableAlias"],
        ExprSelectItemT["alias"],
        ExprSelectItemT["usedRef"],
        ExprSelectItemT["isAggregate"]
    > :
    never
);
export function withType<
    ExprSelectItemT extends IExprSelectItem,
    TypeT
> (
    {
        tableAlias,
        alias,
        usedRef,
        unaliasedAst,
        isAggregate,
    } : ExprSelectItemT,
    newMapper : tm.SafeMapper<TypeT>
) : (
    WithType<ExprSelectItemT, TypeT>
) {
    const result : IExprSelectItem = {
        mapper : newMapper,
        tableAlias,
        alias,
        usedRef,
        isAggregate,

        unaliasedAst,
    };
    return result as WithType<ExprSelectItemT, TypeT>;
}
