import {IAliasedTable} from "../../aliased-table";
import {IsUnion} from "../../../type-util";
import {ExtractWithTableAlias} from "../../util";

export type DuplicateTableAlias<
    ArrT extends readonly IAliasedTable[]
> = (
    {
        [tableAlias in ArrT[number]["tableAlias"]] : (
            IsUnion<ExtractWithTableAlias<ArrT[number], tableAlias>> extends true ?
            tableAlias :
            never
        )
    }[ArrT[number]["tableAlias"]]
);
export function duplicateTableAlias<
    ArrT extends readonly IAliasedTable[]
> (
    arr : ArrT
) : (
    DuplicateTableAlias<ArrT>[]
) {
    const result : string[] = [];

    for (let i=0; i<arr.length; ++i) {
        const cur = arr[i].tableAlias;
        for (let j=i+1; j<arr.length; ++j) {
            const nxt = arr[j].tableAlias;
            if (cur == nxt && !result.includes(cur)) {
                result.push(cur);
            }
        }
    }

    return result as DuplicateTableAlias<ArrT>[];
}
