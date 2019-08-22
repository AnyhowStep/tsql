export * from "./table-impl";
export * from "./table";

import * as TableUtil from "./util";
export {
    TableUtil,
};

import {fromTableAlias as table} from "./util";
export {
    /**
     * Convenience function to instantiate a table.
     */
    table,
};
