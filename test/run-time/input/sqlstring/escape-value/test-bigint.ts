import * as tsql from "../../../../../dist";
import * as tape from "tape";

tape(__filename, t => {
    const bigInt = BigInt("31415926535897932384626433832795028841971693993751");
    const escaped = tsql.escapeValue(bigInt);

    t.deepEqual(escaped, "31415926535897932384626433832795028841971693993751");

    t.end();
});

tape(__filename, t => {
    const bigInt = 31415926535897932384626433832795028841971693993751n;
    const escaped = tsql.escapeValue(bigInt);

    t.deepEqual(escaped, "31415926535897932384626433832795028841971693993751");

    t.end();
});
