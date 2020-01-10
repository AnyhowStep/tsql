import * as tsql from "../dist";
import {getAllTsFiles} from "./util";

export function unifiedTest (
    {
        tape,
        pool,
    } :
    {
        tape : typeof import("tape"),
        pool : tsql.IPool,
    }
) {
    const tsFiles = getAllTsFiles(
        `${__dirname}/input`,
        false
    );
    for (const tsFile of tsFiles) {
        console.log(tsFile);
        require(tsFile).test({tape, pool});
    }

    tape("pool.disconnect()", async (t) => {
        await pool.disconnect();

        t.end();
    });
}
