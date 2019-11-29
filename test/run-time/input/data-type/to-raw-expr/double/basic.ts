import * as tape from "tape";
import * as tsql from "../../../../../../dist";

tape(__filename, async (t) => {
    t.deepEqual(
        tsql.DataTypeUtil.toBuiltInExpr_NonCorrelated(
            tsql.dtDouble(),
            1
        ),
        1
    );
    t.deepEqual(
        tsql.DataTypeUtil.toBuiltInExpr_NonCorrelated(
            tsql.dtDouble(),
            0
        ),
        0
    );
    t.deepEqual(
        tsql.DataTypeUtil.toBuiltInExpr_NonCorrelated(
            tsql.dtDouble(),
            3.141
        ),
        3.141
    );
    t.deepEqual(
        tsql.DataTypeUtil.toBuiltInExpr_NonCorrelated(
            tsql.dtDouble(),
            -1
        ),
        -1
    );

    t.end();
});
