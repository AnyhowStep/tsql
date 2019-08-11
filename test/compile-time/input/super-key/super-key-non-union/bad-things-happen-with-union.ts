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

const otherTable = tsql.table("otherTable")
    .addColumns({
        ee : tm.mysql.dateTime(),
        ff : tm.mysql.float(),
        gg : tm.mysql.blob(),
        hh : tm.mysql.varChar(),
    })
    .addCandidateKey(c => [c.ee, c.ff])
    .addCandidateKey(c => [c.gg, c.hh])
    .addCandidateKey(c => [c.ee, c.hh]);

declare function foo () : tsql.SuperKey_NonUnion<typeof myTable|typeof otherTable>;
export const k = foo();
