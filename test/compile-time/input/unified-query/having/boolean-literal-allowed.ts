import * as tsql from "../../../../../dist";

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
    .having(() => true)
    .having(() => false)
    .having(() => Math.random() > 0.5);
