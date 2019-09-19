import * as tape from "tape";
import * as tsql from "../../../../dist";
import {compareSqlPretty} from "../../../compare-sql-pretty";

tape(__filename, t => {
    const query = tsql.select(() => [tsql.double.pi().as("pi")])
        .orderBy(c => [
            c.pi,
            c.pi.asc(),
            c.pi.desc(),
            tsql.isNotNull(c.pi),
            tsql.isNotNull(c.pi).asc(),
            tsql.isNotNull(c.pi).desc(),
            tsql.isNotNull(c.pi).as("someName"),
            tsql.isNotNull(c.pi).as("someName").asc(),
            tsql.isNotNull(c.pi).as("someName").desc()
        ]);

    compareSqlPretty(__filename, t, query);

    t.end();
});
