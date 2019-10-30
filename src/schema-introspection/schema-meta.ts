import {TableMeta} from "./table-meta";

export interface SchemaMeta {
    schemaAlias : string,

    tables : readonly TableMeta[],
}
