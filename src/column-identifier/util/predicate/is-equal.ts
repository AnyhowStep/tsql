import {ColumnIdentifier} from "../../column-identifier";

export type IsEqual<
    A extends ColumnIdentifier,
    B extends ColumnIdentifier
> = (
    A extends ColumnIdentifier ?
    (
        B extends ColumnIdentifier ?
        (
            string extends A["tableAlias"] ?
            boolean :
            string extends B["tableAlias"] ?
            boolean :
            A["tableAlias"] extends B["tableAlias"] ?
            (
                string extends A["columnAlias"] ?
                boolean :
                string extends B["columnAlias"] ?
                boolean :
                A["columnAlias"] extends B["columnAlias"] ?
                true :
                false
            ) :
            false
        ) :
        never
    ) :
    never
);
export function isEqual<
    A extends ColumnIdentifier,
    B extends ColumnIdentifier
> (a : A, b : B) : IsEqual<A, B> {
    return (
        a.tableAlias == b.tableAlias &&
        a.columnAlias == b.columnAlias
    ) as any;
}
export function assertIsEqual (a : ColumnIdentifier, b : ColumnIdentifier) {
    if (a.tableAlias != b.tableAlias) {
        throw new Error(`Table alias mismatch ${a.tableAlias} != ${b.tableAlias}`);
    }
    if (a.columnAlias != b.columnAlias) {
        throw new Error(`Column alias mismatch ${a.columnAlias} != ${b.columnAlias}`);
    }
}
