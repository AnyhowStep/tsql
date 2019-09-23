import * as tsql from "../../../../../../dist";

tsql.inArray(1, ["1", true]);

tsql.inArray("1", [1, true]);

tsql.inArray(true, [1, "1"]);

tsql.inArray(true, [true, "1"]);
