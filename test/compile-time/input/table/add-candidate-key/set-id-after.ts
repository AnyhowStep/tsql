import * as sd from "type-mapping";
import * as o from "../../../../../dist";

const joined1 = o.table("joined1")
    .addColumns({
        a : sd.mysql.dateTime(),
        b : sd.mysql.float(),
        y : sd.string(),
        c : sd.string(),
        d : sd.string(),
    })
    .addCandidateKey(c => [c.y])
    .addCandidateKey(c => [c.c, c.d]);

joined1.setId(c => c.y);
joined1.setId(c => c.c);
joined1.setId(c => c.d);

export const ai = joined1.setId(c => c.b);
