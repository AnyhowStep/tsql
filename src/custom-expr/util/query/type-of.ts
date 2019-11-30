import {AnyBuiltInExpr, BuiltInExprUtil} from "../../../built-in-expr";

export type TypeOf<CustomExprT extends unknown> =
    CustomExprT extends AnyBuiltInExpr ?
    BuiltInExprUtil.TypeOf<CustomExprT> :
    CustomExprT
;
