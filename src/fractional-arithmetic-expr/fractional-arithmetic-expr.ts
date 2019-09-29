import {Decimal} from "../decimal";

/**
 * Any type with this tag supports scalar fractional arithmetic.
 *
 * @todo Monitor this PR
 *
 * https://github.com/microsoft/TypeScript/pull/33290
 */
export type CustomFractionalArithmeticExpr = { dbFractionalArithmetic : void };

/**
 * These types can be used with arithmetic operators like,
 * + Addition
 * + Subtraction
 * + Multiplication
 * + Integer Division
 * + Integer Remainder
 * + Unary Minus
 * + Fractional Division
 *
 * Examples of non-scalar arithmetic expressions,
 * + Complex numbers
 * + Quaternions
 */
export type FractionalArithmeticExpr = number|Decimal|CustomFractionalArithmeticExpr;
