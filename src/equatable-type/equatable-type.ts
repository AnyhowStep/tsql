/**
 * @todo Split this into,
 * + `EquatableExpr`
 * + `SortableExpr`
 *
 * + A `SortableExpr` is an `EquatableExpr`
 * + A `EquatableExpr` may not be a `SortableExpr`
 */
import {PrimitiveExpr} from "../primitive-expr";
import {Decimal} from "../decimal";

/**
 * Any type with this tag is comparable.
 *
 * @todo Monitor this PR
 *
 * https://github.com/microsoft/TypeScript/pull/33290
 */
export type CustomEquatableType = { dbEquatable : void };

/**
 * These types can be compared against using operators like,
 * + Greater Than
 * + Greater Than or Equal to
 * + Less Than
 * + Less Than or Equal to
 * + Equal to
 * + Not Equal to
 */
export type EquatableType = PrimitiveExpr|Decimal|CustomEquatableType;
export type NonNullEquatableType = Exclude<EquatableType, null>;
