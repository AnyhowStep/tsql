import {IQueryBase} from "../../query-base";
import {Ast} from "../ast";
import {Sqlfier} from "./sqlfier";

export interface QueryBaseSqlfier {
    (
        query : IQueryBase,
        toSql : (ast : Ast) => string,
        sqlfier : Sqlfier
    ) : string;
}
