import * as tsql from "../../../../../../dist";

tsql.greatest(1, "1", true);

tsql.greatest("1", 1, true);

tsql.greatest(true, 1, "1");

tsql.greatest(true, true, "1");
