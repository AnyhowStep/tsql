import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const compound: {
    selectClause: [{
        readonly tableACqc: {
            readonly cqcTableAId: tsql.Column<{
                tableAlias: "tableACqc";
                columnAlias: "cqcTableAId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
        };
        readonly tableBCqc: {
            readonly cqcTableBId: tsql.Column<{
                tableAlias: "tableBCqc";
                columnAlias: "cqcTableBId";
                mapper: tm.Mapper<unknown, bigint | null>;
            }>;
        };
    }];
    compoundQueryClause: readonly tsql.CompoundQuery[];
};
