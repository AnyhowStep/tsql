import {ColumnIdentifierRef, WritableColumnIdentifierRef} from "../../column-identifier-ref";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";

//Take the intersection and the "left" columnRef
export type LeftIntersect<
    RefA extends ColumnIdentifierRef,
    RefB extends ColumnIdentifierRef
> = (
    {
        readonly [tableAlias in Extract<keyof RefA, string>] : (
            tableAlias extends keyof RefB ?
            ColumnIdentifierMapUtil.Intersect<
                RefA[tableAlias],
                RefB[tableAlias]
            > :
            RefA[tableAlias]
        )
    }
);
export function leftIntersect<
    RefA extends ColumnIdentifierRef,
    RefB extends ColumnIdentifierRef
>(
    refA : RefA,
    refB : RefB
) : (
    LeftIntersect<RefA, RefB>
) {
    const result : WritableColumnIdentifierRef = {};
    for (const tableAlias of Object.keys(refA)) {
        if (
            Object.prototype.hasOwnProperty.call(refB, tableAlias) &&
            Object.prototype.propertyIsEnumerable.call(refB, tableAlias)
        ) {
            result[tableAlias] = ColumnIdentifierMapUtil.intersect(
                refA[tableAlias],
                refB[tableAlias]
            );
        } else {
            result[tableAlias] = refA[tableAlias];
        }
    }
    return result as LeftIntersect<RefA, RefB>;
}