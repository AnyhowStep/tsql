import {ITable} from "../table";
import {ColumnMap} from "../column-map";
import {TypeMapUtil, TypeMap} from "../type-map";
import {Key} from "../key";
import {UnionToIntersection} from "../type-util";

export type CandidateKey_NonUnionImpl<MapT extends ColumnMap, K extends Key> = (
    K extends Key ?
    TypeMapUtil.FromColumnMap<
        Pick<MapT, K[number]>
    > :
    never
);
/**
 * Assumes `TableT` is not a union.
 *
 * If it is a union, use `CandidateKey_Output/Input<U>` instead.
 *
 * -----
 *
 * Also assumes `TableT["columns"]` and `TableT["candidateKeys"]` are not unions.
 * They really shouldn't be unions.
 * + Why does your table not have a definite set of columns?
 *   Is it Schrödinger's columns?
 * + Why does your table not have a definite set candidate keys?
 *   Is it Schrödinger's candidate keys?
 */
export type CandidateKey_NonUnion<TableT extends Pick<ITable, "columns"|"candidateKeys">> = (
    CandidateKey_NonUnionImpl<
        TableT["columns"],
        TableT["candidateKeys"][number]
    >
);

/**
 * Works properly, even when `TableT` is a union.
 *
 * Will return a union of candidate keys.
 * Meant for output/read/covariant positions.
 */
export type CandidateKey_Output<
    TableT extends Pick<ITable, "columns"|"candidateKeys">
> = (
    TableT extends Pick<ITable, "columns"|"candidateKeys"> ?
    CandidateKey_NonUnion<TableT> :
    never
);
/**
 * Works properly, even when `TableT` is a union.
 *
 * Will return a union of (intersection of candidate keys).
 * Meant for input/write/contravariant positions.
 *
 * -----
 *
 * ```ts
 *  //The following types are equal
 *  type a = (
 *      | ({x: ""} & {a: ""})
 *      | ({x: ""} & {b: ""})
 *      | ({y: ""} & {a: ""})
 *      | ({y: ""} & {b: ""})
 *  );
 *  type a = UnionToIntersection<
 *      //Assume these are candidate keys of table X
 *      | [{x:""}|{y:""}]
 *      //Assume these are candidate keys of table A
 *      | [{a:""}|{b:""}]
 *  >[number];
 * ```
 * http://www.typescriptlang.org/play/#code/C4TwDgpgBAqgdgSwPZwCpIJJ2BATgZwgGNhk4AeeAPigF4oAKAWACgp3HWPvY4oIAHjjgATfFACGcEFAD8jANYAuXgEo6NAG5IEIqCrgRNeLh3WDhYzmx7sGyqAjgAzPFAzraWnSNPt18hj6UIbGuKyqANysrAD0AFSsoJCSdNbcAD6MAN4CKgBE+QC+UABkUNkSBcWqflBZDLnVJeXZAEbNtTbsDdkgzWUVVVCFRV2ZOf0jxYPtnRGs8bFJ4NASafBk6Fg4BMSkKOR1WQDaTaMZfUqjALrHUGdVF3O3rFQncACuALZteDdAA
 */
export type CandidateKey_Input<
    TableT extends Pick<ITable, "columns"|"candidateKeys">
> = (
    Extract<
        (
            UnionToIntersection<
                TableT extends Pick<ITable, "columns"|"candidateKeys"> ?
                [CandidateKey_NonUnion<TableT>] :
                never
            >
        ),
        [TypeMap]
    >[number]
);
