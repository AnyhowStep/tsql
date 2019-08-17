import {ColumnMap} from "../../column-map";
import {AssertSameOwnEnumerableKeys} from "../../../type-util";
import {AssertIsNullSafeComparable} from "./assert-is-null-safe-comparable";

/**
 * + Assumes `SrcMapT` is not a union
 * + Assumes `DstMapT` may be a union
 *
 * If `SrcMapT` and `DstMapT` have the same keys,
 * it asserts if they are **null-safe** comparable.
 *
 * Otherwise, it performs no assertion.
 */
export type AssertIsNullSafeComparableIfSameOwnEnumerableKeys_NonUnion<
    SrcMapT extends ColumnMap,
    DstMapT extends ColumnMap
> =
    DstMapT extends ColumnMap ?
    (
        unknown extends AssertSameOwnEnumerableKeys<
            SrcMapT,
            DstMapT
        > ?
        AssertIsNullSafeComparable<
            SrcMapT,
            DstMapT
        > :
        unknown
    ) :
    never
;
