export declare const resultSet: Promise<{
    root: {
        hello: string;
        test: {
            readonly testId: bigint;
            readonly testVal: bigint;
        };
        other2: {
            readonly testId: bigint;
            readonly otherVal: bigint;
        };
        total: bigint;
    };
}[]>;
