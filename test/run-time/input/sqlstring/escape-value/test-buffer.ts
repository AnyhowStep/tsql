import * as tsql from "../../../../../dist";
import * as tape from "tape";

tape(__filename, t => {
    const buffer = Buffer.from("hello");
    const escaped = tsql.escapeValue(buffer);

    t.deepEqual(buffer.length, 5);
    t.deepEqual(buffer.byteLength, 5);
    t.deepEqual(buffer.buffer.byteLength, 8192);
    t.deepEqual(escaped, "X'68656c6c6f'");

    t.end();
});

tape(__filename, t => {
    const buffer = Buffer.from([0,4,16,64,255]);
    const escaped = tsql.escapeValue(buffer);

    t.deepEqual(buffer.length, 5);
    t.deepEqual(buffer.byteLength, 5);
    t.deepEqual(buffer.buffer.byteLength, 8192);
    t.deepEqual(escaped, "X'00041040ff'");

    t.end();
});

tape(__filename, t => {
    const buffer = new Uint8Array("hello".split("").map(h => h.charCodeAt(0)));
    const escaped = tsql.escapeValue(buffer);

    t.deepEqual(escaped, "X'68656c6c6f'");

    t.end();
});

tape(__filename, t => {
    const buffer = new Uint8Array([0,4,16,64,255]);
    const escaped = tsql.escapeValue(buffer);

    t.deepEqual(escaped, "X'00041040ff'");

    t.end();
});
