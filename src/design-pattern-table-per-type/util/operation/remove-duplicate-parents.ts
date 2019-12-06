import {ITable} from "../../../table";

export function removeDuplicateParents<ParentTableT extends ITable> (
    arr : readonly ParentTableT[]
) : (ParentTableT)[] {
    const result : ParentTableT[] = [];

    for (const parentTable of arr) {
        /**
         * @todo Add `.schemaName` property?
         * When checking `.alias` only, it may think a different
         * table from a different schema is the same table.
         */
        if (result.find(r => r.alias == parentTable.alias) != undefined) {
            continue;
        }
        result.push(parentTable);
    }

    return result;
}
