import * as sd from "type-mapping";
import {ITable} from "../../table";
import {MapperMap} from "../../../mapper-map";
import {AddColumnsFromFieldArray, addColumnsFromFieldArray} from "./add-columns-from-field-array";
import {AddColumnsFromMapperMap, addColumnsFromMapperMap} from "./add-columns-from-mapper-map";

export function addColumns<
    TableT extends ITable,
    FieldsT extends sd.AnyField[]
> (
    table : TableT,
    fields : FieldsT
) : (
    AddColumnsFromFieldArray<TableT, FieldsT>
);
export function addColumns<
    TableT extends ITable,
    MapperMapT extends MapperMap
> (
    table : TableT,
    assertMap : MapperMapT
) : (
    AddColumnsFromMapperMap<TableT, MapperMapT>
);
export function addColumns (table : ITable, rawColumns : any) {
    if (Array.isArray(rawColumns)) {
        return addColumnsFromFieldArray(table, rawColumns);
    } else {
        return addColumnsFromMapperMap(table, rawColumns);
    }
}
