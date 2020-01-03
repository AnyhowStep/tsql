import * as tsql from "../../../../../dist";

declare const pool : tsql.IPool;

export const v = pool.acquireReadOnlyTransaction(async (connection) => {
    /**
     * You should not be able to go from a read-only transaction to a read-write transaction
     */
    await connection.transactionIfNotInOne(async () => {

    });
});
