import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";

tape(__filename, async (t) => {
    const test = tsql.table("test")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .setPrimaryKey(columns => [columns.testId]);

    t.true(tsql.TableUtil.isImplicitAutoIncrement(
        test,
        "testId"
    ));

    t.false(tsql.TableUtil.isImplicitAutoIncrement(
        test,
        "testVal"
    ));

    t.false(tsql.TableUtil.isImplicitAutoIncrement(
        test,
        "doesNotExist"
    ));

    t.end();
});
