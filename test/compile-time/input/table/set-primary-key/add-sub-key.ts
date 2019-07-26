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
    .setPrimaryKey(c => [c.y, c.b]);

joined1.setPrimaryKey(c => [c.y]);
joined1.setPrimaryKey(c => [c.y, c.b]);
