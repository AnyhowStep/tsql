import * as tm from "type-mapping";
import {AnyRawExpr} from "../../raw-expr";
import {PrimitiveExpr} from "../../../primitive-expr";
import {IExpr} from "../../../expr";
import {IColumn} from "../../../column";
import {IExprSelectItem} from "../../../expr-select-item";
import {QueryBaseUtil} from "../../../query-base";

export type TypeOf<RawExprT extends AnyRawExpr> = (
    RawExprT extends PrimitiveExpr ?
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
