import * as tm from "type-mapping";
import {AnyBuiltInExpr} from "../../raw-expr";
import {BuiltInValueExpr} from "../../../built-in-value-expr";
import {IExpr} from "../../../expr";
import {IColumn} from "../../../column";
import {IExprSelectItem} from "../../../expr-select-item";
import {QueryBaseUtil} from "../../../query-base";

export type TypeOf<BuiltInExprT extends AnyBuiltInExpr> = (
    BuiltInExprT extends BuiltInValueExpr ?
    BuiltInExprT :
    BuiltInExprT extends IExpr ?
    tm.OutputOf<BuiltInExprT["mapper"]> :
    BuiltInExprT extends IColumn ?
    tm.OutputOf<BuiltInExprT["mapper"]> :
    BuiltInExprT extends QueryBaseUtil.OneSelectItem<unknown> & QueryBaseUtil.ZeroOrOneRow ?
    QueryBaseUtil.TypeOf<BuiltInExprT> :
    BuiltInExprT extends IExprSelectItem ?
    tm.OutputOf<BuiltInExprT["mapper"]> :
    never
);
