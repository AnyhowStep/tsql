import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        someColumnA : tm.mysql.boolean(),
        someColumnB : tm.mysql.boolean(),
        someColumnC : tm.mysql.boolean(),
    })

export const expr = tsql.eq(
    tsql.eq(
        tsql.eq(
            tsql.eq(
                tsql.eq(
                    tsql.eq(
                        tsql.eq(
                            tsql.eq(
                                tsql.eq(
                                    tsql.eq(
                                        tsql.eq(
                                            tsql.eq(
                                                tsql.eq(
                                                    tsql.eq(
                                                        tsql.eq(
                                                            tsql.eq(
                                                                tsql.eq(
                                                                    tsql.eq(
                                                                        tsql.eq(
                                                                            tsql.eq(
                                                                                myTable.columns.someColumnA,
                                                                                myTable.columns.someColumnB,
                                                                            ),
                                                                            myTable.columns.someColumnC
                                                                        ),
                                                                        myTable.columns.someColumnC
                                                                    ),
                                                                    myTable.columns.someColumnC
                                                                ),
                                                                myTable.columns.someColumnC
                                                            ),
                                                            myTable.columns.someColumnC
                                                        ),
                                                        myTable.columns.someColumnC
                                                    ),
                                                    myTable.columns.someColumnC
                                                ),
                                                myTable.columns.someColumnC
                                            ),
                                            myTable.columns.someColumnC
                                        ),
                                        myTable.columns.someColumnC
                                    ),
                                    myTable.columns.someColumnC
                                ),
                                myTable.columns.someColumnC
                            ),
                            myTable.columns.someColumnC
                        ),
                        myTable.columns.someColumnC
                    ),
                    myTable.columns.someColumnC
                ),
                myTable.columns.someColumnC
            ),
            myTable.columns.someColumnC
        ),
        myTable.columns.someColumnC
    ),
    myTable.columns.someColumnC
);

export const expr2 = tsql.eq(
    tsql.eq(
        tsql.eq(
            tsql.eq(
                tsql.eq(
                    tsql.eq(
                        tsql.eq(
                            tsql.eq(
                                tsql.eq(
                                    tsql.eq(
                                        tsql.eq(
                                            tsql.eq(
                                                tsql.eq(
                                                    tsql.eq(
                                                        tsql.eq(
                                                            tsql.eq(
                                                                tsql.eq(
                                                                    tsql.eq(
                                                                        tsql.eq(
                                                                            tsql.eq(
                                                                                expr,
                                                                                myTable.columns.someColumnA,
                                                                            ),
                                                                            myTable.columns.someColumnB
                                                                        ),
                                                                        myTable.columns.someColumnC
                                                                    ),
                                                                    myTable.columns.someColumnA
                                                                ),
                                                                myTable.columns.someColumnB
                                                            ),
                                                            myTable.columns.someColumnC
                                                        ),
                                                        myTable.columns.someColumnA
                                                    ),
                                                    myTable.columns.someColumnB
                                                ),
                                                myTable.columns.someColumnC
                                            ),
                                            myTable.columns.someColumnA
                                        ),
                                        myTable.columns.someColumnB
                                    ),
                                    myTable.columns.someColumnC
                                ),
                                myTable.columns.someColumnA
                            ),
                            myTable.columns.someColumnB
                        ),
                        myTable.columns.someColumnC
                    ),
                    myTable.columns.someColumnA
                ),
                myTable.columns.someColumnB
            ),
            myTable.columns.someColumnC
        ),
        myTable.columns.someColumnA
    ),
    myTable.columns.someColumnB
);

export const expr3 = tsql.eq(
    tsql.eq(
        tsql.eq(
            tsql.eq(
                tsql.eq(
                    tsql.eq(
                        tsql.eq(
                            tsql.eq(
                                tsql.eq(
                                    tsql.eq(
                                        tsql.eq(
                                            tsql.eq(
                                                tsql.eq(
                                                    tsql.eq(
                                                        tsql.eq(
                                                            tsql.eq(
                                                                tsql.eq(
                                                                    tsql.eq(
                                                                        tsql.eq(
                                                                            tsql.eq(
                                                                                expr2,
                                                                                myTable.columns.someColumnA,
                                                                            ),
                                                                            myTable.columns.someColumnB
                                                                        ),
                                                                        myTable.columns.someColumnC
                                                                    ),
                                                                    myTable.columns.someColumnA
                                                                ),
                                                                myTable.columns.someColumnB
                                                            ),
                                                            myTable.columns.someColumnC
                                                        ),
                                                        myTable.columns.someColumnA
                                                    ),
                                                    myTable.columns.someColumnB
                                                ),
                                                myTable.columns.someColumnC
                                            ),
                                            myTable.columns.someColumnA
                                        ),
                                        myTable.columns.someColumnB
                                    ),
                                    myTable.columns.someColumnC
                                ),
                                myTable.columns.someColumnA
                            ),
                            myTable.columns.someColumnB
                        ),
                        myTable.columns.someColumnC
                    ),
                    myTable.columns.someColumnA
                ),
                myTable.columns.someColumnB
            ),
            myTable.columns.someColumnC
        ),
        myTable.columns.someColumnA
    ),
    myTable.columns.someColumnB
);

export const expr4 = tsql.eq(
    tsql.eq(
        tsql.eq(
            tsql.eq(
                tsql.eq(
                    tsql.eq(
                        tsql.eq(
                            tsql.eq(
                                tsql.eq(
                                    tsql.eq(
                                        tsql.eq(
                                            tsql.eq(
                                                tsql.eq(
                                                    tsql.eq(
                                                        tsql.eq(
                                                            tsql.eq(
                                                                tsql.eq(
                                                                    tsql.eq(
                                                                        tsql.eq(
                                                                            tsql.eq(
                                                                                expr3,
                                                                                myTable.columns.someColumnA,
                                                                            ),
                                                                            myTable.columns.someColumnB
                                                                        ),
                                                                        myTable.columns.someColumnC
                                                                    ),
                                                                    myTable.columns.someColumnA
                                                                ),
                                                                myTable.columns.someColumnB
                                                            ),
                                                            myTable.columns.someColumnC
                                                        ),
                                                        myTable.columns.someColumnA
                                                    ),
                                                    myTable.columns.someColumnB
                                                ),
                                                myTable.columns.someColumnC
                                            ),
                                            myTable.columns.someColumnA
                                        ),
                                        myTable.columns.someColumnB
                                    ),
                                    myTable.columns.someColumnC
                                ),
                                myTable.columns.someColumnA
                            ),
                            myTable.columns.someColumnB
                        ),
                        myTable.columns.someColumnC
                    ),
                    myTable.columns.someColumnA
                ),
                myTable.columns.someColumnB
            ),
            myTable.columns.someColumnC
        ),
        myTable.columns.someColumnA
    ),
    myTable.columns.someColumnB
);

export const expr5 = tsql.eq(
    tsql.eq(
        tsql.eq(
            tsql.eq(
                tsql.eq(
                    tsql.eq(
                        tsql.eq(
                            tsql.eq(
                                tsql.eq(
                                    tsql.eq(
                                        tsql.eq(
                                            tsql.eq(
                                                tsql.eq(
                                                    tsql.eq(
                                                        tsql.eq(
                                                            tsql.eq(
                                                                tsql.eq(
                                                                    tsql.eq(
                                                                        tsql.eq(
                                                                            tsql.eq(
                                                                                expr4,
                                                                                myTable.columns.someColumnA,
                                                                            ),
                                                                            myTable.columns.someColumnB
                                                                        ),
                                                                        myTable.columns.someColumnC
                                                                    ),
                                                                    myTable.columns.someColumnA
                                                                ),
                                                                myTable.columns.someColumnB
                                                            ),
                                                            myTable.columns.someColumnC
                                                        ),
                                                        myTable.columns.someColumnA
                                                    ),
                                                    myTable.columns.someColumnB
                                                ),
                                                myTable.columns.someColumnC
                                            ),
                                            myTable.columns.someColumnA
                                        ),
                                        myTable.columns.someColumnB
                                    ),
                                    myTable.columns.someColumnC
                                ),
                                myTable.columns.someColumnA
                            ),
                            myTable.columns.someColumnB
                        ),
                        myTable.columns.someColumnC
                    ),
                    myTable.columns.someColumnA
                ),
                myTable.columns.someColumnB
            ),
            myTable.columns.someColumnC
        ),
        myTable.columns.someColumnA
    ),
    myTable.columns.someColumnB
);
