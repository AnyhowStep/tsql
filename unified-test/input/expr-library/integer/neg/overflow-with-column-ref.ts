import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableVal : tm.mysql.bigIntSigned(),
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
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                            ],
                        },
                    ]
                }
            );

            await myTable.insertOne(
                connection,
                {
                    myTableVal : BigInt("-9223372036854775808"),
                }
            );

            await tsql
                .from(myTable)
                .selectValue(columns => tsql.integer.neg(columns.myTableVal))
                .fetchValue(connection)
                .then(() => {
                    t.fail(`-(-9223372036854775808) should overflow and throw`);
                })
                .catch((err) => {
                    /**
                     * MySQL throws.
                     * SQLite implicitly casts to `DOUBLE`, and doesn't throw an error.
                     * PostgreSQL throws.
                     *
                     * The polyfill for SQLite should throw.
                     */
                    t.true(err instanceof tsql.DataOutOfRangeError);
                });
        });

        t.end();
    });
};
