import * as tm from "type-mapping";
import * as DataTypeUtil from "../util";
import {DataType} from "../data-type-impl";
import {Decimal} from "../../decimal";
import * as ExprLib from "../../expr-library";

export function makeDecimalDataType (
    mapperFactory : (
        /**
         * + PostgreSQL's min precision is `1`
         * + MySQL's max precision is `65`
         */
        precision : number|bigint,
        /**
         * + The min scale is `0`.
         * + MySQL's max scale is `30`.
         * + `scale` must be <= `precision`.
         */
        scale : number|bigint
    ) => tm.SafeMapper<Decimal>
) : (
    (
        /**
         * + PostgreSQL's min precision is `1`
         * + MySQL's max precision is `65`
         */
        precision : number|bigint,
        /**
         * + The min scale is `0`.
         * + MySQL's max scale is `30`.
         * + `scale` must be <= `precision`.
         */
        scale : number|bigint,
        extraMapper? : tm.Mapper<Decimal, Decimal>
    ) => DataType<Decimal>
) {
    return (
        /**
         * + PostgreSQL's min precision is `1`
         * + MySQL's max precision is `65`
         */
        precision : number|bigint,
        /**
         * + The min scale is `0`.
         * + MySQL's max scale is `30`.
         * + `scale` must be <= `precision`.
         */
        scale : number|bigint,
        extraMapper? : tm.Mapper<Decimal, Decimal>
    ) => DataTypeUtil.makeDataType(
        mapperFactory(precision, scale),
        value => ExprLib.decimalLiteral(
            value,
            precision,
            scale
        ),
        /**
         * We consider +0 and -0 to be the same
         */
        (a, b) => {
            if (a === b) {
                //Early-exit
                return true;
            }
            if (a.toString() === b.toString()) {
                //Early-exit
                return true;
            }

            const parsedA = tm.FixedPointUtil.tryParse(a.toString());
            if (parsedA == undefined) {
                /**
                 * This should never happen...
                 */
                throw new Error(`Invalid DECIMAL a found`);
            }
            const parsedB = tm.FixedPointUtil.tryParse(b.toString());
            if (parsedB == undefined) {
                /**
                 * This should never happen...
                 */
                throw new Error(`Invalid DECIMAL b found`);
            }

            return tm.FixedPointUtil.isEqual(
                parsedA,
                parsedB,
                tm.FixedPointUtil.ZeroEqualityAlgorithm.NEGATIVE_AND_POSITIVE_ZERO_ARE_EQUAL
            );
        },
        extraMapper
    );
}

/**
 * Fixed-point number.
 *
 * + MySQL      : `DECIMAL(p, s)`
 * + PostgreSQL : `DECIMAL(p, s)`
 * + SQLite     : -NA-; Should be emulated using `TEXT` and custom functions.
 *
 * @param precision
 * + MySQL's max precision is `65`
 * + PostgreSQL's min precision is `1`
 *
 * @param scale
 * + MySQL's max scale is `30`.
 * + The min scale is `0`.
 * + `scale` must be <= `precision`.
 *
 * @param extraMapper
 */
export const dtDecimal = makeDecimalDataType(tm.mysql.decimal);
