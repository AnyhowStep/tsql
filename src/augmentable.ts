/**
 * All augmentable types go here.
 *
 * Libraries/applications should use declaration merging to modify these types,
 * which will affect this library's behaviour.
 *
 * https://github.com/microsoft/TypeScript/issues/18877#issuecomment-476921038
 */

/**
 * Each type here can be casted to a `DECIMAL` "most of the time".
 * When it cannot be casted to a `DECIMAL`, it should throw and not return `null`.
 */
export interface CustomDecimalCastableTypeMap {

}

/**
 * Each type here has comparison operators implemented for it.
 *
 * Comparison operators include,
 * + less than
 * + less than or equal
 * + greater than
 * + greater than or equal
 * + BETWEEN
 * + etc.
 */
export interface CustomComparableTypeMap {

}
