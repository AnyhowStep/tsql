import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

export const joined1 = tsql.table("joined1")
    .addColumns({
        a : tm.mysql.dateTime(),
        b : tm.mysql.float(),
        y : tm.string(),
        c : tm.string(),
        d : tm.string(),
    })
    .addCandidateKey(c => [c.y, c.c])
    .addCandidateKey(c => [c.b]);

declare const pool : tsql.IPool;
pool.onInsertOne.addHandler(async (event) => {
    if (!event.isFor(joined1)) {
        return;
    }

    if (event.candidateKey == undefined) {
        return;
    }
    const candidateKey = event.candidateKey;

    event.addOnCommitListener(async () => {
        await event.pool.acquire((connection) => {
            return joined1.fetchOneByCandidateKey(
                connection,
                candidateKey
            );
        });
    });
    event.addOnRollbackListener(async () => {
        await event.pool.acquire((connection) => {
            return joined1.fetchOneByCandidateKey(
                connection,
                candidateKey
            );
        });
    });

    await joined1.insertAndFetch(
        event.connection,
        event.insertRow
    );
});
