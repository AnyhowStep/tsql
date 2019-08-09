import * as tsql from "../../../../../../../dist";

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
                                                            true,
                                                            true
                                                        ),
                                                        true
                                                    ),
                                                    true
                                                ),
                                                true
                                            ),
                                            true
                                        ),
                                        true
                                    ),
                                    true
                                ),
                                true
                            ),
                            true
                        ),
                        true
                    ),
                    true
                ),
                true
            ),
            true
        ),
        true
    ),
    null as unknown as tsql.IColumn<{
        mapper : () => boolean,
        tableAlias : "x",
        columnAlias : "y",
    }>
);
/**
* @todo Find a way to increase the limit to 60 or more
*/
tsql.and(
    expr,
    true
);
