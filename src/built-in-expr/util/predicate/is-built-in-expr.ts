import {AnyBuiltInExpr} from "../../built-in-expr";
import {BuiltInValueExprUtil} from "../../../built-in-value-expr";
import {isAnyNonValueExpr} from "./is-any-non-value-expr";

export function isBuiltInExpr (raw : unknown) : raw is AnyBuiltInExpr {
    return (
        BuiltInValueExprUtil.isBuiltInValueExpr(raw) ||
        isAnyNonValueExpr(raw)
    );
}
