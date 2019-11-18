import * as tm from "type-mapping";
import * as DataTypeUtil from "../util";
import {DataType} from "../data-type-impl";

export function makeIntegerDataType (
    mapper : tm.SafeMapper<bigint>
) : (
    (extraMapper? : tm.Mapper<bigint, bigint>) => DataType<bigint>
) {
    return (extraMapper? : tm.Mapper<bigint, bigint>) => DataTypeUtil.makeDataType(
        mapper,
        value => value,
        (a, b) => tm.TypeUtil.strictEqual(a, b),
        extraMapper
    );
}

/**
 * 1-byte integer.
 *
 * + MySQL      : `TINYINT SIGNED`
 * + PostgreSQL : `smallint`
 * + SQLite     : `INTEGER`
 *
 * This corresponds to MySQL's `TINYINT SIGNED` data type.
 * + Min: -128; `-(2^7)`
 * + Max:  127; `(2^7)-1`
 */
export const dtTinyIntSigned = makeIntegerDataType(tm.mysql.tinyIntSigned());

/**
 * 2-byte integer.
 *
 * + MySQL      : `SMALLINT SIGNED`
 * + PostgreSQL : `smallint`
 * + SQLite     : `INTEGER`
 *
 * This corresponds to MySQL's `SMALLINT SIGNED` data type.
 * + Min: -32,768; `-(2^15)`
 * + Max:  32,767; `(2^15)-1`
 */
export const dtSmallIntSigned = makeIntegerDataType(tm.mysql.smallIntSigned());

/**
 * 3-byte integer.
 *
 * + MySQL      : `MEDIUMINT SIGNED`
 * + PostgreSQL : `integer`
 * + SQLite     : `INTEGER`
 *
 * This corresponds to MySQL's `MEDIUMINT SIGNED` data type.
 * + Min: -8,388,608; `-(2^23)`
 * + Max:  8,388,607; `(2^23)-1`
 */
export const dtMediumIntSigned = makeIntegerDataType(tm.mysql.mediumIntSigned());

/**
 * 4-byte integer.
 *
 * + MySQL      : `INT SIGNED`
 * + PostgreSQL : `integer`
 * + SQLite     : `INTEGER`
 *
 * This corresponds to MySQL's `INT SIGNED` data type.
 * + Min: -2,147,483,648; `-(2^31)`
 * + Max:  2,147,483,647; `(2^31)-1`
 */
export const dtIntSigned = makeIntegerDataType(tm.mysql.intSigned());

/**
 * 8-byte integer.
 *
 * + MySQL      : `BIGINT SIGNED`
 * + PostgreSQL : `bigint`
 * + SQLite     : `INTEGER`
 *
 * This corresponds to MySQL's `BIGINT SIGNED` data type.
 * + Min: -9,223,372,036,854,775,808; `-(2^63)`
 * + Max:  9,223,372,036,854,775,807; `(2^63)-1`
 */
export const dtBigIntSigned = makeIntegerDataType(tm.mysql.bigIntSigned());
