import * as tm from "type-mapping";
import * as DataTypeUtil from "../util";
import {DataType} from "../data-type-impl";

const equals = tm.ArrayBufferUtil.equals;

export function makeBlobDataType (
    mapperFactory : {
        (desiredLengthMin : number, desiredLengthMax : number) : tm.FluentMapper<tm.SafeMapper<Uint8Array>>,
        (desiredLengthMax : number) : tm.FluentMapper<tm.SafeMapper<Uint8Array>>,
        () : tm.FluentMapper<tm.SafeMapper<Uint8Array>>,
        maxLength : number,
    }
) : (
    {
        (desiredLengthMin : number, desiredLengthMax : number, extraMapper? : tm.Mapper<Uint8Array, Uint8Array>) : DataType<Uint8Array>,
        (desiredLengthMax : number, extraMapper? : tm.Mapper<Uint8Array, Uint8Array>) : DataType<Uint8Array>,
        (extraMapper? : tm.Mapper<Uint8Array, Uint8Array>) : DataType<Uint8Array>,
        maxLength : number,
    }
) {
    const result = (a? : unknown, b? : unknown, c? : unknown) => {
        if (c != undefined) {
            return DataTypeUtil.makeDataType(
                mapperFactory(a as number, b as number),
                value => value,
                equals,
                c as any
            );
        } else if (b != undefined) {
            if (typeof b == "number") {
                return DataTypeUtil.makeDataType(
                    mapperFactory(a as number, b),
                    value => value,
                    equals,
                );
            } else {
                return DataTypeUtil.makeDataType(
                    mapperFactory(a as number),
                    value => value,
                    equals,
                    b as any
                );
            }
        } else if (a != undefined) {
            if (typeof a == "number") {
                return DataTypeUtil.makeDataType(
                    mapperFactory(a),
                    value => value,
                    equals,
                );
            } else {
                return DataTypeUtil.makeDataType(
                    mapperFactory(),
                    value => value,
                    equals,
                    a as any
                );
            }
        } else {
            return DataTypeUtil.makeDataType(
                mapperFactory(),
                value => value,
                equals,
            );
        }
    };
    result.maxLength = mapperFactory.maxLength;
    return result;
}

/**
 * + MySQL      : `BINARY`
 * + PostgreSQL : `bytea`
 * + SQLite     : `BLOB`
 *
 *
 * This corresponds to MySQL's `BINARY` data type.
 * + Max length: `255`; `(2^8)-1`
 */
export const dtBinary = makeBlobDataType(tm.mysql.uint8ArrayBinary);

/**
 * + MySQL      : `VARBINARY`
 * + PostgreSQL : `bytea`
 * + SQLite     : `BLOB`
 *
 *
 * This corresponds to MySQL's `VARBINARY` data type.
 * + Max length: `65,535`; `(2^16)-1`
 */
export const dtVarBinary = makeBlobDataType(tm.mysql.uint8ArrayBinary);

/**
 * Short for "Binary Large OBject"
 *
 * + MySQL      : `TINY BLOB`
 * + PostgreSQL : `bytea`
 * + SQLite     : `BLOB`
 *
 *
 * This corresponds to MySQL's `TINY BLOB` data type.
 * + Max length: `255`; `(2^8)-1`
 */
export const dtTinyBlob = makeBlobDataType(tm.mysql.uint8ArrayTinyBlob);

/**
 * Short for "Binary Large OBject"
 *
 * + MySQL      : `BLOB`
 * + PostgreSQL : `bytea`
 * + SQLite     : `BLOB`
 *
 *
 * This corresponds to MySQL's `BLOB` data type.
 * + Max length: `65,535`; `(2^16)-1`
 */
export const dtBlob = makeBlobDataType(tm.mysql.uint8ArrayBlob);

/**
 * Short for "Binary Large OBject"
 *
 * + MySQL      : `MEDIUM BLOB`
 * + PostgreSQL : `bytea`
 * + SQLite     : `BLOB`
 *
 *
 * This corresponds to MySQL's `MEDIUM BLOB` data type.
 * + Max length: `16,777,215`; `(2^24)-1`
 */
export const dtMediumBlob = makeBlobDataType(tm.mysql.uint8ArrayMediumBlob);

/**
 * Short for "Binary Large OBject"
 *
 * + MySQL      : `LONG BLOB`
 * + PostgreSQL : `LO` (Large Object)
 * + SQLite     : `BLOB`
 *
 *
 * This corresponds to MySQL's `LONG BLOB` data type.
 * + Max length: `4,294,967,295`; `(2^32)-1`
 *
 * -----
 *
 * `bytea` supports up to 1GB. So, we cannot use `bytea`.
 *
 * https://dba.stackexchange.com/questions/127270/what-are-the-limits-of-postgresqls-large-object-facility
 * > A large object cannot exceed 4TB for PostgreSQL 9.3 or newer, or 2GB for older versions.
 * > This is based on the [release notes](https://www.postgresql.org/docs/9.3/release-9-3.html)
 *
 * From the release notes,
 * > Increase the maximum size of large objects from 2GB to 4TB (Nozomi Anzai, Yugo Nagata)
 *
 * -----
 *
 * SQLite `BLOB` goes up to `(2^31)-1`
 * https://www.sqlite.org/limits.html
 *
 * > The current implementation will only support a string or BLOB length up to `(2^31)-1` or `2,147,483,647`
 */
export const dtLongBlob = makeBlobDataType(tm.mysql.uint8ArrayLongBlob);
