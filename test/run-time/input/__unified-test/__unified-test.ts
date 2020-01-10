import * as tape from "tape";
import {unifiedTest} from "../../../../unified-test";
import {Pool} from "../sql-web-worker/promise.sql";
import {SqliteWorker} from "../sql-web-worker/worker.sql";

unifiedTest({
    pool : new Pool(new SqliteWorker()),
    tape,
});
