import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const dst = tsql.table("dst")
    .addColumns({
        idA : tm.mysql.bigIntUnsigned(),
        idB : tm.mysql.bigIntUnsigned(),
    })
    .addCandidateKey(columns => [columns.idA, columns.idB])
    .addAllMutable();

export const p = dst.whereEqCandidateKey({
        idA : BigInt(1),
        idB : BigInt(1),
    }).updateAndFetchOne(null as any, columns => {
        return {
            idA : tsql.integer.add(columns.idA, BigInt(123456)),
            idB : BigInt(654321),
        };
    }
);
