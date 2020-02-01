import * as tsql from "../../../../../../dist";

tsql.inArray(1, [null]);
tsql.inArray(1, [1, null]);
tsql.inArray(1, [1, null, 2]);
tsql.inArray(1, [1, 2, null]);

const inListTable = tsql.table("inListTable")
    .addColumns({
        v : () => 1,
    });
tsql.inArray(
    1,
    [
        tsql.from(inListTable)
            .selectValue(columns => columns.v)
            .limit(1)
    ]
);

/**
 * No `FROM` clause
 */
tsql.inArray(
    1,
    [
        tsql.selectValue(() => 1)
    ]
);

/**
 * Uses `GROUP BY ()`
 */
tsql.inArray(
    1,
    [
        tsql.from(inListTable)
            .selectValue(columns => tsql.throwIfNull(tsql.double.max(columns.v)))
    ]
);

tsql.inArray(
    1,
    [
        tsql.selectValue(() => null)
    ]
);

tsql.inArray(
    1,
    [
        tsql.from(inListTable)
            .selectValue(columns => tsql.double.max(columns.v))
    ]
);
