import * as tm from "type-mapping";
import * as DataTypeUtil from "../util";
import {DataType} from "../data-type-impl";

export function makeDoubleDataType (
    mapper : tm.SafeMapper<number>
) : (
    (extraMapper? : tm.Mapper<number, number>) => DataType<number>
) {
    return (extraMapper? : tm.Mapper<number, number>) => DataTypeUtil.makeDataType(
        mapper,
        value => value,
        (a, b) => a === b,
        extraMapper
    );
}

/**
 * 8-byte floating point number.
 *
 * + MySQL      : `DOUBLE`
 * + PostgreSQL : `double precision`
 * + SQLite     : `REAL`
 */
export const dtDouble = makeDoubleDataType(tm.mysql.double());

/**
 * 4-byte floating point number.
 *
 * JS does not have a 4-byte floating point number type.
 * So, attempting to use `FLOAT` will cause a loss in precision.
 *
 * + MySQL      : `FLOAT`
 * + PostgreSQL : `real`
 * + SQLite     : `REAL`
 */
export const dtFloat = makeDoubleDataType(tm.mysql.float());
