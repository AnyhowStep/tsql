import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";
import {loopTest2} from "../../../../../loop-test";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("truncate", (x, y) => {
            if (typeof x == "number" && tm.TypeUtil.isBigInt(y)) {
                const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();
                if (tm.BigIntUtil.equal(y, BigInt(0))) {
                    return Math.trunc(x);
                } else if (tm.BigIntUtil.greaterThan(y, BigInt(0))) {
                    const integerPart = Math.trunc(x);
                    let fractionalPart = x - integerPart;
                    let div = 1;

                    if (fractionalPart == 0) {
                        return x;
                    }

                    for (let i=y; tm.BigIntUtil.greaterThan(i, 0); i=tm.BigIntUtil.sub(i, BigInt(1))) {
                        fractionalPart *= 10;
                        div *= 10;
                        if (Math.floor(fractionalPart) == fractionalPart) {
                            return integerPart + Math.trunc(fractionalPart) / div;
                        }
                    }
                    return integerPart + Math.trunc(fractionalPart) / div;
                } else {
                    let result = BigInt(Math.trunc(x));
                    for (let i=y; tm.BigIntUtil.lessThan(i, 0); i=tm.BigIntUtil.add(i, BigInt(1))) {
                        result = tm.BigIntUtil.div(result, BigInt(10));
                    }
                    if (tm.BigIntUtil.equal(result, BigInt(0))) {
                        return 0;
                    }
                    for (let i=y; tm.BigIntUtil.lessThan(i, 0); i=tm.BigIntUtil.add(i, BigInt(1))) {
                        result = tm.BigIntUtil.mul(result, BigInt(10));
                    }
                    return Number(result);
                }
            } else {
                throw new Error(`truncate(${typeof x}, ${typeof y}) not implmented`);
            }
        });
        await loopTest2(__filename, t, -6, 6, 0.25,
            (x, y) => {
                const d = tsql.signedBigIntLiteral(Math.trunc(y));
                return tsql.selectValue(() => tsql.double.truncate(x, d))
                    .fetchValue(connection);
            },
            (x, y) => {
                const decimalPlaces = Math.trunc(y);
                if (decimalPlaces == 0) {
                    const str = x.toString();
                    const dot = str.indexOf(".");
                    if (dot < 0) {
                        return {
                            shouldError : false,
                            value : x,
                        };
                    } else {
                        return {
                            shouldError : false,
                            value : parseFloat(str.substr(0, dot)),
                        };
                    }
                } else if (decimalPlaces > 0) {
                    const str = x.toString();
                    const dot = str.indexOf(".");
                    if (dot < 0) {
                        return {
                            shouldError : false,
                            value : x,
                        };
                    } else {
                        const decimals = str.substr(dot+1);
                        const truncatedDecimals = decimals.substr(0, decimalPlaces);
                        return {
                            shouldError : false,
                            value : (x < 0) ?
                                Math.trunc(x) - parseFloat("0." + truncatedDecimals) :
                                Math.trunc(x) + parseFloat("0." + truncatedDecimals),
                        };
                    }
                } else {
                    const integer = Math.trunc(x).toString();
                    const truncatedInteger = integer.substr(0, integer.length+decimalPlaces) + "0".repeat(-decimalPlaces);
                    return {
                        shouldError : false,
                        value : parseFloat(truncatedInteger),
                    };
                }
            }
        );
    });

    await pool.disconnect();
    t.end();
});
