import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const dst = tsql.table("dst")
    .addColumns({
        idA : tm.mysql.bigIntUnsigned(),
        idB : tm.mysql.bigIntUnsigned(),
    })
    .addCandidateKey(columns => [columns.idA, columns.idB])
    .addAllMutable();

export const p = dst.updateAndFetchOneByCandidateKey(
    null as any,
    {
        idA : BigInt(1),
        idB : BigInt(1),
    },
    columns => {
        return {
            idA : tsql.integer.add(columns.idA, BigInt(123456)),
            idB : BigInt(654321),
        };
    }
);
