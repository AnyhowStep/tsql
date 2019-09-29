import {PrimitiveExpr} from "../primitive-expr";
import {Decimal} from "../decimal";

/**
 * Any type with this tag is equatable.
 *
 * @todo Monitor this PR
 *
 * https://github.com/microsoft/TypeScript/pull/33290
 */
export type CustomEquatableType = { dbEquatable : void };

/**
 * These types support the following operators,
 * + Equal to
 * + Not Equal to
 */
export type EquatableType = PrimitiveExpr|Decimal|CustomEquatableType;
export type NonNullEquatableType = Exclude<EquatableType, null>;
