import * as tm from "type-mapping";
import {Test} from "../../../../../test";
import * as tsql from "../../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableVal : tm.mysql.varChar().orNull(),
            });

        await pool.acquire(async (connection) => {
            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "myTable",
                            columns : [
                                {
                                    columnAlias : "myTableVal",
                                    dataType : {
                                        typeHint : tsql.TypeHint.STRING,
                                    },
                                    nullable : true,
                                },
                            ],
                        },
                    ]
                }
            );

            for (let i=0; i<10; ++i) {
                await myTable.insertOne(
                    connection,
                    {
                        myTableVal : i.toString(),
                    }
                );
                await myTable.insertOne(
                    connection,
                    {
                        myTableVal : null,
                    }
                );

                await myTable
                    .where(() => true)
                    .fetchValue(
                        connection,
                        columns => tsql.groupConcatDistinct(columns.myTableVal)
                    )
                    .then((value) => {
                        if (value == undefined) {
                            t.notDeepEqual(value, undefined);
                            return;
                        }
                        for (let j=0; j<=i; ++j) {
                            t.true(value.indexOf(j.toString()) >= 0);
                        }
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }

            //Insert duplicate rows, but `DISTINCT` will filter them out
            for (let i=0; i<10; ++i) {
                await myTable.insertOne(
                    connection,
                    {
                        myTableVal : i.toString(),
                    }
                );
                await myTable.insertOne(
                    connection,
                    {
                        myTableVal : null,
                    }
                );

                await myTable
                    .where(() => true)
                    .fetchValue(
                        connection,
                        columns => tsql.groupConcatDistinct(columns.myTableVal)
                    )
                    .then((value) => {
                        if (value == undefined) {
                            t.notDeepEqual(value, undefined);
                            return;
                        }
                        for (let j=0; j<=i; ++j) {
                            const regex = new RegExp(j.toString(), "g");
                            let matchCount = 0;
                            while (regex.exec(value) != undefined) {
                                ++matchCount;
                            }
                            t.deepEqual(matchCount, 1);
                        }
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
