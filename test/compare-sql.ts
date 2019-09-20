import * as fs from "fs";
import * as tsql from "../dist";
import * as tape from "tape";
import {sqliteSqlfier} from "./sqlite-sqlfier";

export function compareSql (
    fileName : string,
    t : tape.Test,
    ast : tsql.Ast
) {
    const actual = tsql.AstUtil.toSql(ast, sqliteSqlfier);
    const expected = fs
        .readFileSync(fileName.replace(/\.ts$/, ".plain.sql"))
        .toString("ascii")
        .replace(/\n$/, "");
    t.deepEqual(actual, expected, fileName);
}
