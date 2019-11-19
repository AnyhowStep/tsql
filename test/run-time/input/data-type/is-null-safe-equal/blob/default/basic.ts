import * as tape from "tape";
import * as tsql from "../../../../../../../dist";

tape(__filename, async (t) => {
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarBinary(),
            Buffer.from(""),
            Buffer.from("")
        )
    );
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarBinary(),
            new Uint8Array("".split("").map(s => s.charCodeAt(0))),
            new Uint8Array("".split("").map(s => s.charCodeAt(0))),
        )
    );
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarBinary(),
            new Uint8Array("".split("").map(s => s.charCodeAt(0))),
            Buffer.from("")
        )
    );
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarBinary(),
            Buffer.from(""),
            new Uint8Array("".split("").map(s => s.charCodeAt(0)))
        )
    );

    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarBinary(),
            Buffer.from("ab"),
            Buffer.from("ab")
        )
    );
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarBinary(),
            new Uint8Array("ab".split("").map(s => s.charCodeAt(0))),
            new Uint8Array("ab".split("").map(s => s.charCodeAt(0)))
        )
    );
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarBinary(),
            new Uint8Array("ab".split("").map(s => s.charCodeAt(0))),
            Buffer.from("ab", "ascii")
        )
    );
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarBinary(),
            Buffer.from("ab".split("").map(s => s.charCodeAt(0))),
            new Uint8Array("ab".split("").map(s => s.charCodeAt(0)))
        )
    );

    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarBinary(),
            Buffer.from("a"),
            Buffer.from("")
        )
    );
    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarBinary(),
            new Uint8Array("a".split("").map(s => s.charCodeAt(0))),
            new Uint8Array("".split("").map(s => s.charCodeAt(0)))
        )
    );
    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarBinary(),
            new Uint8Array("a".split("").map(s => s.charCodeAt(0))),
            Buffer.from("")
        )
    );
    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarBinary(),
            Buffer.from("a"),
            new Uint8Array("".split("").map(s => s.charCodeAt(0)))
        )
    );

    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarBinary(),
            Buffer.from("a"),
            Buffer.from("b")
        )
    );
    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarBinary(),
            new Uint8Array("a".split("").map(s => s.charCodeAt(0))),
            new Uint8Array("b".split("").map(s => s.charCodeAt(0)))
        )
    );
    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarBinary(),
            new Uint8Array("a".split("").map(s => s.charCodeAt(0))),
            Buffer.from("b", "ascii")
        )
    );
    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarBinary(),
            Buffer.from("a"),
            new Uint8Array("b".split("").map(s => s.charCodeAt(0)))
        )
    );

    t.end();
});
