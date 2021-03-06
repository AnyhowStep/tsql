import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const compound: {
    selectClause: [tsql.Column<{
        tableAlias: "myTable";
        columnAlias: "cqcTableId";
        mapper: tm.Mapper<unknown, number>;
    }>];
    compoundQueryClause: readonly tsql.CompoundQuery[];
};
