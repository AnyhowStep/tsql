import * as tape from "tape";
import * as tsql from "../../../../dist";
import {compareSqlPretty} from "../../../compare-sql-pretty";

tape(__filename, t => {
    const query = tsql.selectValue(() => tsql.unsafeCastAsDecimal(
        tsql.selectValue(() => tsql.decimalLiteral("1.234", 10, 4)),
        42,
        10
    ));

    compareSqlPretty(__filename, t, query);

    t.end();
});
