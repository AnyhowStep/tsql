import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";

tape(__filename, async (t) => {
    const test = tsql.table("test")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntSigned(),
            testVal2 : tm.mysql.bigIntSigned().orNull(),
        })
        .setAutoIncrement(columns => columns.testId);

    const result = tsql.SchemaValidationUtil.validateColumn(
        test,
        test.columns.testVal,
        {
            columnAlias : "testVall",
            isNullable : false,
            isAutoIncrement : false,
            generationExpression : "99",
            explicitDefaultValue : undefined,
        }
    );
    t.deepEqual(result.warnings, []);
    t.deepEqual(result.errors.length, 1);
    t.deepEqual(
        result.errors[0],
        {
            type : tsql.SchemaValidationErrorType.COLUMN_ALIAS_MISMATCH,
            description : `Application column is named "test"."testVal", database column is named "test"."testVall"`,
            tableAlias : "test",
            applicationColumnAlias : "testVal",
            databaseColumnAlias : "testVall",
        }
    );

    t.end();
});
