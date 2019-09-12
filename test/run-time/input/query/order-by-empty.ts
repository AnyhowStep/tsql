import * as tape from "tape";
import * as tsql from "../../../../dist";
import {compareSqlPretty} from "../../../compare-sql-pretty";

tape(__filename, t => {
    const query = tsql.select(() => [tsql.pi().as("pi")])
        .orderBy(() => []);

    compareSqlPretty(__filename, t, query);

    t.end();
});
