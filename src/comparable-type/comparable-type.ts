import {BuiltInValueExpr} from "../built-in-value-expr";
import {Decimal} from "../decimal";
import {CustomComparableTypeMap} from "../augmentable";

export type CustomComparableType = CustomComparableTypeMap[keyof CustomComparableTypeMap];

/**
 * These types support the following operators,
 * + Greater Than
 * + Greater Than or Equal to
 * + Less Than
 * + Less Than or Equal to
 * + Equal to
 * + Not Equal to
 */
export type ComparableType =
    | BuiltInValueExpr
    | Decimal
    | CustomComparableType
;

export type NonNullComparableType = Exclude<ComparableType, null>;
