import * as tm from "type-mapping";
import * as DataTypeUtil from "../util";
import {DataType} from "../data-type-impl";

export function makeBlobDataType (
    mapperFactory : {
        (desiredLengthMin : number, desiredLengthMax : number) : tm.FluentMapper<tm.SafeMapper<Buffer>>,
        (desiredLengthMax : number) : tm.FluentMapper<tm.SafeMapper<Buffer>>,
        () : tm.FluentMapper<tm.SafeMapper<Buffer>>,
        maxLength : number,
    }
) : (
    {
        (desiredLengthMin : number, desiredLengthMax : number, extraMapper? : tm.Mapper<Buffer, Buffer>) : DataType<Buffer>,
        (desiredLengthMax : number, extraMapper? : tm.Mapper<Buffer, Buffer>) : DataType<Buffer>,
        (extraMapper? : tm.Mapper<Buffer, Buffer>) : DataType<Buffer>,
        maxLength : number,
    }
) {
    const result = (a? : unknown, b? : unknown, c? : unknown) => {
        if (c != undefined) {
            return DataTypeUtil.makeDataType(
                mapperFactory(a as number, b as number),
                value => value,
                (a, b) => a.equals(b),
                c as any
            );
        } else if (b != undefined) {
            if (typeof b == "number") {
                return DataTypeUtil.makeDataType(
                    mapperFactory(a as number, b),
                    value => value,
                    (a, b) => a.equals(b)
                );
            } else {
                return DataTypeUtil.makeDataType(
                    mapperFactory(a as number),
                    value => value,
                    (a, b) => a.equals(b),
                    b as any
                );
            }
        } else if (a != undefined) {
            if (typeof a == "number") {
                return DataTypeUtil.makeDataType(
                    mapperFactory(a),
                    value => value,
                    (a, b) => a.equals(b)
                );
            } else {
                return DataTypeUtil.makeDataType(
                    mapperFactory(),
                    value => value,
                    (a, b) => a.equals(b),
                    a as any
                );
            }
        } else {
            return DataTypeUtil.makeDataType(
                mapperFactory(),
                value => value,
                (a, b) => a.equals(b)
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
export const dtBinary = makeBlobDataType(tm.mysql.binary);

/**
 * + MySQL      : `VARBINARY`
 * + PostgreSQL : `bytea`
 * + SQLite     : `BLOB`
 *
 *
 * This corresponds to MySQL's `VARBINARY` data type.
 * + Max length: `65,535`; `(2^16)-1`
 */
export const dtVarBinary = makeBlobDataType(tm.mysql.varBinary);

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
export const dtTinyBlob = makeBlobDataType(tm.mysql.tinyBlob);

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
export const dtBlob = makeBlobDataType(tm.mysql.blob);

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
export const dtMediumBlob = makeBlobDataType(tm.mysql.mediumBlob);

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
 * Realistically, SQLite should support this,
 * https://www.sqlite.org/limits.html
 *
 * However, it is possible that the underlying implementation
 * may be restricted from having a `Buffer` of that length.
 */
export const dtLongBlob = makeBlobDataType(tm.mysql.longBlob);
