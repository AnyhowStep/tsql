import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {dtPoint} from "../../dt-point";

tape(__filename, async (t) => {
    const test = tsql.table("test")
        .addColumns({
            testId : (name : string, mixed : unknown) => dtPoint(name, mixed),
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .addColumns({
            testId : (name : string, mixed : unknown) => dtPoint(name, mixed),
        })
        .setPrimaryKey(columns => [columns.testId]);

    if (tsql.DataTypeUtil.isDataType(test.columns.testId.mapper)) {
        const mapper = test.columns.testId.mapper;
        t.throws(() => {
            /**
             * This should throw because both `testId` mappers are just `function`,
             * and not `IDataType`, and the data type is `{x:number,y:number}`,
             * not a built-in value expr.
             */
            mapper.toBuiltInExpr_NonCorrelated({"x":1,"y":2});
        });
    } else {
        t.fail("Expected `testId.mapper` to be IDataType");
    }

    t.end();
});
