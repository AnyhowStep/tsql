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
        .setAutoIncrement(columns => columns.testId)
        .disableInsert()
        .addMutable(columns => [columns.testVal]);

    const result = tsql.SchemaValidationUtil.validateColumn(
        test,
        test.columns.testVal,
        {
            columnAlias : "testVal",
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
            type : tsql.SchemaValidationErrorType.COLUMN_GENERATED_ON_DATABASE_ONLY_UPDATE_WILL_FAIL,
            description : `Column "test"."testVal" is generated on database only; UPDATEs will fail`,
            tableAlias : "test",
            columnAlias : "testVal",
        }
    );

    t.end();
});
