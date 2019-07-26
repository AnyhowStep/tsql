import * as sd from "type-mapping";
import * as o from "../../../../../dist";

export const joined1 = o.table("joined1")
    .addColumns({
        a : sd.mysql.dateTime(),
        b : sd.mysql.float(),
        y : sd.string(),
        c : sd.string(),
        d : sd.string(),
    })
    .addCandidateKey(c => [c.y, c.c])
    .addCandidateKey(c => [c.y, c.b]);
