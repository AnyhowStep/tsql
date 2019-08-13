import {IJoin} from "../../join";
import {ColumnMap} from "../../../column-map";
import {WithPrimaryKey} from "../helper-type";
import {HasNullSafeComparablePrimaryKey} from "../predicate";

/**
 * Given a union of `IJoin`, it extracts the ones with the a primary key
 * **null-safe** comparable to `ColumnMapT`
 *
 */
export type ExtractWithNullSafeComparablePrimaryKey<
    JoinT extends IJoin,
    ColumnMapT extends ColumnMap
> = (
    JoinT extends IJoin ?
    (
        JoinT extends WithPrimaryKey ?
        (
            HasNullSafeComparablePrimaryKey<JoinT, ColumnMapT> extends true ?
            JoinT :
            never
        ) :
        never
    ) :
    never
);
