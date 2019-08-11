import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        aa : tm.mysql.dateTime(),
        bb : tm.mysql.float(),
        cc : tm.mysql.blob(),
        dd : tm.mysql.varChar(),
    })
    .addCandidateKey(c => [c.aa, c.bb])
    .addCandidateKey(c => [c.cc, c.dd])
    .addCandidateKey(c => [c.aa, c.dd]);

declare function foo () : tsql.SuperKey_Output<typeof myTable>;
export const k = foo();
