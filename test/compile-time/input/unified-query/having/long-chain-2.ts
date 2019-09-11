import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

export const expr = tsql.and(
    tsql.and(
        tsql.and(
            tsql.and(
                tsql.and(
                    tsql.and(
                        tsql.and(
                            tsql.and(
                                tsql.and(
                                    tsql.and(
                                        tsql.and(
                                            tsql.and(
                                                tsql.and(
                                                    tsql.and(
                                                        tsql.and(
                                                            tsql.and(
                                                                tsql.and(
                                                                    tsql.and(
                                                                        tsql.and(
                                                                            tsql.and(
                                                                                tsql.and(
                                                                                    tsql.and(
                                                                                        tsql.and(
                                                                                            tsql.and(
                                                                                                tsql.and(
                                                                                                    tsql.and(
                                                                                                        tsql.and(
                                                                                                            tsql.and(
                                                                                                                tsql.and(
                                                                                                                    tsql.and(
                                                                                                                        tsql.and(
                                                                                                                            tsql.and(
                                                                                                                                tsql.and(
                                                                                                                                    tsql.and(
                                                                                                                                        tsql.and(
                                                                                                                                            tsql.and(
                                                                                                                                                tsql.and(
                                                                                                                                                    tsql.and(
                                                                                                                                                    )
                                                                                                                                                )
                                                                                                                                            )
                                                                                                                                        )
                                                                                                                                    )
                                                                                                                                )
                                                                                                                            )
                                                                                                                        )
                                                                                                                    )
                                                                                                                )
                                                                                                            )
                                                                                                        )
                                                                                                    )
                                                                                                )
                                                                                            )
                                                                                        )
                                                                                    )
                                                                                )
                                                                            )
                                                                        )
                                                                    )
                                                                )
                                                            )
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
    )
);
const myTable = tsql.table("myTable")
    .addColumns({
        myColumn : tm.mysql.boolean(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr)
    .having(() => expr);
