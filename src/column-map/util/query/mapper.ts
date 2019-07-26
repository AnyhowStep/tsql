import * as tm from "type-mapping";
import {ColumnMap} from "../../column-map";
import {TypeMapUtil} from "../../../type-map";

export type Mapper<MapT extends ColumnMap> = (
    MapT extends ColumnMap ?
    tm.SafeMapper<TypeMapUtil.FromColumnMap<MapT>> :
    never
);
export function mapper<MapT extends ColumnMap> (
    map : MapT
) : Mapper<MapT> {
    const fields : tm.Field<any, any>[] = [];
    for (const columnAlias of Object.keys(map)) {
        /**
         * It's possible that this is not an `IColumnUtil`.
         * But, in general, if we pass in candidateKey and columnMap
         * without any outside hack-ery, this should be correct.
         */
        const column = map[columnAlias];
        fields.push(tm.withName(
            column.mapper,
            column.columnAlias
        ) as any);
    }
    return tm.objectFromArray(...fields) as any;
}