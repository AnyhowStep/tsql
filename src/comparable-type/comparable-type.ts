import {BuiltInValueExpr} from "../built-in-value-expr";
import {Decimal} from "../decimal";

/**
 * Any type with this tag is comparable.
 *
 * @todo Monitor this PR
 *
 * https://github.com/microsoft/TypeScript/pull/33290
 */
export type CustomComparableType = { dbEquatable : void, dbComparable : void };

/**
 * These types support the following operators,
 * + Greater Than
 * + Greater Than or Equal to
 * + Less Than
 * + Less Than or Equal to
 * + Equal to
 * + Not Equal to
 */
export type ComparableType = BuiltInValueExpr|Decimal|CustomComparableType;
export type NonNullComparableType = Exclude<ComparableType, null>;
