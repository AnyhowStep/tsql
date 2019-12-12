
import {ITable, TableUtil} from "../../../table";
import {ITablePerType} from "../../table-per-type";
import {isTablePerType} from "../predicate";

export type ExtractExplicitAutoIncrementValueEnabled<
    T extends ITable|ITablePerType
> =
    T extends ITablePerType ?
    T["explicitAutoIncrementValueEnabled"][number] :
    T extends ITable ?
    (
        T["explicitAutoIncrementValueEnabled"] extends true ?
        Extract<T["autoIncrement"], string> :
        never
    ) :
    never
;

export function extractExplicitAutoIncrementValueEnabled<T extends ITable|ITablePerType> (
    t : T
) : ExtractExplicitAutoIncrementValueEnabled<T>[] {
    if (isTablePerType(t)) {
        return [...t.explicitAutoIncrementValueEnabled] as string[] as ExtractExplicitAutoIncrementValueEnabled<T>[];
    } else if (TableUtil.isTable(t)) {
        return (
            //eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            t.explicitAutoIncrementValueEnabled ?
            (
                t.autoIncrement == undefined ?
                [] :
                [t.autoIncrement]
            ) :
            []
        ) as string[] as ExtractExplicitAutoIncrementValueEnabled<T>[];
    } else {
        throw new Error(`Expected ITable or ITablePerType`);
    }
}
