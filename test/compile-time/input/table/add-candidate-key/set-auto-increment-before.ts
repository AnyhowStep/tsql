import * as sd from "type-mapping";
import * as o from "../../../../../dist";

const joined1 = o.table("joined1")
    .addColumns({
        a : sd.mysql.dateTime(),
        b : sd.mysql.blob(),
        y : sd.string(),
        c : sd.string(),
        d : sd.string(),
    })
    .setAutoIncrement(c => c.y)

joined1.addCandidateKey(c => [c.y]);
joined1.addCandidateKey(c => [c.y, c.d]);
