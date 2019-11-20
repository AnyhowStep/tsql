import {ITable} from "../../table";
import {CompileError} from "../../../compile-error";

export type AssertHasCandidateKey<TableT extends ITable> =
    TableT["candidateKeys"][number] extends never ?
    CompileError<[
        TableT["alias"],
        "must have a candidate key"
    ]> :
    unknown
;

export function assertHasCandidateKey (table : ITable) {
    if (table.candidateKeys.length == 0) {
        throw new Error(`${table.alias} must have a candidate key`);
    }
}
