import * as o from "../../../../../dist/src/main";
export declare const table: o.Table<{
    readonly usedRef: {};
    readonly alias: "table";
    readonly columns: {
        readonly x: o.Column<{
            tableAlias: "table";
            name: "x";
            assertDelegate: import("type-mapping").Mapper<unknown, number>;
        }>;
        readonly y: o.Column<{
            tableAlias: "table";
            name: "y";
            assertDelegate: import("type-mapping").Mapper<unknown, string>;
        }>;
        readonly z: o.Column<{
            tableAlias: "table";
            name: "z";
            assertDelegate: import("type-mapping").Mapper<unknown, boolean>;
        }>;
        readonly w: o.Column<{
            tableAlias: "table";
            name: "w";
            assertDelegate: import("type-mapping").Mapper<unknown, Date>;
        }>;
    };
    readonly autoIncrement: undefined;
    readonly id: undefined;
    readonly primaryKey: undefined;
    readonly candidateKeys: (("x" | "y")[] | ("y" | "z")[])[];
    readonly generated: [];
    readonly isNullable: never[];
    readonly hasExplicitDefaultValue: [];
    readonly mutable: ("x" | "y" | "z" | "w")[];
    readonly parents: [];
    readonly insertAllowed: true;
    readonly deleteAllowed: true;
}>;
export declare const ck: o.CandidateKey<typeof table>;
export declare const ckad: import("type-mapping").Mapper<unknown, {
    readonly x: number;
    readonly y: string;
} | {
    readonly y: string;
    readonly z: boolean;
}>;
export declare const sk: o.SuperKey<typeof table>;
export declare const skad: import("type-mapping").Mapper<unknown, ({
    readonly x: number;
    readonly y: string;
} & Partial<{
    readonly z: boolean;
    readonly w: Date;
}>) | ({
    readonly y: string;
    readonly z: boolean;
} & Partial<{
    readonly x: number;
    readonly w: Date;
}>)>;
export declare const table2: o.Table<{
    readonly usedRef: {};
    readonly alias: "table";
    readonly columns: {
        readonly x: o.Column<{
            tableAlias: "table";
            name: "x";
            assertDelegate: import("type-mapping").Mapper<unknown, number>;
        }>;
        readonly y: o.Column<{
            tableAlias: "table";
            name: "y";
            assertDelegate: import("type-mapping").Mapper<unknown, string>;
        }>;
        readonly z: o.Column<{
            tableAlias: "table";
            name: "z";
            assertDelegate: import("type-mapping").Mapper<unknown, boolean>;
        }>;
        readonly w: o.Column<{
            tableAlias: "table";
            name: "w";
            assertDelegate: import("type-mapping").Mapper<unknown, Date>;
        }>;
    };
    readonly autoIncrement: undefined;
    readonly id: undefined;
    readonly primaryKey: undefined;
    readonly candidateKeys: (("x" | "y")[] | ("y" | "z")[] | ("x" | "z")[])[];
    readonly generated: [];
    readonly isNullable: never[];
    readonly hasExplicitDefaultValue: [];
    readonly mutable: ("x" | "y" | "z" | "w")[];
    readonly parents: [];
    readonly insertAllowed: true;
    readonly deleteAllowed: true;
}>;
