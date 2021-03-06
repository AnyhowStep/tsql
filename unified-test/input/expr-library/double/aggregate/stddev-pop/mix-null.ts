import * as tm from "type-mapping";
import {Test} from "../../../../../test";
import * as tsql from "../../../../../../dist";
import {stdDevPop} from "./stddev-pop";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableVal : tm.mysql.double().orNull(),
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
                                        typeHint : tsql.TypeHint.DOUBLE,
                                    },
                                    nullable : true,
                                },
                            ],
                        },
                    ]
                }
            );

            const values : number[] = [];
            for (let i=0; i<10; ++i) {
                await myTable.insertOne(
                    connection,
                    {
                        myTableVal : Number(i),
                    }
                );
                await myTable.insertOne(
                    connection,
                    {
                        myTableVal : null,
                    }
                );
                values.push(i);

                await myTable
                    .where(() => true)
                    .fetchValue(
                        connection,
                        columns => tsql.double.stdDevPop(columns.myTableVal)
                    )
                    .then((value) => {
                        const expected = tm.FixedPointUtil.tryParse(String(stdDevPop(values)));
                        if (expected == undefined) {
                            t.notDeepEqual(expected, undefined);
                            return;
                        }
                        t.true(
                            Math.abs(
                                Number(value) -
                                Number(expected.getFixedPointString())
                            ) < 0.01,
                            `values=${values.join(",")}, value=${value}, expected=${expected.getFixedPointString()}`
                        );
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }

            for (let i=0; i<10; ++i) {
                await myTable.insertOne(
                    connection,
                    {
                        myTableVal : Number(i),
                    }
                );
                await myTable.insertOne(
                    connection,
                    {
                        myTableVal : null,
                    }
                );
                values.push(i);

                await myTable
                    .where(() => true)
                    .fetchValue(
                        connection,
                        columns => tsql.double.stdDevPop(columns.myTableVal)
                    )
                    .then((value) => {
                        const expected = tm.FixedPointUtil.tryParse(String(stdDevPop(values)));
                        if (expected == undefined) {
                            t.notDeepEqual(expected, undefined);
                            return;
                        }
                        t.true(
                            Math.abs(
                                Number(value) -
                                Number(expected.getFixedPointString())
                            ) < 0.01,
                            `values=${values.join(",")}, value=${value}, expected=${expected.getFixedPointString()}`
                        );
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
