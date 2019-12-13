import {ITable} from "../../table";
import {isIdentifierNode} from "../../../ast";

export function tryGetSchemaName (
    table : ITable
) : string|undefined {
    return (
        (
            isIdentifierNode(table.unaliasedAst) &&
            table.unaliasedAst.identifiers.length == 2
        ) ?
        table.unaliasedAst.identifiers[0] :
        undefined
    );
}
