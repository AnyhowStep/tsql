import * as tm from "type-mapping";
import * as DataTypeUtil from "../util";
import {DataType} from "../data-type-impl";

export function makeTextDataType (
    mapperFactory : {
        (desiredLengthMin : number, desiredLengthMax : number) : tm.FluentMapper<tm.SafeMapper<string>>,
        (desiredLengthMax : number) : tm.FluentMapper<tm.SafeMapper<string>>,
        () : tm.FluentMapper<tm.SafeMapper<string>>,
        maxLength : number,
    }
) : (
    {
        (desiredLengthMin : number, desiredLengthMax : number, extraMapper? : tm.Mapper<string, string>) : DataType<string>,
        (desiredLengthMax : number, extraMapper? : tm.Mapper<string, string>) : DataType<string>,
        (extraMapper? : tm.Mapper<string, string>) : DataType<string>,
        maxLength : number,
    }
) {
    const result = (a? : unknown, b? : unknown, c? : unknown) => {
        if (c != undefined) {
            return DataTypeUtil.makeDataType(
                mapperFactory(a as number, b as number),
                value => value,
                (a, b) => a === b,
                c as any
            );
        } else if (b != undefined) {
            if (typeof b == "number") {
                return DataTypeUtil.makeDataType(
                    mapperFactory(a as number, b),
                    value => value,
                    (a, b) => a === b
                );
            } else {
                return DataTypeUtil.makeDataType(
                    mapperFactory(a as number),
                    value => value,
                    (a, b) => a === b,
                    b as any
                );
            }
        } else if (a != undefined) {
            if (typeof a == "number") {
                return DataTypeUtil.makeDataType(
                    mapperFactory(a),
                    value => value,
                    (a, b) => a === b
                );
            } else {
                return DataTypeUtil.makeDataType(
                    mapperFactory(),
                    value => value,
                    (a, b) => a === b,
                    a as any
                );
            }
        } else {
            return DataTypeUtil.makeDataType(
                mapperFactory(),
                value => value,
                (a, b) => a === b
            );
        }
    };
    result.maxLength = mapperFactory.maxLength;
    return result;
}

/**
 * + MySQL      : `CHAR`
 * + PostgreSQL : `CHAR`
 * + SQLite     : `TEXT`
 *
 *
 * This corresponds to MySQL's `CHAR` data type.
 * + Max length: `255`; `(2^8)-1`
 */
export const dtChar = makeTextDataType(tm.mysql.char);

/**
 * + MySQL      : `VARCHAR`
 * + PostgreSQL : `VARCHAR`
 * + SQLite     : `TEXT`
 *
 *
 * This corresponds to MySQL's `VARCHAR` data type.
 * + Max length: `65,535`; `(2^16)-1`
 */
export const dtVarChar = makeTextDataType(tm.mysql.varChar);

/**
 * + MySQL      : `TINY TEXT`
 * + PostgreSQL : `text`
 * + SQLite     : `TEXT`
 *
 *
 * This corresponds to MySQL's `TINY TEXT` data type.
 * + Max length: `255`; `(2^8)-1`
 */
export const dtTinyText = makeTextDataType(tm.mysql.tinyText);

/**
 * + MySQL      : `TEXT`
 * + PostgreSQL : `text`
 * + SQLite     : `TEXT`
 *
 *
 * This corresponds to MySQL's `TEXT` data type.
 * + Max length: `65,535`; `(2^16)-1`
 */
export const dtText = makeTextDataType(tm.mysql.text);

/**
 * + MySQL      : `MEDIUM TEXT`
 * + PostgreSQL : `text`
 * + SQLite     : `TEXT`
 *
 *
 * This corresponds to MySQL's `MEDIUM TEXT` data type.
 * + Max length: `16,777,215`; `(2^24)-1`
 */
export const dtMediumText = makeTextDataType(tm.mysql.mediumText);

/**
 * + MySQL      : `LONG TEXT`
 * + PostgreSQL : -NA-
 * + SQLite     : `TEXT`
 *
 * This corresponds to MySQL's `LONG TEXT` data type.
 * + Max length: `4,294,967,295`; `(2^32)-1`
 *
 * -----
 *
 * `text` supports up to 1GB. So, we cannot use `text`.
 *
 * https://wiki.postgresql.org/wiki/FAQ#What_is_the_maximum_size_for_a_row.2C_a_table.2C_and_a_database.3F
 *
 * > Maximum size for a field? 1 GB
 *
 * -----
 *
 * Realistically, SQLite should support this,
 * https://www.sqlite.org/limits.html
 *
 * However, it is possible that the underlying implementation
 * may be restricted from having a `string` of that length.
 */
export const dtLongText = makeTextDataType(tm.mysql.longText);
