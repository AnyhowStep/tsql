import * as tsql from "../../../../../../dist";

tsql.inQuery(1, tsql.selectValue(() => "hi"));

tsql.inQuery("hi", tsql.selectValue(() => 1));

tsql.inQuery(true, tsql.selectValue(() => 1));

tsql.inQuery(true, tsql.selectValue(() => null));
