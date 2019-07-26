import {ColumnRef, WritableColumnRef} from "../../column-ref";
import {LeftIntersect, leftIntersect} from "./left-intersect";

export type Intersect<
    RefA extends ColumnRef,
    RefB extends ColumnRef
> = (
    Extract<
        LeftIntersect<RefA, RefB> &
        {
            readonly [tableAlias in Exclude<
                Extract<keyof RefB, string>,
                keyof RefA
            >] : (
                RefB[tableAlias]
            )
        },
        ColumnRef
    >
);
export function intersect<
    RefA extends ColumnRef,
    RefB extends ColumnRef
> (
    refA : RefA,
    refB : RefB
) : Intersect<RefA, RefB> {
    const left : LeftIntersect<
        RefA, RefB
    > = leftIntersect(refA, refB);

    const right : WritableColumnRef = {};
    for (const tableAlias of Object.keys(refB)) {
        if (
            Object.prototype.hasOwnProperty.call(refA, tableAlias) &&
            Object.prototype.propertyIsEnumerable.call(refA, tableAlias)
        ) {
            continue;
        }
        right[tableAlias] = refB[tableAlias];
    }
    return {
        ...left,
        ...right,
    } as Intersect<RefA, RefB>;
}