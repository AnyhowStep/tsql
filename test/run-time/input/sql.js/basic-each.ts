import * as sql from "./sql";
import * as tape from "tape";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const sqlite = await sql.initSqlJs();
    const db = new sqlite.Database();
    let callCount = 0;
    const returnValue = db.each(
        `
            SELECT 1 AS x, 2 AS y
            UNION
            SELECT 3, 4
            UNION
            SELECT 5, 6
            UNION
            SELECT $arg0, $arg1
        `,
        {
            $arg0 : 7,
            $arg1 : 8,
        },
        (row) => {
            t.deepEqual(Number(row.x)+1, row.y);
            ++callCount;
        },
        () => {
            t.deepEqual(callCount, 4);
            ++callCount;
        }
    );
    t.deepEqual(callCount, 5);

    t.deepEqual(returnValue, undefined);

    t.end();
});
