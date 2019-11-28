import * as tm from "type-mapping";
import {AnyBuiltInExpr} from "../../raw-expr";
import {BuiltInValueExpr} from "../../../built-in-value-expr";
import {IExpr} from "../../../expr";
import {IColumn} from "../../../column";
import {IExprSelectItem} from "../../../expr-select-item";
import {QueryBaseUtil} from "../../../query-base";

export type TypeOf<RawExprT extends AnyBuiltInExpr> = (
    RawExprT extends BuiltInValueExpr ?
    RawExprT :
    RawExprT extends IExpr ?
    tm.OutputOf<RawExprT["mapper"]> :
    RawExprT extends IColumn ?
    tm.OutputOf<RawExprT["mapper"]> :
    RawExprT extends QueryBaseUtil.OneSelectItem<unknown> & QueryBaseUtil.ZeroOrOneRow ?
    QueryBaseUtil.TypeOf<RawExprT> :
    RawExprT extends IExprSelectItem ?
    tm.OutputOf<RawExprT["mapper"]> :
    never
);
