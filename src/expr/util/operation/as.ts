import {IExpr} from "../../expr";
import {ALIASED} from "../../../constants";
import {AliasedExpr} from "../../../aliased-expr";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type AsImpl<
    AliasT extends string,
    MapperT extends IExpr["mapper"],
    UsedRefT extends IExpr["usedRef"]
> = (
    AliasedExpr<{
        mapper : MapperT,
        tableAlias : typeof ALIASED,
        alias : AliasT,
        usedRef : UsedRefT,
    }>
);
export type As<ExprT extends IExpr, AliasT extends string> = (
    AsImpl<
        AliasT,
        ExprT["mapper"],
        ExprT["usedRef"]
    >
);
export function as<ExprT extends IExpr, AliasT extends string> (
    expr : ExprT,
    alias : AliasT
) : As<ExprT, AliasT> {
    const result : As<ExprT, AliasT> = new AliasedExpr(
        {
            mapper : expr.mapper,
            tableAlias : ALIASED,
            alias,
            usedRef : expr.usedRef,
        },
        expr.ast
    );
    return result;
}
