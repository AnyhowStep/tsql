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
    .setPrimaryKey(c => [c.y])
    .setPrimaryKey(c => [c.c, c.d]);

joined1.setAutoIncrement(c => c.y);
joined1.setAutoIncrement(c => c.c);
joined1.setAutoIncrement(c => c.d);

export const ai = joined1.setAutoIncrement(c => c.b);
