import {PrimitiveExpr} from "../primitive-expr";
import {Decimal} from "../decimal";

/**
 * These types can be compared against using operators like,
 * + Greater Than
 * + Greater Than or Equal to
 * + Less Than
 * + Less Than or Equal to
 * + Equal to
 * + Not Equal to
 */
export type ComparableExpr = PrimitiveExpr|Decimal;
export type NonNullComparableExpr = Exclude<ComparableExpr, null>;
