import {IColumn} from "../../../column";
import {removeDuplicates} from "../operation";

/**
 * + Assumes `ArrT` may be a union
 */
export type FromColumnArray<
    ArrT extends readonly Pick<IColumn, "columnAlias">[]
> = (
    ArrT extends readonly IColumn[] ?
    readonly (ArrT[number]["columnAlias"])[] :
    never
);
export function fromColumnArray<
    ArrT extends readonly IColumn[]
> (
    columns : ArrT
) : (
    FromColumnArray<ArrT>
) {
    const result : (
        readonly (ArrT[number]["columnAlias"])[]
    ) = removeDuplicates(
        columns.map(c => c.columnAlias)
    );
    return result as FromColumnArray<ArrT>;
}
