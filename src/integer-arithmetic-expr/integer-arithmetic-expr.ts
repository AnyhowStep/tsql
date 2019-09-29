/**
 * Any type with this tag supports scalar integer arithmetic.
 *
 * @todo Monitor this PR
 *
 * https://github.com/microsoft/TypeScript/pull/33290
 */
export type CustomIntegerArithmeticExpr = { dbIntegerArithmetic : void };

/**
 * These types can be used with arithmetic operators like,
 * + Addition
 * + Subtraction
 * + Multiplication
 * + Integer Division
 * + Integer Remainder
 * + Unary Minus
 *
 * It is not necessary for the type to support,
 * + Fractional Division
 *
 * The result of arithmetic operations should always result in an integer number,
 * no fractional parts allowed.
 *
 * Examples of non-scalar arithmetic expressions,
 * + Complex numbers
 * + Quaternions
 */
export type IntegerArithmeticExpr = bigint|CustomIntegerArithmeticExpr;
