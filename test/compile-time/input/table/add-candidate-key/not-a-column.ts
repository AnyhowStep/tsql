import * as sd from "type-mapping";
import * as o from "../../../../../dist";

export const t = o.table("joined1")
    .addColumns({
        a : sd.mysql.dateTime(),
        b : sd.mysql.float(),
        y : sd.string(),
        c : sd.string(),
        d : sd.string(),
    })
    .addCandidateKey(c => [1, c.y, c.b]);
