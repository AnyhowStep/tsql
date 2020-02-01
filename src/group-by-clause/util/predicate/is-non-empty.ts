import {GroupByClause} from "../../group-by-clause";
import {CompileError} from "../../../compile-error";

export type AssertNonEmpty<GroupByClauseT extends GroupByClause> =
    GroupByClauseT[number] extends never ?
    CompileError<"GROUP BY clause cannot be empty"> :
    unknown
;

export function assertNonEmpty (groupByClause : GroupByClause) {
    if (groupByClause.length == 0) {
        throw new Error(`GROUP BY clause cannot be empty`);
    }
}
