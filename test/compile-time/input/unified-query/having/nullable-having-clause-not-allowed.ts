import * as tsql from "../../../../../dist";

/**
 * https://github.com/microsoft/TypeScript/issues/33143
 *
 * Seems like adding this test changes the error message of the `WHERE` clause test.
 */
export const query = tsql.QueryUtil.newInstance()
    .from(
            tsql
                .table("t")
                .addColumns({
                    x : tsql.dtBigIntSigned(),
                })
    )
    .groupBy(columns => [
        columns.x,
    ])
    .having(() => tsql.and3(
        null,
        false
    ));
