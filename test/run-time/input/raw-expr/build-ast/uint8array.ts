import * as tape from "tape";
//import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

tape(__filename, t => {
    t.deepEqual(
        tsql.BuiltInExprUtil.buildAst(
            Buffer.from("hello, world")
        ),
        tsql.LiteralValueNodeUtil.bufferLiteralNode(
            Buffer.from("hello, world")
        )
    );
    t.deepEqual(
        tsql.BuiltInExprUtil.buildAst(
            new Uint8Array([1,2,3,4])
        ),
        tsql.LiteralValueNodeUtil.bufferLiteralNode(
            new Uint8Array([1,2,3,4])
        )
    );
    t.end();
});
