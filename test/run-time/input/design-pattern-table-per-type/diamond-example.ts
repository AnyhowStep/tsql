import * as tsql from "../../../../dist";

export const animal = tsql.table("animal")
    .addColumns({
        appId : tsql.dtBigIntSigned(),
        animalId : tsql.dtBigIntSigned(),
        name : tsql.dtVarChar(1, 512),
        createdAt : tsql.dtDateTime(3),
        extinctAt : tsql.dtDateTime(3).orNull(),
    })
    .setAutoIncrement(c => c.animalId)
    .addExplicitDefaultValue(c => [c.createdAt])
    .addMutable(c => [
        c.name,
        c.extinctAt
    ])
    .addCandidateKey(c => [c.name]);

export const cat = tsql.table("cat")
    .addColumns({
        animalId : tsql.dtBigIntSigned(),
        name : tsql.dtVarChar(1, 512),
        purrFrequency : tsql.dtDouble().orNull(),
    })
    .setId(c => c.animalId)
    .addExplicitDefaultValue(c => [c.purrFrequency])
    .addMutable(c => [
        c.purrFrequency,
    ]);

export const dog = tsql.table("dog")
    .addColumns({
        animalId : tsql.dtBigIntSigned(),
        name : tsql.dtVarChar(1, 512),
        barksPerMinute : tsql.dtBigIntSigned().orNull(),
    })
    .setId(c => c.animalId)
    .addMutable(c => [
        c.barksPerMinute
    ]);

export const catDog = tsql.table("catDog")
    .addColumns({
        animalId : tsql.dtBigIntSigned(),
        name : tsql.dtVarChar(1, 512),
        barksPerMinute : tsql.dtBigIntSigned().orNull(),
        headsOnSameEndOfBody : tsql.dtBoolean(),
    })
    .setId(c => c.animalId)
    .addMutable(c => [
        c.headsOnSameEndOfBody
    ]);

export const catTpt = tsql.tablePerType(cat)
    .addParent(animal);

export const dogTpt = tsql.tablePerType(dog)
    .addParent(animal);

export const catDogTpt = tsql.tablePerType(catDog)
    .addParent(catTpt)
    .addParent(dogTpt);

export const createAnimalTableSql = `
CREATE TABLE animal (
    appId INTEGER NOT NULL,
    animalId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    extinctAt DATETIME
);

CREATE TABLE cat (
    animalId INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    purrFrequency DOUBLE,
    FOREIGN KEY (animalId) REFERENCES animal (animalId)
);

CREATE TABLE dog (
    animalId INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    barksPerMinute INTEGER,
    FOREIGN KEY (animalId) REFERENCES animal (animalId)
);

CREATE TABLE catDog (
    animalId INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    barksPerMinute INTEGER,
    headsOnSameEndOfBody BOOLEAN NOT NULL,
    FOREIGN KEY (animalId) REFERENCES cat (animalId),
    FOREIGN KEY (animalId) REFERENCES dog (animalId)
);

`;
