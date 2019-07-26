import {ColumnRef, WritableColumnRef} from "../../column-ref";
import {ColumnMapUtil} from "../../../column-map";

//Take the intersection and the "left" columnRef
export type LeftIntersect<
    RefA extends ColumnRef,
    RefB extends ColumnRef
> = (
    {
        readonly [tableAlias in Extract<keyof RefA, string>] : (
            tableAlias extends keyof RefB ?
            ColumnMapUtil.Intersect<
                RefA[tableAlias],
                RefB[tableAlias]
            > :
            RefA[tableAlias]
        )
    }
);
export function leftIntersect<
    RefA extends ColumnRef,
    RefB extends ColumnRef
>(
    refA : RefA,
    refB : RefB
) : (
    LeftIntersect<RefA, RefB>
) {
    const result : WritableColumnRef = {};
    for (const tableAlias of Object.keys(refA)) {
        if (
            Object.prototype.hasOwnProperty.call(refB, tableAlias) &&
            Object.prototype.propertyIsEnumerable.call(refB, tableAlias)
        ) {
            result[tableAlias] = ColumnMapUtil.intersect(
                refA[tableAlias],
                refB[tableAlias]
            );
        } else {
            result[tableAlias] = refA[tableAlias];
        }
    }
    return result as LeftIntersect<RefA, RefB>;
}