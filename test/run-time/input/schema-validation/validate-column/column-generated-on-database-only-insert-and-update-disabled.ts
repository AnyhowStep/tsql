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
        .disableInsert();

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
    t.deepEqual(result.warnings.length, 1);
    t.deepEqual(result.errors, []);
    t.deepEqual(
        result.warnings[0],
        {
            type : tsql.SchemaValidationWarningType.COLUMN_GENERATED_ON_DATABASE_ONLY_INSERT_AND_UPDATE_DISABLED,
            description : `Column "test"."testVal" is generated on database only; INSERTs and UPDATEs will fail but both are disabled`,
            tableAlias : "test",
            columnAlias : "testVal",
        }
    );

    t.end();
});
