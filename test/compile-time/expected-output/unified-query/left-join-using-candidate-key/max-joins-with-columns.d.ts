import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const query: tsql.Query<{
    fromClause: tsql.IFromClause<{
        outerQueryJoins: undefined;
        currentJoins: readonly (tsql.Join<{
            tableAlias: "myTable";
            nullable: false;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly myTableId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly myTableId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly [];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable1";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable1";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable1";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable1";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable1";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable1";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable1";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable2";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable2";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable2";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable2";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable2";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable2";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable2";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable3";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable3";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable3";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable3";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable3";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable3";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable3";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable4";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable4";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable4";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable4";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable4";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable4";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable4";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable5";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable5";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable5";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable5";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable5";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable5";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable5";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable6";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable6";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable6";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable6";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable6";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable6";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable6";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable7";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable7";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable7";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable7";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable7";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable7";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable7";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable8";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable8";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable8";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable8";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable8";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable8";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable8";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable9";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable9";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable9";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable9";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable9";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable9";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable9";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable10";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable10";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable10";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable10";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable10";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable10";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable10";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable11";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable11";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable11";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable11";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable11";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable11";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable11";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable12";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable12";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable12";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable12";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable12";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable12";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable12";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable13";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable13";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable13";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable13";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable13";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable13";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable13";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable14";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable14";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable14";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable14";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable14";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable14";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable14";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable15";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable15";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable15";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable15";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable15";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable15";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable15";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable16";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable16";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable16";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable16";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable16";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable16";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable16";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable17";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable17";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable17";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable17";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable17";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable17";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable17";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable18";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable18";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable18";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable18";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable18";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable18";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable18";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable19";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable19";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable19";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable19";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable19";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable19";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable19";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable20";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable20";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable20";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable20";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable20";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable20";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable20";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable21";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable21";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable21";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable21";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable21";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable21";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable21";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable22";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable22";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable22";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable22";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable22";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable22";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable22";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable23";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable23";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable23";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable23";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable23";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable23";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable23";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable24";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable24";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable24";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable24";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable24";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable24";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable24";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable25";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable25";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable25";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable25";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable25";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable25";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable25";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable26";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable26";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable26";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable26";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable26";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable26";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable26";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable27";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable27";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable27";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable27";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable27";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable27";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable27";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable28";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable28";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable28";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable28";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable28";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable28";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable28";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable29";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable29";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable29";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable29";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable29";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable29";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable29";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable30";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable30";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable30";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable30";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable30";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable30";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable30";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable31";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable31";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable31";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable31";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable31";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable31";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable31";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable32";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable32";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable32";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable32";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable32";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable32";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable32";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable33";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable33";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable33";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable33";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable33";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable33";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable33";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable34";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable34";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable34";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable34";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable34";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable34";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable34";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable35";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable35";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable35";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable35";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable35";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable35";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable35";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable36";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable36";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable36";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable36";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable36";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable36";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable36";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable37";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable37";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable37";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable37";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable37";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable37";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable37";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable38";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable38";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable38";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable38";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable38";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable38";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable38";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable39";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable39";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable39";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable39";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable39";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable39";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable39";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable40";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable40";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable40";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable40";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable40";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable40";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable40";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable41";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable41";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable41";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable41";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable41";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable41";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable41";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable42";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable42";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable42";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable42";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable42";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable42";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable42";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable43";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable43";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable43";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable43";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable43";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable43";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable43";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable44";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable44";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable44";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable44";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable44";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable44";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable44";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable45";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable45";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable45";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable45";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable45";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable45";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable45";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable46";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable46";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable46";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable46";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable46";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable46";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable46";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable47";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable47";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable47";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable47";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable47";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable47";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable47";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable48";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable48";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable48";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable48";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable48";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable48";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable48";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable49";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable49";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable49";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable49";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable49";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable49";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable49";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable50";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable50";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable50";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable50";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable50";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable50";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable50";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable51";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable51";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable51";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable51";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable51";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable51";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable51";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable52";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable52";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable52";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable52";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable52";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable52";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable52";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable53";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable53";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable53";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable53";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable53";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable53";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable53";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable54";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable54";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable54";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable54";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable54";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable54";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable54";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable55";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable55";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable55";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable55";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable55";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable55";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable55";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable56";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable56";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable56";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable56";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable56";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable56";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable56";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable57";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable57";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable57";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable57";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable57";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable57";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable57";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable58";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable58";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable58";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable58";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable58";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable58";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable58";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable59";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable59";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable59";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable59";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable59";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable59";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable59";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable60";
            nullable: true;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable60";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable60";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable60";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "myOtherTable60";
                    columnAlias: "x";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly y: tsql.Column<{
                    tableAlias: "myOtherTable60";
                    columnAlias: "y";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly z: tsql.Column<{
                    tableAlias: "myOtherTable60";
                    columnAlias: "z";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly "x"[];
            candidateKeys: readonly (readonly "x"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }>)[];
    }>;
    selectClause: undefined;
    limitClause: undefined;
    unionClause: undefined;
    unionLimitClause: undefined;
}>;
