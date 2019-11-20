import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";

tape(__filename, async (t) => {
    const test = tsql.table("test")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned(),
        });

    t.throws(() => {
        tsql.TableUtil.assertHasCandidateKey(test);
    });

    t.end();
});
