import * as tsql from "../../../../../dist";
import * as tape from "tape";

tape(__filename, t => {
    const buffer = Buffer.from("hello");
    const escaped = tsql.escapeValue(buffer);

    t.deepEqual(escaped, "X'68656c6c6f'");

    t.end();
});
