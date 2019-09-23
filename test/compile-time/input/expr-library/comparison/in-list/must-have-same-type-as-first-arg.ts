import * as tsql from "../../../../../../dist";

tsql.inList(1, "1", true);

tsql.inList("1", 1, true);

tsql.inList(true, 1, "1");

tsql.inList(true, true, "1");
