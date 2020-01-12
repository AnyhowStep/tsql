import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const myTable = tsql.table("myTable")
                .addColumns({
                    value : tsql.dtBigIntSigned(),
                })
                .setId(columns => columns.value);
            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "myTable",
                            columns : [
                                {
                                    columnAlias : "value",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                }
                            ],
                            primaryKey : {
                                multiColumn : false,
                                columnAlias : "value",
                                autoIncrement : false,
                            } as const,
                        }
                    ]
                }
            );

            await myTable
                .insertAndFetch(
                    connection,
                    {
                        value : BigInt(9001),
                    }
                )
                .then((row) => {
                    t.deepEqual(row, { value : BigInt(9001) });
                });

            /**
             * MAX BIGINT SIGNED VALUE
             */
            await tsql.selectValue(() => BigInt("9223372036854775807"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("9223372036854775807"));
                });

            /**
             * MIN BIGINT SIGNED VALUE
             */
            await tsql.selectValue(() => BigInt("-9223372036854775808"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("-9223372036854775808"));
                });

            t.throws(() => {
                /**
                 * Too small
                 */
                tsql.selectValue(() => BigInt("-9223372036854775809"));
            });

            t.throws(() => {
                /**
                 * Too big
                 */
                tsql.selectValue(() => BigInt("9223372036854775808"));
            });
        });

        t.end();
    });
};
