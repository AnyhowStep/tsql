import * as tsql from "../../../../dist";

export const a1 = tsql.table("a1")
    .addColumns({
        a1Id : tsql.dtBigIntSigned(),
        a1Name : tsql.dtVarChar(1, 512),
        createdAt : tsql.dtDateTime(3),
    })
    .setAutoIncrement(c => c.a1Id)
    .addExplicitDefaultValue(c => [c.createdAt])
    .addMutable(c => [
        c.a1Name,
    ])
    .addCandidateKey(c => [c.a1Name]);

export const a2 = tsql.table("a2")
    .addColumns({
        a2Id : tsql.dtBigIntSigned(),
        a2Name : tsql.dtVarChar(1, 512),
        createdAt : tsql.dtDateTime(3),
    })
    .setAutoIncrement(c => c.a2Id)
    .addExplicitDefaultValue(c => [c.createdAt])
    .addMutable(c => [
        c.a2Name,
    ])
    .addCandidateKey(c => [c.a2Name]);

export const a3 = tsql.table("a3")
    .addColumns({
        a3Id : tsql.dtBigIntSigned(),
        a3Name : tsql.dtVarChar(1, 512),
        createdAt : tsql.dtDateTime(3),
    })
    .setAutoIncrement(c => c.a3Id)
    .addExplicitDefaultValue(c => [c.createdAt])
    .addMutable(c => [
        c.a3Name,
    ])
    .addCandidateKey(c => [c.a3Name]);

export const a4 = tsql.table("a4")
    .addColumns({
        a4Id : tsql.dtBigIntSigned(),
        a4Name : tsql.dtVarChar(1, 512),
        createdAt : tsql.dtDateTime(3),
    })
    .setAutoIncrement(c => c.a4Id)
    .addExplicitDefaultValue(c => [c.createdAt])
    .addMutable(c => [
        c.a4Name,
    ])
    .addCandidateKey(c => [c.a4Name]);

export const b1 = tsql.table("b1")
    .addColumns({
        b1Id : tsql.dtBigIntSigned(),
        a1Id : tsql.dtBigIntSigned(),
        a2Id : tsql.dtBigIntSigned(),
        a1Name : tsql.dtVarChar(1, 512),
        b1Name : tsql.dtVarChar(1, 512),
        createdAt : tsql.dtDateTime(3),
    })
    .setAutoIncrement(c => c.b1Id)
    .addExplicitDefaultValue(c => [c.createdAt])
    .addMutable(c => [
        c.a1Name,
    ]);

export const b2 = tsql.table("b2")
    .addColumns({
        a3Id : tsql.dtBigIntSigned(),
        a4Id : tsql.dtBigIntSigned(),
        b2Name : tsql.dtVarChar(1, 512),
        createdAt : tsql.dtDateTime(3),
    })
    .setPrimaryKey(c => [c.a3Id])
    .addExplicitDefaultValue(c => [c.createdAt])
    .addMutable(c => [
        c.b2Name,
    ]);

export const c = tsql.table("c")
    .addColumns({
        b1Id : tsql.dtBigIntSigned(),
        a3Id : tsql.dtBigIntSigned(),
        b2Name : tsql.dtVarChar(1, 512),
        createdAt : tsql.dtDateTime(3),
    })
    .setPrimaryKey(c => [c.b1Id, c.a3Id])
    .addExplicitDefaultValue(c => [c.createdAt])
    .addMutable(c => [
        c.b2Name,
    ]);

export const b1Tpt = tsql.tablePerType(b1)
    .addParent(a1)
    .addParent(a2);

export const b2Tpt = tsql.tablePerType(b2)
    .addParent(a3)
    .addParent(a4);

export const cTpt = tsql.tablePerType(c)
    .addParent(b1Tpt)
    .addParent(b2Tpt);

export const createCTableSql = `
CREATE TABLE a1 (
    a1Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    a1Name VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL
);
CREATE TABLE a2 (
    a2Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    a2Name VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL
);
CREATE TABLE a3 (
    a3Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    a3Name VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL
);
CREATE TABLE a4 (
    a4Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    a4Name VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL
);

CREATE TABLE b1 (
    b1Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    a1Id INTEGER NOT NULL,
    a2Id INTEGER NOT NULL,
    a1Name VARCHAR(255) NOT NULL,
    b1Name VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    FOREIGN KEY (a1Id) REFERENCES a1 (a1Id),
    FOREIGN KEY (a2Id) REFERENCES a2 (a2Id)
);

CREATE TABLE b2 (
    a3Id INTEGER NOT NULL PRIMARY KEY,
    a4Id INTEGER NOT NULL,
    b2Name VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    FOREIGN KEY (a3Id) REFERENCES a3 (a3Id),
    FOREIGN KEY (a4Id) REFERENCES a4 (a4Id)
);

CREATE TABLE c (
    b1Id INTEGER NOT NULL,
    a3Id INTEGER NOT NULL,
    b2Name VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    FOREIGN KEY (b1Id) REFERENCES b1 (b1Id),
    FOREIGN KEY (a3Id) REFERENCES b2 (a3Id),
    PRIMARY KEY (b1Id, a3Id)
);

`;
