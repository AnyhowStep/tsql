import * as tsql from "../../../../../../dist";

tsql.greatest(null, 1);

tsql.greatest(1, null);

tsql.greatest(1, 2, null);

tsql.greatest(null, null);

tsql.greatest(null, null, 3);

tsql.greatest(1, null, null);

tsql.greatest(null, 2, null);

tsql.greatest(null, null, null);
